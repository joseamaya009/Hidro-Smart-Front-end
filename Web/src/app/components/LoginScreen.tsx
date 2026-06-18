import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Eye, EyeOff, AlertCircle, Info, CheckCircle2, Circle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner';
import logoImage from '../../imports/aaa-Photoroom-1.png';

interface LoginScreenProps {
  onLogin: (role: 'admin' | 'technician' | 'user') => void;
  onRegisterClick: () => void;
}

export function LoginScreen({ onLogin, onRegisterClick }: LoginScreenProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordChecklistVisible, setIsPasswordChecklistVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const passwordRequirements = [
    { label: t('auth.passwordMinCharacters'), isValid: registerPassword.length >= 8 },
    { label: t('auth.passwordUppercase'), isValid: /[A-ZÁÉÍÓÚÑ]/.test(registerPassword) },
    { label: t('auth.passwordLowercase'), isValid: /[a-záéíóúñ]/.test(registerPassword) },
    { label: t('auth.passwordNumber'), isValid: /\d/.test(registerPassword) },
    { label: t('auth.passwordSymbol'), isValid: /[^A-Za-zÁÉÍÓÚÑáéíóúñ0-9]/.test(registerPassword) }
  ];

  const shouldShowPasswordMismatch =
    confirmPassword.length > 0 && registerPassword !== confirmPassword;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error(t('auth.completeAllFields'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t('auth.invalidEmail'));
      return;
    }

    if (password.length < 6) {
      toast.error(t('auth.passwordMinLogin'));
      return;
    }

    onLogin('user');
  };

  const handlePasswordReset = () => {
    if (!resetEmail) {
      toast.error(t('auth.enterEmail'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      toast.error(t('auth.invalidEmail'));
      return;
    }

    toast.success(t('auth.emailSent'), {
      description: t('auth.passwordResetEmailSent')
    });

    setIsResetDialogOpen(false);
    setResetEmail('');
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100 p-3 sm:p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8 items-center">
        <div className="text-center md:text-left space-y-3 md:space-y-6">
          <div className="flex min-w-0 items-center justify-center md:justify-start gap-3 sm:gap-4">
            <div className="bg-blue-600 p-2 rounded-xl sm:p-3 sm:rounded-2xl">
              <img src={logoImage} alt="HidroSmart Logo" className="h-12 w-auto sm:h-20" />
            </div>
            <h1 className="min-w-0 break-words text-2xl sm:text-5xl text-blue-900 hidrosmart-logo">{t('app.name')}</h1>
          </div>
          <h2 className="text-base sm:text-2xl text-blue-800">{t('app.tagline')}</h2>
          <p className="hidden text-blue-700 sm:block">
            {t('login.description')}
          </p>
          <div className="hidden sm:grid grid-cols-3 gap-4 pt-4">
            <div className="text-center">
              <div className="text-3xl text-blue-600">24/7</div>
              <div className="text-sm text-blue-700">{t('login.monitoring247')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl text-blue-600">IoT</div>
              <div className="text-sm text-blue-700">{t('login.smartDevices')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl text-blue-600">100%</div>
              <div className="text-sm text-blue-700">{t('login.secure')}</div>
            </div>
          </div>
        </div>

        <Card className="w-full shadow-2xl">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mobile-equal-tabs sm:w-full [--mobile-tabs:2]">
              <TabsTrigger value="login" className="w-full">{t('auth.login')}</TabsTrigger>
              <TabsTrigger value="register" className="w-full">{t('auth.register')}</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle>{t('auth.login')}</CardTitle>
                  <CardDescription>
                    {t('auth.enterCredentials')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.email')} *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('auth.emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">{t('auth.password')} *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-gray-500 hover:text-gray-700"
                        aria-label={showPassword ? t('common.hide') : t('common.show')}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                    <DialogTrigger asChild>
                      <button type="button" className="h-auto min-h-0 p-0 text-left text-sm text-blue-600 hover:underline">
                        {t('auth.forgotPassword')}
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('auth.recoverPassword')}</DialogTitle>
                        <DialogDescription>
                          {t('auth.recoverPasswordDesc')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="resetEmail">{t('auth.email')}</Label>
                          <Input
                            id="resetEmail"
                            type="email"
                            placeholder={t('auth.emailPlaceholder')}
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                          />
                        </div>
                        <Alert>
                          <Info className="size-4" />
                          <AlertDescription className="text-xs">
                            {t('auth.resetLinkAuditNotice')}
                          </AlertDescription>
                        </Alert>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
                          {t('common.cancel')}
                        </Button>
                        <Button onClick={handlePasswordReset}>
                          {t('auth.sendLink')}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    {t('auth.login')}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={(e) => { e.preventDefault(); onRegisterClick(); }}>
                <CardHeader>
                  <CardTitle>{t('auth.createAccountTitle')}</CardTitle>
                  <CardDescription>
                    {t('auth.completeRequiredFields')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('settings.fullName')} *</Label>
                    <Input id="name" placeholder={t('auth.fullNamePlaceholder')} required />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="docType">{t('settings.documentType')} *</Label>
                      <Select required>
                        <SelectTrigger id="docType">
                          <SelectValue placeholder={t('common.select')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CC">{t('settings.citizenshipId')}</SelectItem>
                          <SelectItem value="CE">{t('settings.foreignerId')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="docNumber">{t('settings.documentNumber')} *</Label>
                      <Input id="docNumber" placeholder="1234567890" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registerEmail">{t('auth.email')} *</Label>
                    <Input
                      id="registerEmail"
                      type="email"
                      placeholder={t('auth.emailPlaceholder')}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registerPassword">{t('auth.password')} *</Label>
                    <div className="relative">
                      <Input
                        id="registerPassword"
                        type={showRegisterPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        onFocus={() => setIsPasswordChecklistVisible(true)}
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-gray-500 hover:text-gray-700"
                        aria-label={showRegisterPassword ? t('common.hide') : t('common.show')}
                      >
                        {showRegisterPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    {isPasswordChecklistVisible && (
                      <div className="rounded-lg border border-blue-100 bg-blue-50/70 p-3">
                        <p className="mb-2 text-xs font-medium text-blue-900">
                          {t('auth.passwordChecklistTitle')}
                        </p>
                        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                          {passwordRequirements.map((requirement) => (
                            <div
                              key={requirement.label}
                              className={`flex min-w-0 items-center gap-2 text-xs ${
                                requirement.isValid ? 'text-emerald-700' : 'text-gray-600'
                              }`}
                            >
                              {requirement.isValid ? (
                                <CheckCircle2 className="size-3.5 shrink-0" />
                              ) : (
                                <Circle className="size-3.5 shrink-0" />
                              )}
                              <span className="min-w-0 break-words">{requirement.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t('auth.confirmPassword')} *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setIsPasswordChecklistVisible(true)}
                        className={`pr-10 ${shouldShowPasswordMismatch ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-gray-500 hover:text-gray-700"
                        aria-label={showConfirmPassword ? t('common.hide') : t('common.show')}
                      >
                        {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    {shouldShowPasswordMismatch && (
                      <p className="text-xs font-medium text-red-600">
                        {t('auth.passwordsDoNotMatch')}
                      </p>
                    )}
                  </div>

                  <Alert>
                    <AlertCircle className="size-4" />
                    <AlertDescription className="text-xs">
                      {t('auth.verificationEmailNotice')}
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    {t('auth.createAccountTitle')}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
