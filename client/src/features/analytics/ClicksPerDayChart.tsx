import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ClicksPerDay } from '../../services/api';

interface ClicksPerDayChartProps {
  data: ClicksPerDay[];
}

export function ClicksPerDayChart({ data }: ClicksPerDayChartProps) {
  if (data.length === 0) {
    return <p className="text-text-muted text-sm">No clicks yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#2b2b2b" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" stroke="#616161" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#616161" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #2b2b2b', borderRadius: 6 }}
          labelStyle={{ color: '#fafafa' }}
          itemStyle={{ color: '#f5f5f5' }}
        />
        <Line type="monotone" dataKey="count" stroke="#f5f5f5" strokeWidth={2} dot={{ fill: '#f5f5f5', r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}