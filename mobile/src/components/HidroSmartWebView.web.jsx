import React from 'react';

import webBundle from '../webBundle';

const creationButtonLabels = [
  'registrar hogar',
  'registrar nuevo hogar',
  'registrar dispositivo',
  'registrar nuevo dispositivo',
  'agregar hogar',
  'agregar nuevo hogar',
  'agregar dispositivo',
  'agregar nuevo dispositivo',
  'add home',
  'add new home',
  'add device',
  'add new device',
  'register home',
  'register new home',
  'register device',
  'register new device',
  'new home',
  'new device',
  'novo lar',
  'novo dispositivo',
  'nuova casa',
  'nuovo dispositivo',
];

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

const webBundleWithoutCreation = webBundle.replace('</body>', `${webReadOnlyCreationPolicy}</body>`);

export function HidroSmartWebView() {
  return (
    <iframe
      title="HidroSmart"
      srcDoc={webBundleWithoutCreation}
      style={styles.frame}
      sandbox="allow-downloads allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
    />
  );
}

const styles = {
  frame: {
    width: '100%',
    height: '100%',
    flex: 1,
    border: 0,
    display: 'block',
    backgroundColor: 'transparent',
  },
};
