import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ClicksPerDevice } from '../../services/api';

interface ClicksPerDeviceChartProps {
  data: ClicksPerDevice[];
}

export function ClicksPerDeviceChart({ data }: ClicksPerDeviceChartProps) {
  if (data.length === 0) {
    return <p className="text-text-muted text-sm">No clicks yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(120, data.length * 40)}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#334155" strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="device"
          stroke="#94a3b8"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={120}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#161f32', border: '1px solid #334155', borderRadius: 6 }}
          labelStyle={{ color: '#f8fafc' }}
          itemStyle={{ color: '#2dd4bf' }}
        />
        <Bar dataKey="count" fill="#2dd4bf" radius={[0, 4, 4, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}