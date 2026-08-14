import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { transactionService } from '../services/transactionService';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Wallet,
  TrendingUp,
  TrendingDown,
  Receipt,
  LogOut,
  Key
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    transactionService.getFinancialSummary()
      .then((data) => setSummary(data))
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <Navbar
        title="User Profile & Settings"
        subtitle="Manage your personal account details and review account security"
      />

      <div className="content-area" style={{ maxWidth: '900px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {/* User Profile Card */}
          <div className="card">
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)',
                  color: 'white',
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: 'var(--shadow-orange)',
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>{user?.name}</h2>
              <span className={`badge ${user?.role === 'ADMIN' ? 'badge-admin' : 'badge-orange'}`} style={{ marginTop: '6px' }}>
                {user?.role} ACCOUNT
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid #F1F5F9', paddingTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Mail size={18} color="#64748B" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Email Address</div>
                  <div style={{ fontWeight: 600, color: '#0F172A' }}>{user?.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Shield size={18} color="#64748B" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Role & Permissions</div>
                  <div style={{ fontWeight: 600, color: '#0F172A' }}>
                    {user?.role === 'ADMIN' ? 'Administrator (Full Access)' : 'Standard User (Personal Workspace)'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Calendar size={18} color="#64748B" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Member Since</div>
                  <div style={{ fontWeight: 600, color: '#0F172A' }}>
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Active'}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '28px', borderTop: '1px solid #F1F5F9', paddingTop: '20px' }}>
              <button
                onClick={handleLogout}
                className="btn btn-danger"
                style={{ width: '100%' }}
              >
                <LogOut size={16} />
                <span>Log Out from All Devices</span>
              </button>
            </div>
          </div>

          {/* Account Financial Highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Wallet size={18} color="#FF6B00" />
                  <span>Financial Snapshot</span>
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                    Net Balance
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
                    ${summary ? parseFloat(summary.currentBalance).toFixed(2) : '0.00'}
                  </div>
                </div>

                <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                    Total Transactions
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
                    {summary ? summary.transactionCount : 0}
                  </div>
                </div>

                <div style={{ padding: '14px', background: '#ECFDF5', borderRadius: '10px', border: '1px solid #A7F3D0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, textTransform: 'uppercase' }}>
                    Lifetime Inflow
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>
                    +${summary ? parseFloat(summary.totalIncome).toFixed(2) : '0.00'}
                  </div>
                </div>

                <div style={{ padding: '14px', background: '#FEF2F2', borderRadius: '10px', border: '1px solid #FECACA' }}>
                  <div style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 600, textTransform: 'uppercase' }}>
                    Lifetime Outflow
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#EF4444', marginTop: '4px' }}>
                    -${summary ? parseFloat(summary.totalExpenses).toFixed(2) : '0.00'}
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="card" style={{ background: '#FFF7ED', border: '1px solid #FFEDD5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FF6B00', marginBottom: '8px' }}>
                <Key size={18} />
                <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Authentication & JWT Security</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                Your session is authenticated via <strong>HMAC-SHA256 JWT</strong> tokens with encrypted <strong>BCrypt</strong> password hashing.
                All database transactions are strictly isolated to your user ID.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
