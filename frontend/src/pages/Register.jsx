import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Flame, Lock, Mail, User, ArrowRight, Check, X, ShieldCheck, RefreshCw, ArrowLeft, KeyRound } from 'lucide-react';

export const Register = () => {
  // Step 1: Details, Step 2: Email OTP Verification
  const [step, setStep] = useState(1);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [sandboxOtp, setSandboxOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, addToast } = useAuth();
  const navigate = useNavigate();

  // Password validation rules
  const isMinLength = password.length >= 8;
  const isFirstUpper = password.length > 0 && /^[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const isPasswordValid = isMinLength && isFirstUpper && hasSpecialChar;

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // STEP 1: Submit details and send Email OTP
  const handleProceedToOtp = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setError('Please ensure your password meets all 3 security requirements.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await authService.sendOtp(email);
      if (res?.sandboxOtp) {
        setSandboxOtp(res.sandboxOtp);
      }
      addToast(`A 6-digit security verification code has been dispatched to ${email}. Please check your inbox.`, 'info');
      setStep(2);
      setCountdown(60);
      setCanResend(false);
    } catch (err) {
      console.error('Failed to send verification OTP:', err);
      setError(err.response?.data?.message || 'Failed to send verification code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    try {
      setLoading(true);
      setError('');
      const res = await authService.sendOtp(email);
      if (res?.sandboxOtp) {
        setSandboxOtp(res.sandboxOtp);
      }
      addToast(`New verification code sent to ${email}. Please check your inbox.`, 'info');
      setCountdown(60);
      setCanResend(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP and complete registration
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length < 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await register(name, email, password, confirmPassword, otp.trim());
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Registration OTP verification failed:', err);
      setError(err.response?.data?.message || 'Invalid or expired verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          padding: '36px 30px',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            className="brand-icon"
            style={{ width: '48px', height: '48px', margin: '0 auto 12px', borderRadius: '12px' }}
          >
            {step === 1 ? <Flame size={28} /> : <ShieldCheck size={28} />}
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
            {step === 1 ? 'Create Your Account' : 'Verify Your Email'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '4px' }}>
            {step === 1
              ? 'Register with your email to start managing your wealth'
              : `Enter the 6-digit security code sent to ${email}`}
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

        {/* STEP 1 FORM: NAME, EMAIL, PASSWORD */}
        {step === 1 && (
          <form onSubmit={handleProceedToOtp}>
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
                  placeholder="e.g. Sohan Kumar Sahu"
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
                  placeholder="e.g. Secure@123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Live Password Strength Criteria Checklist */}
              {password.length > 0 && (
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
              style={{ width: '100%' }}
            >
              {loading ? 'Sending Code...' : 'Continue to Email Verification'}
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* STEP 2 FORM: 6-DIGIT EMAIL OTP VERIFICATION */}
        {step === 2 && (
          <form onSubmit={handleVerifyAndRegister}>
            <div style={{ background: '#FFF7ED', border: '1px solid #FFEDD5', borderRadius: '12px', padding: '16px', marginBottom: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#9A3412', fontWeight: 600 }}>
                Verification Code Sent To:
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                {email}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ textAlign: 'center', display: 'block', fontWeight: 700 }}>
                Enter 6-Digit Verification Code
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound
                  size={18}
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
                />
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  className="form-input"
                  style={{
                    paddingLeft: '42px',
                    textAlign: 'center',
                    letterSpacing: '8px',
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    fontFamily: 'monospace',
                  }}
                  placeholder="••••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              {sandboxOtp ? (
                <div style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.82rem',
                  color: '#1E40AF'
                }}>
                  <div>
                    <span>Sandbox Code: </span>
                    <strong style={{ letterSpacing: '2px', color: '#1D4ED8', background: '#DBEAFE', padding: '2px 6px', borderRadius: '4px' }}>{sandboxOtp}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtp(sandboxOtp)}
                    style={{
                      background: '#2563EB',
                      color: '#ffffff',
                      border: 'none',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Auto-Fill
                  </button>
                </div>
              ) : (
                <p style={{ fontSize: '0.75rem', color: '#94A3B8', textAlign: 'center', marginTop: '8px', lineHeight: 1.4 }}>
                  Check your inbox or spam folder. For cloud demo testing, enter <strong>582914</strong> to verify instantly.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || otp.length < 6}
              style={{ width: '100%', marginBottom: '14px' }}
            >
              {loading ? 'Verifying Code...' : 'Verify & Complete Registration'}
              <Check size={18} />
            </button>

            {/* Resend & Back options */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
              <button
                type="button"
                onClick={() => { setStep(1); setError(''); }}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
              >
                <ArrowLeft size={14} />
                <span>Edit Email</span>
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend || loading}
                className="btn btn-secondary btn-sm"
                style={{
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: canResend ? '#FF6B00' : '#94A3B8',
                  borderColor: canResend ? '#FDBA74' : '#E2E8F0',
                }}
              >
                <RefreshCw size={13} className={loading ? 'spin' : ''} />
                <span>{canResend ? 'Resend Code' : `Resend in (${countdown}s)`}</span>
              </button>
            </div>
          </form>
        )}

        {/* Login Link */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: '#64748B' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 700, color: '#FF6B00' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
