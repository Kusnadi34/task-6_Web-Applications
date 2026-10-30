import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ChartWidget({ data }) {
  // FIX: Use a static hex color for SVG gradients. Recharts often fails to render CSS variables inside <defs>.
  const chartColor = "#6366f1";

  return (
    <div className="chart-widget">
      <div className="chart-header">
        <div>
          <h3>Revenue Overview</h3>
          <p className="text-muted text-sm">Performance over the last 6 months</p>
        </div>
        <select className="chart-select">
          <option>Last 6 Months</option>
          <option>This Year</option>
        </select>
      </div>
      <div className="chart-body">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)', fontSize: 12}} axisLine={false} tickLine={false} />
            <YAxis stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)', fontSize: 12}} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)' }}
              itemStyle={{ color: chartColor }}
            />
            <Area type="monotone" dataKey="revenue" stroke={chartColor} strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}