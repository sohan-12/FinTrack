import React, { useState, useEffect } from 'react';
import { X, Check, Trash2, Calendar, DollarSign, Tag, FileText } from 'lucide-react';
import { categoryService } from '../services/aiService';

export const TransactionModal = ({
  isOpen,
  mode = 'view', // 'view' | 'edit' | 'delete'
  transaction,
  onClose,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState({
    type: 'EXPENSE',
    amount: '',
    category: '',
    description: '',
    transactionDate: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type || 'EXPENSE',
        amount: transaction.amount || '',
        category: transaction.category || '',
        description: transaction.description || '',
        transactionDate: transaction.transactionDate || '',
      });
    }
  }, [transaction]);

  useEffect(() => {
    if (isOpen) {
      categoryService.getCategories()
        .then((data) => setCategories(data))
        .catch((err) => console.error(err));
    }
  }, [isOpen]);

  if (!isOpen || !transaction) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSave(transaction.id, {
        ...formData,
        amount: parseFloat(formData.amount),
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      await onDelete(transaction.id);
      onClose();
    } catch (err) {
      setError('Failed to delete transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
            {mode === 'edit' && 'Edit Transaction'}
            {mode === 'view' && 'Transaction Details'}
            {mode === 'delete' && 'Delete Confirmation'}
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', color: '#EF4444', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {mode === 'view' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#F8FAFC', borderRadius: '12px' }}>
              <div>
                <span className={`badge ${transaction.type === 'INCOME' ? 'badge-income' : 'badge-expense'}`}>
                  {transaction.type}
                </span>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '8px', color: transaction.type === 'INCOME' ? '#10B981' : '#EF4444' }}>
                  {transaction.type === 'INCOME' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
                </h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Category</div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0F172A' }}>{transaction.category}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#475569' }}>
                <Calendar size={18} color="#64748B" />
                <span><strong>Date:</strong> {transaction.transactionDate}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#475569' }}>
                <FileText size={18} color="#64748B" />
                <span><strong>Description:</strong> {transaction.description || 'No description provided.'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button onClick={onClose} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        )}

        {mode === 'edit' && (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <button
                type="button"
                className={`btn ${formData.type === 'EXPENSE' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
                onClick={() => setFormData({ ...formData, type: 'EXPENSE' })}
              >
                Expense
              </button>
              <button
                type="button"
                className={`btn ${formData.type === 'INCOME' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
                onClick={() => setFormData({ ...formData, type: 'INCOME' })}
              >
                Income
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                required
                className="form-input"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-input"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                required
                className="form-input"
                value={formData.transactionDate}
                onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {mode === 'delete' && (
          <div>
            <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '20px' }}>
              Are you sure you want to delete this <strong>{transaction.category}</strong> transaction of{' '}
              <strong>${parseFloat(transaction.amount).toFixed(2)}</strong>? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={onClose} className="btn btn-secondary" disabled={loading}>
                Cancel
              </button>
              <button onClick={handleDeleteConfirm} className="btn btn-danger" disabled={loading}>
                {loading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
