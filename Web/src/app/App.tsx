import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { DashboardLayout } from './components/DashboardLayout';
import { RegisterScreen } from './components/RegisterScreen';
import { PrivacyConsent } from './components/PrivacyConsent';
import { Toaster } from './components/ui/sonner';
import { Loader2 } from 'lucide-react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { FloatingLanguageSwitcher } from './components/FloatingLanguageSwitcher';
import '../i18n/config';
import { useTranslation } from 'react-i18next';
import logoImage from '../imports/aaa-Photoroom-1.png';

// RNF1.1 - Tiempo de inicio: La aplicación debe iniciar en máximo 5 segundos
// RNF5.2 - Autenticación segura con tokens
export default function App() {
  const [userRole, setUserRole] = useState(null);
  const [currentView, setCurrentView] = useState('loading');
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  // Suppress known Recharts duplicate key warning
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('Encountered two children with the same key')
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  // RNF1.1 - Simular carga inicial con tiempo de inicio controlado
  useEffect(() => {
    // Verificar sesión existente y restaurar estado
    const initializeApp = async () => {
      try {
        // RF3.2 - Validar sesión existente (simulado)
        const savedSession = sessionStorage.getItem('hidrosmart_session');
        const savedRole = sessionStorage.getItem('hidrosmart_role');

        if (savedSession && savedRole) {
          // RF3.3 - Renovar token si es necesario
          setUserRole(savedRole);
          setCurrentView('dashboard');
        } else {
          setCurrentView('login');
        }
      } catch (error) {
        console.error('Error al inicializar:', error);
        setCurrentView('login');
      } finally {
        // RNF1.1 - Asegurar que la carga no exceda 5 segundos
        setTimeout(() => setIsLoading(false), 1000);
      }
    };

    initializeApp();
  }, []);

  // RF2.1, RF2.3 - Inicio de sesión con generación de tokens
  const handleLogin = (role) => {
    // RF3.1 - Crear sesión con tokens (simulado)
    const mockAccessToken = `access_${Date.now()}_${Math.random()}`;
    const mockRefreshToken = `refresh_${Date.now()}_${Math.random()}`;

    // RNF5.2 - Almacenar tokens de forma segura
    sessionStorage.setItem('hidrosmart_session', mockAccessToken);
    sessionStorage.setItem('hidrosmart_refresh', mockRefreshToken);
    sessionStorage.setItem('hidrosmart_role', role);

    // RF19.1 - Registrar inicio de sesión en auditoría
    const auditLog = {
      action: 'LOGIN',
      role: role,
      timestamp: new Date().toISOString(),
      ipAddress: 'Simulado'
    };
    console.log('Auditoría:', auditLog);

    setUserRole(role);
    setCurrentView('dashboard');
  };

  // RF3.4 - Cerrar sesión y revocar tokens
  const handleLogout = () => {
    // RF19.1 - Registrar cierre de sesión
    const auditLog = {
      action: 'LOGOUT',
      role: userRole,
      timestamp: new Date().toISOString()
    };
    console.log('Auditoría:', auditLog);

    // Limpiar sesión
    sessionStorage.removeItem('hidrosmart_session');
    sessionStorage.removeItem('hidrosmart_refresh');
    sessionStorage.removeItem('hidrosmart_role');

    setUserRole(null);
    setCurrentView('login');
  };

  const handleRegisterClick = () => {
    setCurrentView('privacy');
  };

  const handlePrivacyAccept = () => {
    setCurrentView('register');
  };

  const handlePrivacyReject = () => {
    setCurrentView('login');
  };

  const handleRegisterSuccess = () => {
    setCurrentView('login');
  };

  const handleBackToLogin = () => {
    setCurrentView('login');
  };

  // RNF1.1 - Pantalla de carga inicial (máximo 5 segundos)
  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100">
          <div className="text-center space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="bg-blue-600 p-4 rounded-2xl">
                <img src={logoImage} alt="HidroSmart Logo" className="h-32 w-auto mx-auto animate-pulse" />
              </div>
              <Loader2 className="size-10 text-blue-600 animate-spin absolute -bottom-2 -right-2" />
            </div>
            <h2 className="text-3xl text-blue-900 hidrosmart-logo">{t('app.name')}</h2>
            <p className="text-gray-600">{t('app.loadingSystem')}</p>
            <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 animate-pulse" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // RF1.3 - Pantalla de consentimiento de privacidad (RNF8.2 - Cumplimiento Ley 1581/2012)
  if (currentView === 'privacy') {
    return (
      <ThemeProvider>
        <PrivacyConsent onAccept={handlePrivacyAccept} onReject={handlePrivacyReject} />
        <FloatingLanguageSwitcher />
        <Toaster />
      </ThemeProvider>
    );
  }

  // RF1 - Pantalla de registro
  if (currentView === 'register') {
    return (
      <ThemeProvider>
        <RegisterScreen onRegisterSuccess={handleRegisterSuccess} onBack={handleBackToLogin} />
        <FloatingLanguageSwitcher />
        <Toaster />
      </ThemeProvider>
    );
  }

  // RF2 - Pantalla de login
  if (currentView === 'login') {
    return (
      <ThemeProvider>
        <LoginScreen onLogin={handleLogin} onRegisterClick={handleRegisterClick} />
        <FloatingLanguageSwitcher />
        <Toaster />
      </ThemeProvider>
    );
  }

  // Dashboard principal con todos los módulos
  return (
    <ThemeProvider>
      <DashboardLayout userRole={userRole} onLogout={handleLogout} />
      <FloatingLanguageSwitcher />
      <Toaster />
    </ThemeProvider>
  );
}