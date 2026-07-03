import { creationButtonLabels } from '../constants/creationButtonLabels';

const webReadOnlyCreationPolicy = `
  <script>
    window.__HIDROSMART_CAN_CREATE_RESOURCES__ = false;

    (function () {
      var creationLabels = ${JSON.stringify(creationButtonLabels)};
      var interactiveSelector = 'button, a, [role="button"], [data-slot="dialog-trigger"]';

      function normalize(text) {
        return (text || '')
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\\u0300-\\u036f]/g, '')
          .replace(/\\s+/g, ' ')
          .trim();
      }

      function isCreationControl(element) {
        var label = normalize(element.textContent || element.getAttribute('aria-label'));
        return creationLabels.some(function (creationLabel) {
          return label.indexOf(creationLabel) !== -1;
        });
      }

      function disableCreationControls() {
        document.querySelectorAll(interactiveSelector).forEach(function (element) {
          if (!isCreationControl(element)) {
            return;
          }

          element.setAttribute('aria-hidden', 'true');
          element.setAttribute('tabindex', '-1');
          element.style.display = 'none';
          element.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
          }, true);
        });
      }

      disableCreationControls();
      new MutationObserver(disableCreationControls).observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    })();
  </script>
`;

export function applyWebReadOnlyCreationPolicy(html) {
  return html.replace('</body>', `${webReadOnlyCreationPolicy}</body>`);
}
