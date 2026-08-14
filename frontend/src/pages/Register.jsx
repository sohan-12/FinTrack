import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, Lock, Mail, User, ArrowRight, X, PlusCircle, UserCheck } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Google OAuth State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isCustomGoogleMode, setIsCustomGoogleMode] = useState(false);
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await register(name, email, password, confirmPassword);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async (googleAccount) => {
    try {
      setLoading(true);
      setError('');
      setIsGoogleModalOpen(false);
      setIsCustomGoogleMode(false);
      await googleLogin(googleAccount);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Google sign-up failed:', err);
      setError(err.response?.data?.message || 'Google registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGoogleSubmit = (e) => {
    e.preventDefault();
    if (!customGoogleEmail || !customGoogleEmail.includes('@')) {
      setError('Please enter a valid Google email address.');
      return;
    }

    const userName = customGoogleName.trim() || customGoogleEmail.split('@')[0];
    handleGoogleSignUp({
      name: userName,
      email: customGoogleEmail.trim().toLowerCase(),
      googleId: 'goog_' + Date.now(),
      avatarUrl: '',
    });
  };

  const registeredGoogleAccounts = [
    { name: 'Sohan Kumar Sahu', email: 'sohankumarsahu402@gmail.com', googleId: 'goog_sohan_402', avatar: 'S' },
    { name: 'John Doe', email: 'john@example.com', googleId: 'goog_1092837482', avatar: 'J' },
    { name: 'Jane Smith', email: 'jane@example.com', googleId: 'goog_5829104928', avatar: 'J' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
        padding: '24px',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '460px',
          boxShadow: 'var(--shadow-xl)',
          borderRadius: 'var(--radius-xl)',
          padding: '38px 32px',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            className="brand-icon"
            style={{ width: '48px', height: '48px', margin: '0 auto 12px', borderRadius: '12px' }}
          >
            <Flame size={28} />
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
            Create Your Account
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '4px' }}>
            Get started with FinTrack AI in seconds
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: 'var(--radius-md)',
              color: '#EF4444',
              fontSize: '0.875rem',
              marginBottom: '20px',
              fontWeight: 500,
            }}
          >
            {error}
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={() => {
            setIsCustomGoogleMode(false);
            setIsGoogleModalOpen(true);
          }}
          className="btn btn-secondary"
          disabled={loading}
          style={{
            width: '100%',
            padding: '11px',
            fontSize: '0.925rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            borderColor: '#CBD5E1',
            background: '#FFFFFF',
            marginBottom: '18px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Sign up with Google</span>
        </button>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            margin: '18px 0',
            color: '#94A3B8',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}
        >
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }}></div>
          <span style={{ padding: '0 12px', textTransform: 'uppercase' }}>or register with email</span>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }}></div>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User
                size={18}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
              />
              <input
                type="text"
                required
                className="form-input"
                style={{ paddingLeft: '38px' }}
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
              />
              <input
                type="email"
                required
                className="form-input"
                style={{ paddingLeft: '38px' }}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
              />
              <input
                type="password"
                required
                className="form-input"
                style={{ paddingLeft: '38px' }}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
              />
              <input
                type="password"
                required
                className="form-input"
                style={{ paddingLeft: '38px' }}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
          >
            {loading ? 'Creating Account...' : 'Create FinTrack Account'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Login Link */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: '#64748B' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 700, color: '#FF6B00' }}>
            Sign in
          </Link>
        </div>
      </div>

      {/* Google OAuth Modal */}
      {isGoogleModalOpen && (
        <div className="modal-overlay" onClick={() => setIsGoogleModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', padding: '28px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0F172A' }}>Sign up with Google</h3>
              </div>
              <button onClick={() => setIsGoogleModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            {!isCustomGoogleMode ? (
              <>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '16px' }}>
                  Choose an account to register on <strong>FinTrack</strong>:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                  {registeredGoogleAccounts.map((acc, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleGoogleSignUp(acc)}
                      className="btn btn-secondary"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        textAlign: 'left',
                        borderRadius: '12px',
                        border: acc.email.includes('sohan') ? '1.5px solid #FF6B00' : '1px solid #E2E8F0',
                        background: acc.email.includes('sohan') ? '#FFF7ED' : '#FFFFFF',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: acc.email.includes('sohan') ? '#FF6B00' : '#10B981',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.9rem',
                          }}
                        >
                          {acc.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{acc.name}</span>
                            {acc.email.includes('sohan') && (
                              <span style={{ fontSize: '0.65rem', background: '#FFEDD5', color: '#C2410C', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                                YOUR ACCOUNT
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.775rem', color: '#64748B' }}>{acc.email}</div>
                        </div>
                      </div>
                      <ArrowRight size={16} color="#FF6B00" />
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setIsCustomGoogleMode(true)}
                  className="btn btn-outline-orange"
                  style={{
                    width: '100%',
                    padding: '11px',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <PlusCircle size={16} />
                  <span>Use another Google account</span>
                </button>
              </>
            ) : (
              <form onSubmit={handleCustomGoogleSubmit}>
                <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '14px', lineHeight: 1.5 }}>
                  Enter your Google Account email. FinTrack will create and verify your account.
                </p>

                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Sohan Kumar"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label">Google Email Address</label>
                  <input
                    type="email"
                    required
                    autoFocus
                    className="form-input"
                    placeholder="you@gmail.com"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsCustomGoogleMode(false)}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <UserCheck size={16} />
                    <span>Authorize with Google</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
