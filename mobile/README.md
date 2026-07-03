# HidroSmart Expo

Esta carpeta es el punto de entrada principal con Expo.

## Estructura

- `index.js`: registra la app en Expo.
- `src/App.jsx`: raiz de la aplicacion mobile.
- `src/components/MobileShell.jsx`: contenedor principal de la pantalla mobile.
- `src/components/AppStatusBar.jsx`: barra de estado de la app.
- `src/components/HidroSmartWebView.jsx`: carga el frontend real embebido en Android/iOS.
- `src/components/HidroSmartWebView.web.jsx`: carga el frontend real embebido en Expo Web.
- `src/webBundle.js`: frontend web real empaquetado como archivo estatico dentro de Expo.
- `src/constants/colors.js`: colores compartidos.
- `src/constants/layout.js`: espaciado seguro para la barra superior de Android.

## Como abrirla

1. Instala dependencias:
   ```bash
   npm install
   ```

2. Inicia Expo:
   ```bash
   npm start
   ```

3. Escanea el QR con Expo Go.

4. Si quieres abrirla en el navegador del PC, presiona `w` en la consola de Expo.

El proyecto ya no depende de una carpeta `Web` ni ejecuta Vite al instalar o iniciar. Todo se ejecuta desde `mobile` con Expo.
