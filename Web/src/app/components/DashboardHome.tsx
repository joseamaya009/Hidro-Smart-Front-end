import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import {
  Droplets,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Wifi,
  WifiOff,
  Battery,
  Activity,
  ArrowRight
} from 'lucide-react';
import { DailyConsumptionChart } from './DailyConsumptionChart';
import { WeeklyConsumptionChart } from './WeeklyConsumptionChart';
import { useTranslation } from 'react-i18next';

interface DashboardHomeProps {
  userRole: 'admin' | 'technician' | 'user';
}

// RNF1.2 - Tiempos de respuesta menores a 3 segundos
// RNF4.3 - Notificaciones en tiempo real
// RF14 - Monitoreo en tiempo real
export function DashboardHome({ userRole }: DashboardHomeProps) {
  const { t } = useTranslation();

  // RF17 - Datos del consumo en tiempo real
  const currentConsumption = {
    today: 2.45,
    week: 15.8,
    month: 52.3,
    realTime: 0.08 // m³/hora
  };

  // RF14 - Estado de dispositivos IoT
  const devices = [
    { id: 1, name: 'Sensor Baño Principal', status: 'online', battery: 85, signal: 'excellent' },
    { id: 2, name: 'Sensor Cocina', status: 'online', battery: 92, signal: 'good' },
    { id: 3, name: 'Sensor Jardín', status: 'offline', battery: 15, signal: 'poor' },
  ];

  // RF18 - Alertas activas
  const getAlerts = () => [
    { id: 1, type: 'warning', message: `${t('dashboard.possibleLeakInGarden')} - ${t('dashboard.continuousFlowFor3Hours')}`, time: '2 horas' },
    { id: 2, type: 'info', message: t('dashboard.lowBatteryInGardenSensor'), time: '5 horas' },
    { id: 3, type: 'success', message: t('dashboard.reducedConsumption15Percent'), time: '1 día' },
  ];

  const alerts = getAlerts();

  return (
    <div className="min-w-0 space-y-7 lg:space-y-8">
      {/* RNF2.2 - Tarjetas de resumen con información clara */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardDescription>{t('dashboard.todayConsumption')}</CardDescription>
            <CardTitle className="text-2xl lg:text-3xl">{currentConsumption.today} m³</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-green-600">
              <TrendingDown className="size-4" aria-hidden="true" />
              <span className="text-sm">12% {t('dashboard.lessThanYesterday')}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardDescription>{t('dashboard.weekConsumption')}</CardDescription>
            <CardTitle className="text-2xl lg:text-3xl">{currentConsumption.week} m³</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-green-600">
              <TrendingDown className="size-4" aria-hidden="true" />
              <span className="text-sm">8% {t('dashboard.less')}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardDescription>{t('dashboard.monthConsumption')}</CardDescription>
            <CardTitle className="text-2xl lg:text-3xl">{currentConsumption.month} m³</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">
              {t('dashboard.projection')}: 78.5 m³
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardDescription>{t('dashboard.currentFlow')}</CardDescription>
            <CardTitle className="text-2xl lg:text-3xl flex items-center gap-2">
              <Activity className="size-6 text-blue-600 animate-pulse" aria-hidden="true" />
              {currentConsumption.realTime}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">
              {t('dashboard.realTimeFlow')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RF18 - Alertas y notificaciones */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <CardTitle>{t('dashboard.activeAlerts')}</CardTitle>
              <CardDescription>{t('dashboard.importantSystemNotifications')}</CardDescription>
            </div>
            <Badge variant="destructive" className="h-auto w-fit whitespace-normal">
              {alerts.filter(a => a.type === 'warning').length} {t('dashboard.criticalAlerts')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-3 p-3 sm:p-4 rounded-lg border ${
                  alert.type === 'warning' ? 'bg-orange-50 border-orange-200' :
                  alert.type === 'info' ? 'bg-blue-50 border-blue-200' :
                  'bg-green-50 border-green-200'
                }`}
                role="alert"
                aria-live="polite"
              >
                {alert.type === 'warning' && <AlertTriangle className="size-5 text-orange-600 mt-0.5 flex-shrink-0" aria-hidden="true" />}
                {alert.type === 'info' && <Battery className="size-5 text-blue-600 mt-0.5 flex-shrink-0" aria-hidden="true" />}
                {alert.type === 'success' && <CheckCircle2 className="size-5 text-green-600 mt-0.5 flex-shrink-0" aria-hidden="true" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm break-words">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{t('dashboard.ago')} {alert.time}</p>
                </div>
                <Button variant="ghost" size="icon" className="flex-shrink-0" aria-label={t('dashboard.viewDetails')}>
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* RF22 - Gráficos de consumo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.dailyConsumption')}</CardTitle>
            <CardDescription>{t('dashboard.waterConsumptionPerHour')}</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <div className="h-64 min-w-0 lg:h-80">
              <DailyConsumptionChart />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.weeklyConsumption')}</CardTitle>
            <CardDescription>{t('dashboard.waterConsumptionPerDay')}</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <div className="h-64 min-w-0 lg:h-80">
              <WeeklyConsumptionChart />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RF14 - Estado de dispositivos */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.iotDeviceStatus')}</CardTitle>
          <CardDescription>{t('dashboard.realTimeMonitoring')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map((device) => (
              <div
                key={device.id}
                className="p-4 border rounded-lg space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Droplets className="size-4 text-blue-600 flex-shrink-0" aria-hidden="true" />
                      <span className="text-sm truncate">{device.name}</span>
                    </div>
                  </div>
                  <Badge
                    variant={device.status === 'online' ? 'default' : 'destructive'}
                    className="flex-shrink-0"
                  >
                    {device.status === 'online' ? (
                      <><Wifi className="size-3 mr-1" aria-hidden="true" /> {t('dashboard.online')}</>
                    ) : (
                      <><WifiOff className="size-3 mr-1" aria-hidden="true" /> {t('dashboard.offline')}</>
                    )}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('dashboard.battery')}</span>
                    <span className={device.battery < 20 ? 'text-red-600' : 'text-gray-900'}>
                      {device.battery}%
                    </span>
                  </div>
                  <Progress value={device.battery} className="h-2" aria-label={`Nivel de batería: ${device.battery}%`} />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('dashboard.signal')}</span>
                  <Badge variant="outline" className={
                    device.signal === 'excellent' ? 'text-green-600 border-green-600' :
                    device.signal === 'good' ? 'text-blue-600 border-blue-600' :
                    'text-red-600 border-red-600'
                  }>
                    {device.signal === 'excellent' ? t('dashboard.excellent') :
                     device.signal === 'good' ? t('dashboard.good') : t('dashboard.weak')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* RF30 - Recomendaciones */}
      <Card className="mt-2 sm:mt-0">
        <CardHeader>
          <CardTitle>{t('dashboard.savingRecommendations')}</CardTitle>
          <CardDescription>{t('dashboard.personalizedSuggestions')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <Droplets className="size-5 text-green-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <p className="text-sm">{t('dashboard.yourNightConsumptionIsLow')}</p>
                <p className="text-xs text-gray-600 mt-1">{t('dashboard.continueWithTheseGoodHabits')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <TrendingDown className="size-5 text-blue-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <p className="text-sm">{t('dashboard.youCouldSave')} 15% {t('dashboard.optimizingPeakHourConsumption')}</p>
                <p className="text-xs text-gray-600 mt-1">{t('dashboard.savingPotential')} ~2.5 {t('dashboard.perMonth')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
