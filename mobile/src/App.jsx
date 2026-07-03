import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

import { HidroSmartWebView } from './components/HidroSmartWebView';
import { MobileShell } from './components/MobileShell';

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
