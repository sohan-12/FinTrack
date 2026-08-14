import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'orange', subtitle, trend }) => {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <div className="stat-label">{title}</div>
        <div className="stat-value">{value}</div>
        {subtitle && (
          <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {trend && <span style={{ color: trend > 0 ? '#10B981' : '#EF4444', fontWeight: 700 }}>{trend > 0 ? '+' : ''}{trend}%</span>}
            <span>{subtitle}</span>
          </div>
        )}
      </div>
      <div className={`stat-icon-wrapper stat-icon-${color}`}>
        <Icon size={24} />
      </div>
    </div>
  );
};
