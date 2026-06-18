import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useIsMobile } from './ui/use-mobile';

export function DailyConsumptionChart() {
  const isMobile = useIsMobile();

  const data = useMemo(() => [
    { hour: '00:00', consumption: 0.02 },
    { hour: '04:00', consumption: 0.01 },
    { hour: '08:00', consumption: 0.25 },
    { hour: '12:00', consumption: 0.18 },
    { hour: '16:00', consumption: 0.15 },
    { hour: '20:00', consumption: 0.28 },
    { hour: '23:59', consumption: 0.12 },
  ], []);

  // Ajustar altura según dispositivo
  const chartHeight = isMobile ? 200 : 250;
  const margin = isMobile
    ? { top: 5, right: 5, left: -20, bottom: 5 }
    : { top: 5, right: 5, left: 0, bottom: 5 };

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={chartHeight} id="daily-chart-container">
      <AreaChart
        data={data}
        margin={margin}
        id="daily-area-chart-svg"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="hour"
          stroke="#6b7280"
          style={{ fontSize: isMobile ? '10px' : '12px' }}
          tick={{ angle: isMobile ? 45 : 0 }}
          height={isMobile ? 50 : 30}
        />
        <YAxis
          stroke="#6b7280"
          style={{ fontSize: isMobile ? '10px' : '12px' }}
          width={isMobile ? 30 : 40}
        />
        <Tooltip
          contentStyle={{
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            backgroundColor: 'white',
            fontSize: isMobile ? '12px' : '14px',
            padding: '8px 12px'
          }}
        />
        <Area
          type="monotone"
          dataKey="consumption"
          stroke="#3b82f6"
          strokeWidth={isMobile ? 1.5 : 2}
          fill="#93c5fd"
          fillOpacity={0.3}
          name="Consumo (m³)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
