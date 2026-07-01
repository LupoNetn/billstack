'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SubscriptionGrowthChartProps {
  data?: Array<{ date: string; new: number; churned: number }>;
}

export function SubscriptionGrowthChart({ data = [] }: SubscriptionGrowthChartProps) {
  // Generate mock data if none provided
  const chartData = data.length > 0 ? data : generateMockData();

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} barGap={8}>
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
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#111827', 
            border: 'none', 
            borderRadius: '8px',
            padding: '12px'
          }}
          itemStyle={{ color: '#fff' }}
          labelFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
          }}
        />
        <Bar dataKey="new" fill="#059669" radius={[4, 4, 0, 0]} name="New" />
        <Bar dataKey="churned" fill="#DC2626" radius={[4, 4, 0, 0]} name="Churned" />
      </BarChart>
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
      new: Math.floor(Math.random() * 20) + 5,
      churned: Math.floor(Math.random() * 5),
    });
  }
  return data;
}
