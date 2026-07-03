# Correcciones del instructor

## Privacidad y habeas data

- Se reemplazo la referencia informal anterior por una redaccion compatible con la Ley 1581 de 2012 y normas que la modifiquen o complementen.
- Se agregó autorización expresa para tratar datos de ubicación de dispositivos con fines de monitoreo, instalación, soporte y asociación de sensores a hogares.
- Se agregó información del responsable del tratamiento de datos: HidroSmart S.A.S., correo `privacidad@hidrosmart.local` y canal de habeas data desde el módulo de privacidad o correo.
- Los enlaces de términos y política de privacidad quedaron como hipervínculos.
- La eliminacion de cuenta ahora informa un periodo de arrepentimiento de 5 dias calendario.

## Registro y backend temporal

- El login ya no muestra un formulario de registro duplicado. El tab de registro ahora dirige al consentimiento de privacidad y el formulario real aparece una sola vez despues de aceptar.
- El formulario real de registro usa traducciones.
- Se agregaron validaciones de nombre, correo, documento, contraseña, confirmación y aceptación de políticas.
- Se agregó backend temporal en `localStorage` con usuarios de prueba:
  - `admin@aquamonitor.com`, documento `1234567890`.
  - `tecnico@aquamonitor.com`, documento `0987654321`.
- Los nuevos registros se guardan en `hidrosmart_test_users` y se usan para validar duplicados.

## 2FA

- El modulo 2FA quedo traducido con claves `twoFactor.*`.
- El prototipo conserva dos metodos visibles: app autenticadora y SMS.
- Para implementación real se recomienda TOTP con apps autenticadoras y códigos de respaldo. OWASP recomienda evaluar MFA según riesgo, gestionar cambios/reset de factores y considerar passkeys cuando sea viable: https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html
- Para una evolucion passwordless, WebAuthn permite credenciales de clave publica/passkeys desde el navegador: https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API

## Scheduler

- Para tareas programadas en Expo se recomienda evaluar `expo-task-manager` cuando la tarea deba ejecutarse como trabajo registrado en la app: https://docs.expo.dev/versions/latest/sdk/task-manager/
- Casos candidatos en HidroSmart: resumen diario de consumo, verificacion periodica de dispositivos sin conexion, recordatorios de metas y limpieza de solicitudes de eliminacion vencidas.

## Vigilancia tecnologica para agregar dispositivos

- Para aprovisionamiento IoT real se recomienda investigar flujos con código QR, claim certificate o credenciales temporales, asociación del dispositivo al hogar y confirmación desde backend.
- AWS IoT documenta el patron de fleet provisioning para dispositivos sin certificado propio inicial: https://docs.aws.amazon.com/iot/latest/developerguide/provision-wo-cert.html
- En el prototipo se mantiene el alta manual de dispositivo con ID, nombre, ubicación y umbral; el siguiente paso sería conectar ese flujo a un backend temporal o real.
