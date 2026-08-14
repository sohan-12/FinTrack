import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, Sparkles, Shield, Smartphone, Menu } from 'lucide-react';

export const Navbar = ({ title, subtitle }) => {
  const { user, isAdmin, setIsMobileMenuOpen } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="top-header">
      <div className="header-left">
        {/* Mobile Hamburger Menu Toggle Button */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(true)}
          title="Open Menu"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="header-right">
        <button
          onClick={() => navigate('/upi-banking')}
          className="btn btn-secondary btn-sm nav-action-btn"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F172A', borderColor: '#CBD5E1' }}
        >
          <Smartphone size={15} color="#FF6B00" />
          <span className="btn-label-desktop">UPI Pay</span>
        </button>

        <button
          onClick={() => navigate('/ai-assistant')}
          className="btn btn-outline-orange btn-sm nav-action-btn"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Sparkles size={15} />
          <span className="btn-label-desktop">FinTrack AI</span>
        </button>

        <button
          onClick={() => navigate('/add-transaction')}
          className="btn btn-primary btn-sm nav-action-btn"
        >
          <Plus size={15} />
          <span className="btn-label-desktop">Add Transaction</span>
        </button>

        <div className="user-badge" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
          <div className="avatar">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
          <span className="user-name-desktop">{user?.name?.split(' ')[0] || 'User'}</span>
          {isAdmin && <Shield size={14} style={{ color: '#7C3AED' }} />}
        </div>
      </div>
    </header>
  );
};
