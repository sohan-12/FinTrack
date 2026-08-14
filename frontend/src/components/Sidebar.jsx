import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  ReceiptText,
  PlusCircle,
  Sparkles,
  User,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Flame,
  Smartphone,
  HelpCircle,
  X
} from 'lucide-react';

export const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, isAdmin, logout, isMobileMenuOpen, setIsMobileMenuOpen } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Standard User Navigation Items
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'UPI & Banking', path: '/upi-banking', icon: Smartphone, badge: 'HOT' },
    { name: 'Transactions', path: '/transactions', icon: ReceiptText },
    { name: 'Add Transaction', path: '/add-transaction', icon: PlusCircle },
    { name: 'AI Assistant', path: '/ai-assistant', icon: Sparkles, badge: 'AI' },
    { name: 'Help & Support', path: '/help-support', icon: HelpCircle },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Admin Console', path: '/admin', icon: ShieldCheck, badge: 'ADMIN' });
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          {(!isCollapsed || isMobileMenuOpen) && (
            <div className="brand-logo">
              <div className="brand-icon">
                <Flame size={22} />
              </div>
              <span>FinTrack</span>
            </div>
          )}
          {isCollapsed && !isMobileMenuOpen && (
            <div className="brand-icon" style={{ margin: '0 auto' }}>
              <Flame size={20} />
            </div>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            className="sidebar-toggle-btn desktop-only"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Mobile Close Button */}
          <button
            className="sidebar-toggle-btn mobile-only"
            onClick={() => setIsMobileMenuOpen(false)}
            title="Close Menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                title={isCollapsed && !isMobileMenuOpen ? item.name : undefined}
              >
                <Icon size={20} />
                {(!isCollapsed || isMobileMenuOpen) && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span>{item.name}</span>
                    {item.badge && (
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '9999px',
                          backgroundColor:
                            item.badge === 'ADMIN'
                              ? '#EDE9FE'
                              : item.badge === 'HOT'
                              ? '#FEF2F2'
                              : '#FFEDD5',
                          color:
                            item.badge === 'ADMIN'
                              ? '#7C3AED'
                              : item.badge === 'HOT'
                              ? '#EF4444'
                              : '#FF6B00',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          {(!isCollapsed || isMobileMenuOpen) ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <div className="avatar">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {user?.name || 'User'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {user?.role}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Logout"
                style={{ padding: '6px', color: '#EF4444' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="sidebar-toggle-btn"
              style={{ width: '100%', color: '#EF4444' }}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
