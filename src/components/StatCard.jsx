import React from 'react';

export default function StatCard({ title, value, change, isPositive, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon-wrapper">
        {icon}
      </div>
      <div className="stat-info">
        <h3>{title}</h3>
        <h2>{value}</h2>
        <div className="stat-trend">
          <span className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '↑' : '↓'} {change}
          </span>
          <span className="text-muted text-sm">vs last month</span>
        </div>
      </div>
    </div>
  );
}