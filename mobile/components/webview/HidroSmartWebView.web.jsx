import React from 'react';

import { applyWebReadOnlyCreationPolicy } from '../../policies/webReadOnlyCreationPolicy';
import webBundle from '../../app/webBundle';

const webBundleWithoutCreation = applyWebReadOnlyCreationPolicy(webBundle);

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
