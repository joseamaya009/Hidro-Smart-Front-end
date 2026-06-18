import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Shield, Smartphone, Mail, CheckCircle2, AlertCircle, Copy, Key } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

interface TwoFactorAuthProps {
  userRole: 'admin' | 'technician' | 'user';
}

// RF36 - Autenticación de doble factor (2FA)
export function TwoFactorAuth({ userRole }: TwoFactorAuthProps) {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [setupStep, setSetupStep] = useState<'disabled' | 'setup' | 'verify' | 'enabled'>('disabled');
  const [method, setMethod] = useState<'app' | 'sms'>('app');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  // Código QR simulado para app de autenticación
  const qrCodeSecret = 'JBSWY3DPEHPK3PXP';

  // RF36.1 - Habilitar 2FA
  const handleEnable2FA = () => {
    setSetupStep('setup');
    // Generar códigos de respaldo
    const codes = Array.from({ length: 8 }, () => 
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );
    setBackupCodes(codes);
  };

  // RF36.2 - Verificar código 2FA
  const handleVerify2FA = () => {
    // Simular verificación (en producción, validar con backend)
    if (verificationCode === '123456' || verificationCode.length === 6) {
      setIs2FAEnabled(true);
      setSetupStep('enabled');
      // RF36.4 - Registrar en auditoría
      console.log('2FA habilitado - Registrado en auditoría:', {
        user: userRole,
        action: '2FA_ENABLED',
        method: method,
        timestamp: new Date().toISOString()
      });
      toast.success('Autenticación de dos factores habilitada exitosamente');
    } else {
      toast.error('Código de verificación inválido');
    }
  };

  // RF36.3 - Desactivar 2FA
  const handleDisable2FA = () => {
    setIs2FAEnabled(false);
    setSetupStep('disabled');
    setVerificationCode('');
    // RF36.4 - Registrar en auditoría
    console.log('2FA deshabilitado - Registrado en auditoría:', {
      user: userRole,
      action: '2FA_DISABLED',
      timestamp: new Date().toISOString()
    });
    toast.success('Autenticación de dos factores deshabilitada');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado al portapapeles');
  };

  const copyAllBackupCodes = () => {
    const codes = backupCodes.join('\n');
    navigator.clipboard.writeText(codes);
    toast.success('Códigos de respaldo copiados');
  };

  return (
    <div className="space-y-6">
      {/* Estado actual de 2FA */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${is2FAEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Shield className={`size-6 ${is2FAEnabled ? 'text-green-600' : 'text-gray-600'}`} />
              </div>
              <div>
                <CardTitle>Autenticación de Dos Factores (2FA)</CardTitle>
                <CardDescription>
                  Agrega una capa adicional de seguridad a tu cuenta
                </CardDescription>
              </div>
            </div>
            <Badge variant={is2FAEnabled ? 'default' : 'secondary'} className={is2FAEnabled ? 'bg-green-600' : ''}>
              {is2FAEnabled ? (
                <><CheckCircle2 className="size-3 mr-1" /> Activo</>
              ) : (
                <><AlertCircle className="size-3 mr-1" /> Inactivo</>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {setupStep === 'disabled' && (
            <div className="space-y-4">
              <Alert>
                <Shield className="size-4" />
                <AlertDescription>
                  La autenticación de dos factores añade una capa extra de seguridad requiriendo
                  un código adicional al iniciar sesión o modificar datos sensibles.
                </AlertDescription>
              </Alert>
              <Button onClick={handleEnable2FA} className="w-full">
                <Key className="size-4 mr-2" />
                Habilitar Autenticación de Dos Factores
              </Button>
            </div>
          )}

          {setupStep === 'setup' && (
            <Tabs value={method} onValueChange={(v) => setMethod(v as 'app' | 'sms')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="app">
                  <Smartphone className="size-4 mr-2" />
                  App de Autenticación
                </TabsTrigger>
                <TabsTrigger value="sms">
                  <Mail className="size-4 mr-2" />
                  SMS
                </TabsTrigger>
              </TabsList>

              <TabsContent value="app" className="space-y-4 mt-4">
                <Alert>
                  <Smartphone className="size-4" />
                  <AlertDescription>
                    Escanea este código QR con una app de autenticación como Google Authenticator,
                    Authy o Microsoft Authenticator
                  </AlertDescription>
                </Alert>

                {/* QR Code simulado */}
                <div className="flex justify-center p-6 bg-white border-2 border-dashed rounded-lg">
                  <div className="text-center space-y-3">
                    <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-4xl">🔲</div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">O ingresa el código manualmente:</p>
                      <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                        <code className="text-sm">{qrCodeSecret}</code>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyToClipboard(qrCodeSecret)}
                        >
                          <Copy className="size-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Ingresa el código de 6 dígitos de tu app</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={verificationCode}
                      onChange={setVerificationCode}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setSetupStep('disabled')} className="flex-1">
                    Cancelar
                  </Button>
                  <Button onClick={handleVerify2FA} disabled={verificationCode.length !== 6} className="flex-1">
                    Verificar y Activar
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="sms" className="space-y-4 mt-4">
                <Alert>
                  <Mail className="size-4" />
                  <AlertDescription>
                    Recibirás un código de 6 dígitos por SMS cada vez que inicies sesión
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <Label htmlFor="phone">Número de teléfono</Label>
                  <Input 
                    id="phone"
                    type="tel" 
                    placeholder="+57 300 123 4567"
                  />
                </div>

                <Button className="w-full">
                  Enviar Código de Verificación
                </Button>

                <div className="space-y-3">
                  <Label>Ingresa el código recibido por SMS</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={verificationCode}
                      onChange={setVerificationCode}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setSetupStep('disabled')} className="flex-1">
                    Cancelar
                  </Button>
                  <Button onClick={handleVerify2FA} disabled={verificationCode.length !== 6} className="flex-1">
                    Verificar y Activar
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}

          {setupStep === 'enabled' && (
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="size-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  La autenticación de dos factores está activa. Tu cuenta está más segura.
                </AlertDescription>
              </Alert>

              {/* Códigos de respaldo */}
              <div className="space-y-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="size-4 text-amber-700" />
                    <span className="font-semibold text-amber-900">Códigos de Respaldo</span>
                  </div>
                  <Button size="sm" variant="outline" onClick={copyAllBackupCodes}>
                    <Copy className="size-3 mr-2" />
                    Copiar Todos
                  </Button>
                </div>
                <p className="text-sm text-amber-800">
                  Guarda estos códigos en un lugar seguro. Puedes usarlos si pierdes acceso
                  a tu método de autenticación principal.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between bg-white p-2 rounded border border-amber-300"
                    >
                      <code className="text-sm">{code}</code>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => copyToClipboard(code)}
                      >
                        <Copy className="size-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Autenticación de Dos Factores</p>
                  <p className="text-sm text-gray-600">Método: {method === 'app' ? 'App de Autenticación' : 'SMS'}</p>
                </div>
                <Switch checked={is2FAEnabled} onCheckedChange={handleDisable2FA} />
              </div>

              <Alert>
                <AlertCircle className="size-4" />
                <AlertDescription>
                  Al desactivar 2FA, tu cuenta será menos segura. Se enviará un correo de confirmación.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historial de actividad 2FA (simulado) */}
      {is2FAEnabled && (
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente de 2FA</CardTitle>
            <CardDescription>Últimos eventos relacionados con autenticación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: '2FA habilitado', date: new Date().toISOString(), status: 'success' },
                { action: 'Código verificado correctamente', date: new Date().toISOString(), status: 'success' },
              ].map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="size-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">{event.action}</p>
                      <p className="text-xs text-gray-600">
                        {new Date(event.date).toLocaleString('es-CO')}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Exitoso
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
