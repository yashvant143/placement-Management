import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'var(--primary)', subtitle }) => {
  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{title}</span>
        <div style={{ background: `${color}20`, padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
          {Icon && <Icon size={20} color={color} />}
        </div>
      </div>
      <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>{value}</h3>
      {subtitle && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subtitle}</p>}
    </div>
  );
};

export default StatCard;
