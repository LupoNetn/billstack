'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface RevenueChartProps {
  data?: Array<{ date: string; revenue: number }>;
}

export function RevenueChart({ data = [] }: RevenueChartProps) {
  // Generate mock data if none provided
  const chartData = data.length > 0 ? data : generateMockData();

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#5B21B6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#5B21B6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis 
          dataKey="date" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
          tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#111827', 
            border: 'none', 
            borderRadius: '8px',
            padding: '12px'
          }}
          itemStyle={{ color: '#fff' }}
          formatter={(value: any) => [`₦${Number(value).toLocaleString()}`, 'Revenue']}
          labelFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
          }}
        />
        <Area 
          type="monotone" 
          dataKey="revenue" 
          stroke="#5B21B6" 
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorRevenue)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function generateMockData() {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 500000) + 100000,
    });
  }
  return data;
}
