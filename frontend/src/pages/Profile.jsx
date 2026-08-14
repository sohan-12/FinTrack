import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { transactionService } from '../services/transactionService';
import api from '../services/api';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Wallet,
  LogOut,
  Key,
  Lock,
  Check,
  X,
  Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user, logout, addToast } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);

  // Password Setting State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Password validation rules
  const isMinLength = newPassword.length >= 8;
  const isFirstUpper = newPassword.length > 0 && /^[A-Z]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);
  const isPasswordValid = isMinLength && isFirstUpper && hasSpecialChar;

  useEffect(() => {
    transactionService.getFinancialSummary()
      .then((data) => setSummary(data))
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) {
      addToast('Please ensure your password meets all 3 security requirements.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await api.put('/auth/password', { password: newPassword });
      addToast(res.data.message || 'Password saved successfully!', 'success');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Password update failed:', err);
      addToast(err.response?.data?.message || 'Failed to update password.', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div>
      <Navbar
        title="User Profile & Settings"
        subtitle="Manage personal credentials, review financial summaries, and set account password"
      />

      <div className="content-area" style={{ maxWidth: '960px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          
          {/* LEFT COLUMN: User Profile Card & Set Password Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* User Profile Card */}
            <div className="card">
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
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
                    margin: '0 auto 14px',
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid #F1F5F9', paddingTop: '18px' }}>
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

              <div style={{ marginTop: '24px', borderTop: '1px solid #F1F5F9', paddingTop: '18px' }}>
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

            {/* Set / Update Account Password Card */}
            <div className="card" style={{ border: '1px solid #E2E8F0' }}>
              <div className="card-header" style={{ marginBottom: '14px' }}>
                <h3 className="card-title">
                  <Lock size={18} color="#FF6B00" />
                  <span>Account Password & Direct Login</span>
                </h3>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
                Set an account master password below to enable direct email & password sign-in alongside Google OAuth.
              </p>

              <form onSubmit={handleUpdatePassword}>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input
                      type="password"
                      required
                      className="form-input"
                      style={{ paddingLeft: '36px' }}
                      placeholder="e.g. Password@123"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  {/* Live Password Criteria Checklist */}
                  {newPassword.length > 0 && (
                    <div
                      style={{
                        background: '#F8FAFC',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        marginTop: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        fontSize: '0.775rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isFirstUpper ? '#059669' : '#94A3B8', fontWeight: 600 }}>
                        {isFirstUpper ? <Check size={14} color="#059669" /> : <X size={14} color="#94A3B8" />}
                        <span>Starts with an Uppercase letter (e.g. 'A'-'Z')</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isMinLength ? '#059669' : '#94A3B8', fontWeight: 600 }}>
                        {isMinLength ? <Check size={14} color="#059669" /> : <X size={14} color="#94A3B8" />}
                        <span>Minimum 8 characters long</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasSpecialChar ? '#059669' : '#94A3B8', fontWeight: 600 }}>
                        {hasSpecialChar ? <Check size={14} color="#059669" /> : <X size={14} color="#94A3B8" />}
                        <span>Contains a special character (@, #, $, %, !, &, *)</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label">Confirm New Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input
                      type="password"
                      required
                      className="form-input"
                      style={{ paddingLeft: '36px' }}
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={passwordLoading}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Save size={16} />
                  <span>{passwordLoading ? 'Saving Password...' : 'Save Account Password'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: Financial Snapshot & Security Details */}
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
                All database records in PostgreSQL are strictly isolated to your individual account ID.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
