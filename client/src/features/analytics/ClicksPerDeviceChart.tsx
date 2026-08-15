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
        <CartesianGrid stroke="#2b2b2b" strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" stroke="#616161" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
        <YAxis type="category" dataKey="device" stroke="#616161" fontSize={12} tickLine={false} axisLine={false} width={120} />
        <Tooltip
          contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #2b2b2b', borderRadius: 6 }}
          labelStyle={{ color: '#fafafa' }}
          itemStyle={{ color: '#f5f5f5' }}
        />
        <Bar dataKey="count" fill="#f5f5f5" radius={[0, 4, 4, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}