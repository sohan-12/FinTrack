import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { transactionService } from '../services/transactionService';
import { categoryService } from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import {
  PlusCircle,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Tag,
  FileText,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AddTransaction = () => {
  const { addToast } = useAuth();
  const navigate = useNavigate();

  const [type, setType] = useState('EXPENSE');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    categoryService.getCategories()
      .then((data) => {
        setCategories(data);
        if (data.length > 0) {
          setCategory(type === 'INCOME' ? 'Salary' : 'Groceries');
        }
      })
      .catch((err) => console.error(err));
  }, [type]);

  const quickAmounts = type === 'EXPENSE' ? [15, 30, 50, 100, 250, 500] : [500, 1000, 2500, 4500, 6000];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount greater than $0.');
      return;
    }
    if (!category) {
      setError('Please select a category.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await transactionService.createTransaction({
        type,
        amount: parseFloat(amount),
        category,
        description,
        transactionDate,
      });

      addToast(`${type === 'INCOME' ? 'Income' : 'Expense'} of $${parseFloat(amount).toFixed(2)} added!`, 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save transaction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar
        title="Add New Transaction"
        subtitle="Log income or track your expenses with instant category tagging"
      />

      <div className="content-area">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px', maxWidth: '1000px', margin: '0 auto' }}>
          {/* Main Transaction Form */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <PlusCircle size={20} color="#FF6B00" />
                <span>Transaction Details</span>
              </h3>
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

            <form onSubmit={handleSubmit}>
              {/* Type Switcher */}
              <div className="form-group">
                <label className="form-label">Flow of Funds</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setType('EXPENSE');
                      setCategory('Groceries');
                    }}
                    className={`btn ${type === 'EXPENSE' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: type === 'EXPENSE' ? 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)' : undefined,
                      borderColor: type === 'EXPENSE' ? '#EF4444' : undefined,
                      boxShadow: type === 'EXPENSE' ? '0 4px 14px 0 rgba(239, 68, 68, 0.35)' : undefined,
                    }}
                  >
                    <TrendingDown size={18} />
                    <span>Expense (-)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setType('INCOME');
                      setCategory('Salary');
                    }}
                    className={`btn ${type === 'INCOME' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: type === 'INCOME' ? 'linear-gradient(135deg, #10B981 0%, #34D399 100%)' : undefined,
                      borderColor: type === 'INCOME' ? '#10B981' : undefined,
                      boxShadow: type === 'INCOME' ? '0 4px 14px 0 rgba(16, 185, 129, 0.35)' : undefined,
                    }}
                  >
                    <TrendingUp size={18} />
                    <span>Income (+)</span>
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div className="form-group">
                <label className="form-label">Amount ($)</label>
                <div style={{ position: 'relative' }}>
                  <DollarSign
                    size={20}
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
                  />
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="form-input"
                    style={{ paddingLeft: '40px', fontSize: '1.25rem', fontWeight: 700 }}
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                {/* Quick amount chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  {quickAmounts.map((qa) => (
                    <button
                      key={qa}
                      type="button"
                      onClick={() => setAmount(qa.toString())}
                      className="chip-btn"
                      style={{ fontSize: '0.75rem', padding: '3px 10px' }}
                    >
                      ${qa}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="form-group">
                <label className="form-label">Category</label>
                <div style={{ position: 'relative' }}>
                  <Tag
                    size={18}
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
                  />
                  <select
                    className="form-select"
                    style={{ paddingLeft: '38px' }}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">-- Choose Category --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <FileText
                    size={18}
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
                  />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                    placeholder="e.g. Organic Trader Joe's groceries"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              {/* Date */}
              <div className="form-group" style={{ marginBottom: '28px' }}>
                <label className="form-label">Transaction Date</label>
                <div style={{ position: 'relative' }}>
                  <Calendar
                    size={18}
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
                  />
                  <input
                    type="date"
                    required
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                  disabled={loading}
                >
                  {loading ? 'Recording...' : 'Save Transaction'}
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Card & AI Smart Tip */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Live Receipt Card */}
            <div className="card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '12px' }}>
                Live Receipt Preview
              </div>

              <div
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  backgroundColor: type === 'INCOME' ? '#ECFDF5' : '#FEF2F2',
                  border: `1px solid ${type === 'INCOME' ? '#A7F3D0' : '#FECACA'}`,
                  textAlign: 'center',
                  marginBottom: '16px',
                }}
              >
                <span className={`badge ${type === 'INCOME' ? 'badge-income' : 'badge-expense'}`} style={{ marginBottom: '8px' }}>
                  {type}
                </span>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: type === 'INCOME' ? '#10B981' : '#EF4444', letterSpacing: '-0.5px' }}>
                  {type === 'INCOME' ? '+' : '-'}${amount ? parseFloat(amount || 0).toFixed(2) : '0.00'}
                </div>
                <div style={{ fontWeight: 700, color: '#0F172A', marginTop: '4px' }}>
                  {category || 'Category not selected'}
                </div>
                {description && (
                  <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px' }}>
                    "{description}"
                  </div>
                )}
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '6px' }}>
                  Date: {transactionDate}
                </div>
              </div>
            </div>

            {/* AI Assistant Advice */}
            <div className="card" style={{ background: '#FFF7ED', border: '1px solid #FFEDD5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FF6B00', marginBottom: '10px' }}>
                <Sparkles size={18} />
                <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>FinTrack AI Tip</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                Logging transactions as soon as they happen increases personal savings by an average of 18%.
                FinTrack AI automatically updates your monthly forecast when you save this transaction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
