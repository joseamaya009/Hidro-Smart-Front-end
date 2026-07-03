import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

import { HidroSmartWebView, MobileShell } from '../components';

export default function App() {
  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    NavigationBar.setStyle('dark');
  }, []);

  return (
    <MobileShell>
      <HidroSmartWebView />
    </MobileShell>
  );
}
