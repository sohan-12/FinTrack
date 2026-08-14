import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { upiService } from '../services/upiService';
import { transactionService } from '../services/transactionService';
import { useAuth } from '../context/AuthContext';
import {
  Smartphone,
  CreditCard,
  Send,
  RefreshCw,
  QrCode,
  CheckCircle2,
  Building,
  Zap,
  ArrowRight,
  ShieldCheck,
  Receipt,
  X,
  Plus,
  Unlink,
  Lock,
  MessageSquare,
  Trash2,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const UpiBanking = () => {
  const { user, addToast } = useAuth();

  // Form State
  const [recipientUpiId, setRecipientUpiId] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Dining Out');
  const [note, setNote] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);

  // Multi-App State
  const [upiApps, setUpiApps] = useState([]);
  const [summary, setSummary] = useState(null);
  const [recentUpiTx, setRecentUpiTx] = useState([]);

  // Modals
  const [successReceipt, setSuccessReceipt] = useState(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Connect App Auth Modal State
  const [connectModalApp, setConnectModalApp] = useState(null);
  const [authStep, setAuthStep] = useState(1); // 1: Details, 2: OTP, 3: Success
  const [connectPhone, setConnectPhone] = useState('+91 98765 43210');
  const [connectUpiId, setConnectUpiId] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // User Cards State (Persisted per user)
  const userCardsKey = 'fintrack_user_cards_' + (user?.id || 'guest');
  const [cards, setCards] = useState(() => {
    try {
      const saved = localStorage.getItem(userCardsKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse cards:', e);
    }
    // Default starter card for new user with their actual name
    return [
      {
        id: 'card-1',
        bankName: 'HDFC Bank',
        cardHolder: user?.name || 'Sohan Kumar Sahu',
        last4: '4892',
        cardType: 'Debit Card',
        network: 'Visa',
        expiry: '09/28',
        balance: 12450.00,
        gradient: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
        isPrimary: true,
      },
    ];
  });

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);

  // Add Card Form State
  const [newCardHolder, setNewCardHolder] = useState(user?.name || '');
  const [newBankName, setNewBankName] = useState('State Bank of India');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardType, setNewCardType] = useState('Debit Card');
  const [newNetwork, setNewNetwork] = useState('Visa');
  const [newExpiry, setNewExpiry] = useState('08/29');
  const [newCardBalance, setNewCardBalance] = useState('5000.00');
  const [newGradient, setNewGradient] = useState('linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)');

  // Save cards to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem(userCardsKey, JSON.stringify(cards));
  }, [cards, userCardsKey]);

  const quickContacts = [
    { name: 'Swiggy Food', upi: 'swiggy@icici', category: 'Dining Out', defaultAmount: '18.50' },
    { name: 'Zomato Dining', upi: 'zomato@hdfcbank', category: 'Dining Out', defaultAmount: '24.00' },
    { name: 'Uber Rides', upi: 'uber@axisbank', category: 'Travel', defaultAmount: '12.00' },
    { name: 'Amazon Shopping', upi: 'amazonpay@apl', category: 'Shopping', defaultAmount: '45.00' },
    { name: 'Apartment Landlord', upi: 'landlord@okhdfcbank', category: 'Rent & Housing', defaultAmount: '1200.00' },
    { name: 'Blinkit Groceries', upi: 'blinkit@icici', category: 'Groceries', defaultAmount: '22.00' },
  ];

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  const loadBankingData = async () => {
    try {
      const [appsRes, sumRes, txRes] = await Promise.all([
        upiService.getUpiApps(),
        transactionService.getFinancialSummary(),
        transactionService.getTransactions({ search: 'UPI', page: 0, size: 8 }),
      ]);
      setUpiApps(appsRes || []);
      setSummary(sumRes);
      setRecentUpiTx(txRes.content || []);
    } catch (err) {
      console.error('Error fetching UPI data:', err);
    }
  };

  useEffect(() => {
    loadBankingData();
  }, []);

  const handleSelectContact = (contact) => {
    setRecipientName(contact.name);
    setRecipientUpiId(contact.upi);
    setCategory(contact.category);
    if (!amount) setAmount(contact.defaultAmount);
    setNote(`Payment for ${contact.name}`);
  };

  const handleScanQr = (sampleMerchant) => {
    handleSelectContact(sampleMerchant);
    setIsQrModalOpen(false);
    addToast(`Scanned QR for ${sampleMerchant.name}!`, 'success');
  };

  const handlePayUpi = async (e) => {
    e.preventDefault();
    if (!recipientUpiId.includes('@')) {
      addToast('Please enter a valid UPI ID (e.g. name@okhdfcbank)', 'error');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      addToast('Please enter an amount greater than $0', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await upiService.payUpi({
        recipientUpiId,
        recipientName: recipientName || recipientUpiId.split('@')[0],
        amount: parseFloat(amount),
        category,
        note,
        pin: pin || '1234',
      });

      setSuccessReceipt(res);
      addToast(`UPI Payment of $${parseFloat(amount).toFixed(2)} sent successfully!`, 'success');
      setRecipientUpiId('');
      setRecipientName('');
      setAmount('');
      setNote('');
      setPin('');
      loadBankingData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Payment failed. Please check your details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSync = async () => {
    const connectedCount = upiApps.filter((a) => a.connected).length;
    if (connectedCount === 0) {
      addToast('No UPI apps connected yet! Please connect at least one app (Google Pay, PhonePe, Paytm, etc.) below using SMS OTP.', 'error');
      return;
    }

    try {
      setSyncLoading(true);
      const res = await upiService.syncUpi();
      addToast(res.message || 'Bank statements synchronized!', 'success');
      loadBankingData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to sync bank feeds.', 'error');
    } finally {
      setSyncLoading(false);
    }
  };

  // Open Connect Modal for a specific app
  const handleOpenConnectModal = (app) => {
    setConnectModalApp(app);
    setAuthStep(1);
    setConnectUpiId(`${user?.email ? user.email.split('@')[0] : 'user'}.${app.id}@${app.bankName.toLowerCase().replace(/\s+/g, '')}`);
    setConnectPhone('+91 98765 43210');
    setOtpCode('');
  };

  const handleRequestOtp = (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setAuthStep(2);
      addToast(`SMS OTP sent to ${connectPhone}! (Demo code: 4892)`, 'info');
    }, 800);
  };

  const handleVerifyOtpAndConnect = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 4) {
      addToast('Please enter the 4-digit SMS OTP (e.g. 4892)', 'error');
      return;
    }

    try {
      setAuthLoading(true);
      await upiService.connectApp({
        appId: connectModalApp.id,
        upiId: connectUpiId,
        phone: connectPhone,
        otp: otpCode,
      });

      setAuthStep(3);
      addToast(`🎉 ${connectModalApp.name} successfully connected!`, 'success');
      loadBankingData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to authenticate app.', 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDisconnect = async (appId, appName) => {
    try {
      await upiService.disconnectApp(appId);
      addToast(`${appName} disconnected.`, 'info');
      loadBankingData();
    } catch (err) {
      addToast('Failed to disconnect app.', 'error');
    }
  };

  // Add New Card Handler
  const handleAddCardSubmit = (e) => {
    e.preventDefault();
    const cleanNum = newCardNumber.replace(/\s+/g, '');
    const last4Digits = cleanNum.length >= 4 ? cleanNum.slice(-4) : '7721';

    const newCard = {
      id: 'card-' + Date.now(),
      bankName: newBankName || 'State Bank of India',
      cardHolder: newCardHolder || user?.name || 'Account Holder',
      last4: last4Digits,
      cardType: newCardType,
      network: newNetwork,
      expiry: newExpiry || '08/29',
      balance: parseFloat(newCardBalance) || 5000.00,
      gradient: newGradient,
      isPrimary: cards.length === 0,
    };

    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    setActiveCardIndex(updatedCards.length - 1);
    setIsAddCardModalOpen(false);
    addToast(`New ${newCard.bankName} ${newCard.cardType} added successfully!`, 'success');

    // Reset Form
    setNewCardNumber('');
    setNewCardBalance('5000.00');
  };

  const handleDeleteCard = (cardId, e) => {
    e.stopPropagation();
    if (cards.length <= 1) {
      addToast('You must keep at least one primary card linked.', 'error');
      return;
    }
    const updated = cards.filter((c) => c.id !== cardId);
    setCards(updated);
    setActiveCardIndex(0);
    addToast('Card removed from wallet.', 'info');
  };

  const connectedApps = upiApps.filter((a) => a.connected);
  const availableApps = upiApps.filter((a) => !a.connected);
  const activeCard = cards[activeCardIndex] || cards[0];

  return (
    <div>
      <Navbar
        title="UPI & Multi-App Banking Hub"
        subtitle="Manage custom debit & credit cards, link UPI apps (GPay, PhonePe, Paytm, CRED), and execute instant transfers"
      />

      <div className="content-area">
        {/* Top Summary: User Bank Card Wallet & Global Aggregator */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          
          {/* USER CUSTOM DEBIT / CREDIT CARD */}
          <div
            className="card"
            style={{
              background: activeCard ? activeCard.gradient : 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              minHeight: '220px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.08, color: '#FFFFFF' }}>
              <CreditCard size={180} />
            </div>

            {/* Card Header: Bank & Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Building size={20} color="#FDBA74" />
                <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.5px' }}>
                  {activeCard?.bankName || 'HDFC BANK'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.18)', color: '#F8FAFC', border: '1px solid rgba(255, 255, 255, 0.25)' }}>
                  {activeCard?.cardType || 'DEBIT CARD'}
                </span>

                <button
                  type="button"
                  onClick={() => setIsAddCardModalOpen(true)}
                  style={{
                    background: 'rgba(255, 107, 0, 0.85)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'white',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                  }}
                  title="Add New Debit / Credit Card"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Card Number & Chip */}
            <div style={{ margin: '14px 0', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '38px', height: '26px', background: 'linear-gradient(135deg, #FDE68A 0%, #D97706 100%)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.4)' }}></div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '1px' }}>CONTACTLESS CHIP</div>
              </div>
              <div style={{ fontSize: '1.25rem', letterSpacing: '4px', fontWeight: 700, fontFamily: 'monospace' }}>
                •••• •••• •••• {activeCard?.last4 || '4892'}
              </div>
            </div>

            {/* Card Footer: Holder, Expiry & Network */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '10px', zIndex: 1 }}>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.65)', textTransform: 'uppercase' }}>CARDHOLDER</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.5px' }}>
                  {activeCard?.cardHolder || user?.name || 'Sohan Kumar Sahu'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.65)', textTransform: 'uppercase' }}>EXPIRES</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{activeCard?.expiry || '09/28'}</div>
              </div>

              <div style={{ fontWeight: 900, fontSize: '1.1rem', fontStyle: 'italic', color: '#F8FAFC' }}>
                {activeCard?.network || 'VISA'}
              </div>
            </div>

            {/* Card Carousel Selector */}
            {cards.length > 1 && (
              <div style={{ display: 'flex', gap: '6px', marginTop: '12px', justifyContent: 'center' }}>
                {cards.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCardIndex(i)}
                    style={{
                      width: activeCardIndex === i ? '20px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: activeCardIndex === i ? '#FF6B00' : 'rgba(255,255,255,0.4)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Connected Apps Aggregator Overview */}
          <div className="card" style={{ background: '#FFFDFB', border: '1px solid #FDBA74', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={20} color="#FF6B00" />
                  <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>UPI Account Aggregator</h3>
                </div>
                <span className={connectedApps.length > 0 ? 'badge badge-income' : 'badge'} style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                  {connectedApps.length} APPS CONNECTED
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '14px' }}>
                Connect your payment apps (<strong>Google Pay, PhonePe, Paytm, CRED, Amazon Pay</strong>) with verified SMS OTP to stream your transaction ledgers in real time.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                {connectedApps.length === 0 ? (
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertCircle size={14} color="#F59E0B" />
                    <span>No UPI apps linked yet. Click "+ Connect App" below to link one.</span>
                  </div>
                ) : (
                  connectedApps.map((app) => (
                    <span
                      key={app.id}
                      className="badge"
                      style={{
                        backgroundColor: '#FEF3C7',
                        color: '#92400E',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }}></span>
                      {app.name}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setIsAddCardModalOpen(true)}
                className="btn btn-secondary"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem' }}
              >
                <Plus size={15} color="#FF6B00" />
                <span>Add Bank Card</span>
              </button>

              <button
                onClick={handleAutoSync}
                className="btn btn-primary"
                disabled={syncLoading}
                style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem' }}
              >
                <RefreshCw size={15} className={syncLoading ? 'spin' : ''} />
                <span>{syncLoading ? 'Syncing...' : 'Sync Connected Apps'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 1: CONNECTED APPS vs AVAILABLE APPS MATRIX */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <h3 className="card-title">
              <Smartphone size={18} color="#FF6B00" />
              <span>Connected UPI Apps & Payment Gateways</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
              {connectedApps.length} Active / {upiApps.length} Supported
            </span>
          </div>

          {/* Connected Apps List */}
          {connectedApps.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} />
                <span>Currently Connected & Auto-Syncing ({connectedApps.length})</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {connectedApps.map((app) => (
                  <div
                    key={app.id}
                    style={{
                      padding: '16px',
                      background: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '8px',
                              background: `${app.themeColor}15`,
                              color: app.themeColor,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '0.85rem',
                            }}
                          >
                            {app.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>{app.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{app.bankName}</div>
                          </div>
                        </div>

                        <span className="badge badge-income" style={{ fontSize: '0.65rem' }}>
                          CONNECTED
                        </span>
                      </div>

                      <div style={{ background: '#F8FAFC', padding: '8px 10px', borderRadius: '6px', fontSize: '0.775rem', color: '#475569', marginBottom: '12px' }}>
                        <div>VPA: <strong>{app.upiId || 'Linked via Phone'}</strong></div>
                        <div>Last Synced: <strong>{app.lastSynced}</strong></div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                      <button
                        onClick={handleAutoSync}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                      >
                        <RefreshCw size={12} />
                        <span>Sync</span>
                      </button>

                      <button
                        onClick={() => handleDisconnect(app.id, app.name)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '3px 8px', color: '#EF4444', borderColor: '#FECACA' }}
                      >
                        <Unlink size={12} />
                        <span>Disconnect</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Apps (Not Connected) List */}
          {availableApps.length > 0 && (
            <div style={{ borderTop: connectedApps.length > 0 ? '1px dashed #CBD5E1' : 'none', paddingTop: connectedApps.length > 0 ? '18px' : 0 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} />
                <span>Available to Connect with OTP Verification ({availableApps.length})</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {availableApps.map((app) => (
                  <div
                    key={app.id}
                    style={{
                      padding: '16px',
                      background: '#F8FAFC',
                      borderRadius: '12px',
                      border: '1px dashed #CBD5E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: '#E2E8F0',
                          color: '#475569',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                        }}
                      >
                        {app.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>{app.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{app.bankName}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenConnectModal(app)}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Plus size={13} />
                      <span>Connect App</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: INSTANT PAYMENT & RECENT LEDGER */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          {/* Quick Pay Form */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Send size={18} color="#FF6B00" />
                <span>Instant UPI Transfer</span>
              </h3>

              <button
                type="button"
                onClick={() => setIsQrModalOpen(true)}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <QrCode size={16} color="#FF6B00" />
                <span>Scan QR</span>
              </button>
            </div>

            {/* Quick Contact Chips */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
                Frequent Merchants & Contacts
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {quickContacts.map((c, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectContact(c)}
                    className="chip-btn"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handlePayUpi}>
              <div className="form-group">
                <label className="form-label">Recipient UPI ID / VPA</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. swiggy@icici, alex@okhdfcbank"
                  value={recipientUpiId}
                  onChange={(e) => setRecipientUpiId(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="form-input"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Dining Out">Dining Out</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Travel">Travel</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Rent & Housing">Rent & Housing</option>
                    <option value="Utilities & Bills">Utilities & Bills</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Quick Amount Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                {quickAmounts.map((qa) => (
                  <button
                    key={qa}
                    type="button"
                    onClick={() => setAmount(qa.toString())}
                    className="chip-btn"
                    style={{ fontSize: '0.75rem', padding: '2px 8px' }}
                  >
                    ${qa}
                  </button>
                ))}
              </div>

              <div className="form-group">
                <label className="form-label">Payment Note (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Lunch with colleagues / Dinner split"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">4-Digit UPI PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  className="form-input"
                  placeholder="••••"
                  style={{ letterSpacing: '8px', fontSize: '1.2rem', textAlign: 'center', width: '140px' }}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
                  (Demo PIN: Any 4 digits, e.g. 1234)
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
              >
                {loading ? 'Processing UPI Transfer...' : `Pay $${amount ? parseFloat(amount).toFixed(2) : '0.00'} Securely`}
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

          {/* Recent UPI Ledger */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Smartphone size={18} color="#FF6B00" />
                <span>UPI Transactions Ledger</span>
              </h3>
              <span className="badge badge-orange">Auto-Reflected</span>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Merchant / VPA</th>
                    <th>Category</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUpiTx.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: '#94A3B8' }}>
                        No UPI payments made yet. Connect your UPI apps above and click <strong>Sync Connected Apps</strong>!
                      </td>
                    </tr>
                  ) : (
                    recentUpiTx.map((tx) => (
                      <tr key={tx.id}>
                        <td style={{ fontSize: '0.825rem', color: '#64748B' }}>{tx.transactionDate}</td>
                        <td style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.875rem' }}>
                          {tx.description}
                        </td>
                        <td>
                          <span className="badge badge-category" style={{ fontSize: '0.75rem' }}>
                            {tx.category}
                          </span>
                        </td>
                        <td className={tx.type === 'INCOME' ? 'amount-income' : 'amount-expense'}>
                          {tx.type === 'INCOME' ? '+' : '-'}${parseFloat(tx.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ADD NEW BANK CARD MODAL */}
      {isAddCardModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddCardModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FFEDD5', color: '#FF6B00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={18} />
                </div>
                <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0F172A' }}>Link Bank / Debit Card</h3>
              </div>
              <button onClick={() => setIsAddCardModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCardSubmit}>
              <div className="form-group">
                <label className="form-label">Bank Name</label>
                <select
                  className="form-select"
                  value={newBankName}
                  onChange={(e) => setNewBankName(e.target.value)}
                >
                  <option value="State Bank of India">State Bank of India (SBI)</option>
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  <option value="Chase Bank">Chase Bank</option>
                  <option value="Bank of America">Bank of America</option>
                  <option value="Citibank">Citibank</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Cardholder Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Sohan Kumar Sahu"
                  value={newCardHolder}
                  onChange={(e) => setNewCardHolder(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Card Number (16 Digits)</label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    className="form-input"
                    placeholder="4532 8921 7731 8842"
                    value={newCardNumber}
                    onChange={(e) => setNewCardNumber(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    className="form-input"
                    placeholder="08/29"
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Card Type</label>
                  <select
                    className="form-select"
                    value={newCardType}
                    onChange={(e) => setNewCardType(e.target.value)}
                  >
                    <option value="Debit Card">Debit Card</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Salary Card">Salary Account Card</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Card Network</label>
                  <select
                    className="form-select"
                    value={newNetwork}
                    onChange={(e) => setNewNetwork(e.target.value)}
                  >
                    <option value="Visa">Visa</option>
                    <option value="MasterCard">MasterCard</option>
                    <option value="RuPay">RuPay</option>
                    <option value="Amex">American Express</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Card Color Theme</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[
                    { name: 'Midnight Navy', grad: 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)' },
                    { name: 'Emerald Forest', grad: 'linear-gradient(135deg, #065F46 0%, #022C22 100%)' },
                    { name: 'Sunset Bronze', grad: 'linear-gradient(135deg, #9A3412 0%, #431407 100%)' },
                    { name: 'Royal Violet', grad: 'linear-gradient(135deg, #581C87 0%, #1E1B4B 100%)' },
                    { name: 'Carbon Slate', grad: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' },
                  ].map((theme, i) => (
                    <div
                      key={i}
                      onClick={() => setNewGradient(theme.grad)}
                      style={{
                        flex: 1,
                        height: '32px',
                        borderRadius: '8px',
                        background: theme.grad,
                        cursor: 'pointer',
                        border: newGradient === theme.grad ? '2px solid #FF6B00' : '1px solid rgba(0,0,0,0.1)',
                        boxShadow: newGradient === theme.grad ? '0 0 0 2px #FFEDD5' : 'none',
                      }}
                      title={theme.name}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddCardModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <CheckCircle2 size={16} />
                  <span>Save & Link Card</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONNECT APP WITH OTP AUTHENTICATION MODAL */}
      {connectModalApp && (
        <div className="modal-overlay" onClick={() => setConnectModalApp(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FFEDD5', color: '#FF6B00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                  {connectModalApp.name.charAt(0)}
                </div>
                <h3 style={{ fontWeight: 800, fontSize: '1.15rem', color: '#0F172A' }}>
                  Connect {connectModalApp.name}
                </h3>
              </div>

              <button onClick={() => setConnectModalApp(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            {/* STEP 1: Phone & UPI ID */}
            {authStep === 1 && (
              <form onSubmit={handleRequestOtp}>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
                  Link your <strong>{connectModalApp.name}</strong> account to automatically stream and categorize your daily expenses in real time.
                </p>

                <div className="form-group">
                  <label className="form-label">Registered Mobile Number</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={connectPhone}
                    onChange={(e) => setConnectPhone(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label">UPI ID / Handle</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={connectUpiId}
                    onChange={(e) => setConnectUpiId(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={authLoading}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Lock size={15} />
                  <span>{authLoading ? 'Sending SMS OTP...' : 'Send SMS Verification OTP'}</span>
                </button>
              </form>
            )}

            {/* STEP 2: Enter OTP */}
            {authStep === 2 && (
              <form onSubmit={handleVerifyOtpAndConnect}>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                    <MessageSquare size={24} />
                  </div>
                  <h4 style={{ fontWeight: 800, color: '#0F172A' }}>Enter 4-Digit SMS Code</h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    We sent a verification code to <strong>{connectPhone}</strong>
                  </p>
                </div>

                <div className="form-group" style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    className="form-input"
                    placeholder="••••"
                    style={{ letterSpacing: '12px', fontSize: '1.4rem', textAlign: 'center', width: '160px', margin: '0 auto' }}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                  />
                </div>

                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <button
                    type="button"
                    onClick={() => setOtpCode('4892')}
                    className="chip-btn"
                    style={{ fontSize: '0.75rem', color: '#FF6B00', background: '#FFF7ED', border: '1px solid #FFEDD5' }}
                  >
                    ⚡ Auto-fill Demo Code (4892)
                  </button>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={authLoading}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <ShieldCheck size={16} />
                  <span>{authLoading ? 'Verifying & Linking...' : 'Verify OTP & Authorize App'}</span>
                </button>
              </form>
            )}

            {/* STEP 3: Success Confirmation */}
            {authStep === 3 && (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h4 style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0F172A', marginBottom: '6px' }}>
                  {connectModalApp.name} Connected!
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px' }}>
                  Your statements from {connectModalApp.name} will now automatically appear in your FinTrack dashboard.
                </p>
                <button
                  onClick={() => setConnectModalApp(null)}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* QR Code Scanner Simulation Modal */}
      {isQrModalOpen && (
        <div className="modal-overlay" onClick={() => setIsQrModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0F172A' }}>Scan UPI QR Code</h3>
              <button onClick={() => setIsQrModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '24px', background: '#F8FAFC', borderRadius: '12px', border: '2px dashed #CBD5E1', marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <QrCode size={120} color="#0F172A" />
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
                Point camera at any BharatPe, PayTM, or PhonePe merchant QR
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '10px', textAlign: 'left' }}>
              Or Select Merchant to Simulate Scan:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { name: 'Starbucks Coffee', upi: 'starbucks@icici', category: 'Dining Out', defaultAmount: '8.50' },
                { name: 'Whole Foods Market', upi: 'wholefoods@hdfcbank', category: 'Groceries', defaultAmount: '42.80' },
                { name: 'Shell Fuel Station', upi: 'shell@axisbank', category: 'Travel', defaultAmount: '50.00' },
              ].map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => handleScanQr(m)}
                  className="btn btn-secondary"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px' }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>{m.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{m.upi}</div>
                  </div>
                  <span className="badge badge-orange">${m.defaultAmount}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT SUCCESS RECEIPT MODAL */}
      {successReceipt && (
        <div className="modal-overlay" onClick={() => setSuccessReceipt(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', textAlign: 'center', padding: '32px 24px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={40} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
              Payment Successful!
            </h3>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
              ${parseFloat(successReceipt.amount).toFixed(2)}
            </div>

            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'left', fontSize: '0.85rem', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748B' }}>Paid To:</span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{successReceipt.recipientName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748B' }}>UPI ID:</span>
                <span style={{ fontWeight: 600, color: '#0F172A' }}>{successReceipt.recipientUpiId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748B' }}>UPI Ref No:</span>
                <span style={{ fontWeight: 600, color: '#64748B' }}>{successReceipt.upiReferenceId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Updated Balance:</span>
                <span style={{ fontWeight: 800, color: '#10B981' }}>${parseFloat(successReceipt.updatedBalance).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setSuccessReceipt(null)}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Done & View Ledger
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
