import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator, StatusBar, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import webBundle from './src/webBundle';

const androidStatusBarOffset = Platform.OS === 'android'
  ? Math.max(StatusBar.currentHeight ?? 0, 38)
  : 0;

export default function App() {
  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#eff6ff" translucent={false} />
      <WebView
        originWhitelist={["*"]}
        source={{ html: webBundle, baseUrl: 'https://hidrosmart.local/' }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        allowUniversalAccessFromFileURLs
        setSupportMultipleWindows={false}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator color="#2563eb" size="large" />
            <Text style={styles.loadingText}>Cargando HidroSmart...</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#eff6ff',
    paddingTop: androidStatusBarOffset
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff'
  },
  loadingText: {
    marginTop: 12,
    color: '#475569',
    fontSize: 14
  }
});
