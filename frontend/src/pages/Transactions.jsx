import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { TransactionModal } from '../components/TransactionModal';
import { transactionService } from '../services/transactionService';
import { categoryService } from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Filter,
  RotateCcw,
  Eye,
  Edit2,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Download,
  Smartphone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Transactions = () => {
  const { addToast } = useAuth();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search States
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [sortBy, setSortBy] = useState('transaction_date');
  const [sortDir, setSortDir] = useState('DESC');

  // Pagination State
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // Modal State
  const [selectedTx, setSelectedTx] = useState(null);
  const [modalMode, setModalMode] = useState('view');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size: pageSize,
        sortBy,
        sortDir,
      };

      if (search.trim()) params.search = search.trim();
      if (type) params.type = type;
      if (selectedCategory) params.category = selectedCategory;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (minAmount) params.minAmount = minAmount;
      if (maxAmount) params.maxAmount = maxAmount;

      const data = await transactionService.getTransactions(params);
      setTransactions(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      addToast('Failed to load transactions', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [page, type, selectedCategory, startDate, endDate, minAmount, maxAmount, sortBy, sortDir]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchTransactions();
  };

  const handleResetFilters = () => {
    setSearch('');
    setType('');
    setSelectedCategory('');
    setStartDate('');
    setEndDate('');
    setMinAmount('');
    setMaxAmount('');
    setSortBy('transaction_date');
    setSortDir('DESC');
    setPage(0);
  };

  const handleExportCsv = () => {
    if (transactions.length === 0) {
      addToast('No transactions to export', 'info');
      return;
    }

    const headers = ['ID', 'Date', 'Type', 'Amount', 'Category', 'Description'];
    const rows = transactions.map((t) => [
      t.id,
      t.transactionDate,
      t.type,
      t.amount,
      `"${t.category}"`,
      `"${t.description || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FinTrack_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Transactions exported to CSV successfully!', 'success');
  };

  const handleOpenModal = (tx, mode) => {
    setSelectedTx(tx);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleSaveTransaction = async (id, updatedData) => {
    await transactionService.updateTransaction(id, updatedData);
    addToast('Transaction updated successfully!', 'success');
    fetchTransactions();
  };

  const handleDeleteTransaction = async (id) => {
    await transactionService.deleteTransaction(id);
    addToast('Transaction deleted safely', 'info');
    fetchTransactions();
  };

  return (
    <div>
      <Navbar
        title="Transaction History"
        subtitle={`Managing ${totalElements} total financial transactions`}
      />

      <div className="content-area">
        {/* Search & Filter Header Bar */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <form onSubmit={handleSearchSubmit}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
              {/* Search Bar */}
              <div style={{ flex: '1 1 280px', position: 'relative' }}>
                <Search
                  size={18}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
                />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="Search by description, merchant, or category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Type Filter */}
              <select
                className="form-select"
                style={{ width: 'auto', minWidth: '140px' }}
                value={type}
                onChange={(e) => { setType(e.target.value); setPage(0); }}
              >
                <option value="">All Types</option>
                <option value="INCOME">Income (+)</option>
                <option value="EXPENSE">Expense (-)</option>
              </select>

              {/* Category Filter */}
              <select
                className="form-select"
                style={{ width: 'auto', minWidth: '160px' }}
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setPage(0); }}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Sort Dropdown */}
              <select
                className="form-select"
                style={{ width: 'auto', minWidth: '150px' }}
                value={`${sortBy}-${sortDir}`}
                onChange={(e) => {
                  const [sb, sd] = e.target.value.split('-');
                  setSortBy(sb);
                  setSortDir(sd);
                  setPage(0);
                }}
              >
                <option value="transaction_date-DESC">Date: Newest First</option>
                <option value="transaction_date-ASC">Date: Oldest First</option>
                <option value="amount-DESC">Amount: Highest First</option>
                <option value="amount-ASC">Amount: Lowest First</option>
              </select>

              <button type="submit" className="btn btn-primary btn-sm">
                <Search size={14} />
                <span>Search</span>
              </button>

              <button
                type="button"
                onClick={handleResetFilters}
                className="btn btn-secondary btn-sm"
                title="Reset Filters"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            </div>

            {/* Secondary Advanced Date & Amount Filters */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '14px',
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #F1F5F9',
                alignItems: 'center',
                fontSize: '0.875rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#64748B', fontWeight: 600 }}>From:</span>
                <input
                  type="date"
                  className="form-input"
                  style={{ width: 'auto', padding: '6px 10px', fontSize: '0.85rem' }}
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setPage(0); }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#64748B', fontWeight: 600 }}>To:</span>
                <input
                  type="date"
                  className="form-input"
                  style={{ width: 'auto', padding: '6px 10px', fontSize: '0.85rem' }}
                  value={endDate}
                  onChange={(e) => { setEndDate(e.target.value); setPage(0); }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#64748B', fontWeight: 600 }}>Min $:</span>
                <input
                  type="number"
                  placeholder="0"
                  className="form-input"
                  style={{ width: '90px', padding: '6px 10px', fontSize: '0.85rem' }}
                  value={minAmount}
                  onChange={(e) => { setMinAmount(e.target.value); setPage(0); }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#64748B', fontWeight: 600 }}>Max $:</span>
                <input
                  type="number"
                  placeholder="9999"
                  className="form-input"
                  style={{ width: '90px', padding: '6px 10px', fontSize: '0.85rem' }}
                  value={maxAmount}
                  onChange={(e) => { setMaxAmount(e.target.value); setPage(0); }}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Transactions Table Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <span>All Records</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748B' }}>
                (Showing {transactions.length} of {totalElements})
              </span>
            </h3>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleExportCsv}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => navigate('/upi-banking')}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FF6B00', borderColor: '#FDBA74' }}
              >
                <Smartphone size={14} />
                <span>UPI Pay</span>
              </button>

              <button
                onClick={() => navigate('/add-transaction')}
                className="btn btn-primary btn-sm"
              >
                <Plus size={14} />
                <span>Add Record</span>
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: '#94A3B8' }}>
                      Loading transactions...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: '#94A3B8' }}>
                      No matching transactions found with the active filters.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td style={{ fontWeight: 500, color: '#475569' }}>{tx.transactionDate}</td>
                      <td>
                        <span className="badge badge-category">{tx.category}</span>
                      </td>
                      <td style={{ fontWeight: 600, color: '#0F172A' }}>{tx.description || '—'}</td>
                      <td>
                        <span className={`badge ${tx.type === 'INCOME' ? 'badge-income' : 'badge-expense'}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className={tx.type === 'INCOME' ? 'amount-income' : 'amount-expense'}>
                        {tx.type === 'INCOME' ? '+' : '-'}${parseFloat(tx.amount).toFixed(2)}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => handleOpenModal(tx, 'view')}
                            className="btn btn-secondary btn-sm"
                            title="View Details"
                            style={{ padding: '4px 8px' }}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleOpenModal(tx, 'edit')}
                            className="btn btn-secondary btn-sm"
                            title="Edit"
                            style={{ padding: '4px 8px' }}
                          >
                            <Edit2 size={14} color="#FF6B00" />
                          </button>
                          <button
                            onClick={() => handleOpenModal(tx, 'delete')}
                            className="btn btn-secondary btn-sm"
                            title="Delete"
                            style={{ padding: '4px 8px' }}
                          >
                            <Trash2 size={14} color="#EF4444" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid #F1F5F9',
              }}
            >
              <span style={{ fontSize: '0.875rem', color: '#64748B' }}>
                Page <strong>{page + 1}</strong> of <strong>{totalPages}</strong>
              </span>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="btn btn-secondary btn-sm"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="btn btn-secondary btn-sm"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Modal (View / Edit / Delete) */}
      <TransactionModal
        isOpen={isModalOpen}
        mode={modalMode}
        transaction={selectedTx}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        onDelete={handleDeleteTransaction}
      />
    </div>
  );
};
