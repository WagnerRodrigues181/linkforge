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
        <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{ backgroundColor: '#161f32', border: '1px solid #334155', borderRadius: 6 }}
          labelStyle={{ color: '#f8fafc' }}
          itemStyle={{ color: '#2dd4bf' }}
        />
        <Line type="monotone" dataKey="count" stroke="#2dd4bf" strokeWidth={2} dot={{ fill: '#2dd4bf', r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}