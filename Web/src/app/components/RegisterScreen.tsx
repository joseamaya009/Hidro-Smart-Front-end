import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Eye, EyeOff, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';

interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onBack: () => void;
}

// RF1 - Registro de Usuario
export function RegisterScreen({ onRegisterSuccess, onBack }: RegisterScreenProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    docType: '',
    docNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  // RF1.2 - Validación de contraseña
  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSymbol,
      isValid: hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSymbol
    };
  };

  const passwordValidation = validatePassword(formData.password);
  const passwordStrength = 
    (passwordValidation.hasMinLength ? 20 : 0) +
    (passwordValidation.hasUpperCase ? 20 : 0) +
    (passwordValidation.hasLowerCase ? 20 : 0) +
    (passwordValidation.hasNumber ? 20 : 0) +
    (passwordValidation.hasSymbol ? 20 : 0);

  // RF1.4 - Validar documentos únicos (simulado)
  const validateUniqueDocument = (docNumber: string) => {
    // En producción, esto verificaría en la base de datos
    const existingDocs = ['1234567890', '0987654321'];
    return !existingDocs.includes(docNumber);
  };

  // RF1.4 - Validar email único (simulado)
  const validateUniqueEmail = (email: string) => {
    // En producción, esto verificaría en la base de datos
    const existingEmails = ['admin@aquamonitor.com', 'tecnico@aquamonitor.com'];
    return !existingEmails.includes(email);
  };

  // RF1.1, RF1.3 - Validar todos los campos
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos obligatorios
    if (!formData.name || !formData.email || !formData.docType || !formData.docNumber || !formData.password) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    // RF1.1 - No se admiten menores de edad (simulado con validación de documento)
    if (formData.docType === 'TI') {
      toast.error('No se admiten registros con Tarjeta de Identidad. Debes ser mayor de edad.');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Por favor ingresa un correo electrónico válido');
      return;
    }

    // RF1.4 - Validar email único
    if (!validateUniqueEmail(formData.email)) {
      toast.error('Este correo electrónico ya está registrado');
      return;
    }

    // RF1.4 - Validar documento único
    if (!validateUniqueDocument(formData.docNumber)) {
      toast.error('Este número de documento ya está registrado');
      return;
    }

    // RF1.2 - Validar contraseña
    if (!passwordValidation.isValid) {
      toast.error('La contraseña no cumple con los requisitos de seguridad');
      return;
    }

    // Validar confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    // RF7.1 - Validar aceptación de políticas
    if (!acceptedTerms || !acceptedPrivacy) {
      toast.error('Debes aceptar los términos y condiciones y la política de privacidad');
      return;
    }

    // RF1.5 - Enviar correo de verificación
    console.log('Registro exitoso:', {
      ...formData,
      consentimientos: {
        terminos: acceptedTerms,
        privacidad: acceptedPrivacy,
        timestamp: new Date().toISOString()
      }
    });

    toast.success('Cuenta creada exitosamente', {
      description: 'Se ha enviado un correo de verificación a ' + formData.email
    });

    // Simular redirección a verificación
    setTimeout(() => {
      onRegisterSuccess();
    }, 2000);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-blue-50 to-cyan-100 p-3 sm:flex sm:items-center sm:justify-center sm:p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="pb-2 sm:pb-0">
          <CardTitle>Crear Cuenta en HidroSmart</CardTitle>
          <CardDescription>
            Completa todos los campos obligatorios para registrarte
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* RF1.1 - Nombre completo */}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo *</Label>
              <Input 
                id="name" 
                placeholder="Juan Pérez"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                required 
              />
            </div>

            {/* RF1.1 - Tipo y número de documento (C.C/C.E) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="docType">Tipo de documento *</Label>
                <Select 
                  value={formData.docType}
                  onValueChange={(value) => updateFormData('docType', value)}
                  required
                >
                  <SelectTrigger id="docType">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CC">Cédula de Ciudadanía (C.C)</SelectItem>
                    <SelectItem value="CE">Cédula de Extranjería (C.E)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-600">
                  No se admiten menores de edad (T.I)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="docNumber">Número de documento *</Label>
                <Input 
                  id="docNumber" 
                  placeholder="1234567890"
                  value={formData.docNumber}
                  onChange={(e) => updateFormData('docNumber', e.target.value)}
                  required 
                />
              </div>
            </div>

            {/* RF1.1 - Correo electrónico */}
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico *</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="usuario@ejemplo.com"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                required 
              />
            </div>

            {/* RF1.2 - Contraseña con requisitos */}
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              
              {/* RF1.2 - Indicador de fortaleza de contraseña */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Progress value={passwordStrength} className="flex-1" />
                    <span className="text-xs text-gray-600">{passwordStrength}%</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className={`flex items-center gap-1 ${passwordValidation.hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordValidation.hasMinLength ? <CheckCircle2 className="size-3" /> : <X className="size-3" />}
                      Mínimo 8 caracteres
                    </div>
                    <div className={`flex items-center gap-1 ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordValidation.hasUpperCase ? <CheckCircle2 className="size-3" /> : <X className="size-3" />}
                      Al menos una mayúscula
                    </div>
                    <div className={`flex items-center gap-1 ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordValidation.hasLowerCase ? <CheckCircle2 className="size-3" /> : <X className="size-3" />}
                      Al menos una minúscula
                    </div>
                    <div className={`flex items-center gap-1 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordValidation.hasNumber ? <CheckCircle2 className="size-3" /> : <X className="size-3" />}
                      Al menos un número
                    </div>
                    <div className={`flex items-center gap-1 ${passwordValidation.hasSymbol ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordValidation.hasSymbol ? <CheckCircle2 className="size-3" /> : <X className="size-3" />}
                      Al menos un símbolo (!@#$%^&*)
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
              <div className="relative">
                <Input 
                  id="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-600">Las contraseñas no coinciden</p>
              )}
            </div>

            {/* RF7.1 - Aceptar políticas */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                  <span className="text-red-600">*</span> Acepto los{' '}
                  <span className="text-blue-600 underline cursor-pointer">términos y condiciones</span>{' '}
                  de HidroSmart
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="privacy"
                  checked={acceptedPrivacy}
                  onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
                />
                <Label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
                  <span className="text-red-600">*</span> Acepto la{' '}
                  <span className="text-blue-600 underline cursor-pointer">política de privacidad</span>{' '}
                  y el procesamiento de mis datos personales
                </Label>
              </div>
            </div>

            {/* RF1.5 - Información sobre verificación */}
            <Alert>
              <AlertCircle className="size-4" />
              <AlertDescription className="text-sm">
                Se enviará un correo de verificación para completar el proceso de registro
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              Volver
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
            >
              Crear Cuenta
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
