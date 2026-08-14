import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, Sparkles, Shield, Smartphone } from 'lucide-react';

export const Navbar = ({ title, subtitle }) => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="top-header">
      <div className="header-left">
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p style={{ fontSize: '0.825rem', color: '#64748B', marginTop: '2px' }}>{subtitle}</p>}
        </div>
      </div>

      <div className="header-right">
        <button
          onClick={() => navigate('/upi-banking')}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F172A', borderColor: '#CBD5E1' }}
        >
          <Smartphone size={15} color="#FF6B00" />
          <span>UPI Pay</span>
        </button>

        <button
          onClick={() => navigate('/ai-assistant')}
          className="btn btn-outline-orange btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Sparkles size={15} />
          <span>FinTrack AI</span>
        </button>

        <button
          onClick={() => navigate('/add-transaction')}
          className="btn btn-primary btn-sm"
        >
          <Plus size={15} />
          <span>Add Transaction</span>
        </button>

        <div className="user-badge" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
          <div className="avatar">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
          <span>{user?.name?.split(' ')[0] || 'User'}</span>
          {isAdmin && <Shield size={14} style={{ color: '#7C3AED' }} />}
        </div>
      </div>
    </header>
  );
};
