import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { StatCard } from '../components/StatCard';
import { AiInsightsCard } from '../components/AiInsightsCard';
import { IncomeExpenseChart } from '../components/Charts/IncomeExpenseChart';
import { CategoryPieChart } from '../components/Charts/CategoryPieChart';
import { MonthlyBarChart } from '../components/Charts/MonthlyBarChart';
import { TransactionModal } from '../components/TransactionModal';
import { transactionService } from '../services/transactionService';
import { aiService } from '../services/aiService';
import { upiService } from '../services/upiService';
import { useAuth } from '../context/AuthContext';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Receipt,
  ArrowRight,
  Plus,
  Eye,
  Edit2,
  Trash2,
  PieChart,
  BarChart3,
  Smartphone,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const Dashboard = () => {
  const { user, addToast } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Modal State
  const [selectedTx, setSelectedTx] = useState(null);
  const [modalMode, setModalMode] = useState('view');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [sumRes, catRes, monthRes, txRes] = await Promise.all([
        transactionService.getFinancialSummary(),
        transactionService.getCategorySummary(),
        transactionService.getMonthlySummary(),
        transactionService.getTransactions({ page: 0, size: 6, sortBy: 'transaction_date', sortDir: 'DESC' }),
      ]);

      setSummary(sumRes);
      setCategories(catRes);
      setMonthlyData(monthRes);
      setRecentTransactions(txRes.content || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      addToast('Failed to load financial data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadAiInsights = async () => {
    try {
      setAiLoading(true);
      const insights = await aiService.getInsights();
      setAiInsights(insights);
    } catch (err) {
      console.error('Error fetching AI insights:', err);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    loadAiInsights();
  }, []);

  const handleQuickSync = async () => {
    try {
      setSyncing(true);
      const res = await upiService.syncUpi();
      addToast(res.message, 'success');
      loadDashboardData();
      loadAiInsights();
    } catch (err) {
      addToast('Failed to sync bank feeds', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleOpenModal = (tx, mode) => {
    setSelectedTx(tx);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleSaveTransaction = async (id, updatedData) => {
    await transactionService.updateTransaction(id, updatedData);
    addToast('Transaction updated successfully!', 'success');
    loadDashboardData();
    loadAiInsights();
  };

  const handleDeleteTransaction = async (id) => {
    await transactionService.deleteTransaction(id);
    addToast('Transaction deleted safely', 'info');
    loadDashboardData();
    loadAiInsights();
  };

  // Sample Budget Limits per category
  const categoryBudgets = {
    'Rent & Housing': 2500,
    'Groceries': 600,
    'Dining Out': 300,
    'Travel': 400,
    'Shopping': 350,
    'Utilities & Bills': 250,
    'Entertainment': 150,
  };

  return (
    <div>
      <Navbar
        title={`Hello, ${user?.name?.split(' ')[0] || 'there'}! 👋`}
        subtitle="Here is your personal financial overview, automated UPI feeds, and AI analysis."
      />

      <div className="content-area">
        {/* UPI Auto-Sync Banner */}
        <div
          className="card"
          style={{
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #FFFDFB 0%, #FFFFFF 100%)',
            border: '1px solid #FDBA74',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-orange)',
              }}
            >
              <Smartphone size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Connected UPI & Bank Aggregator</span>
                <span className="badge badge-income" style={{ fontSize: '0.65rem' }}>ACTIVE</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Linked VPA: <strong>user.fintrack@okhdfcbank</strong> • Auto-reflects payments made on GPay & PhonePe
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleQuickSync}
              className="btn btn-secondary btn-sm"
              disabled={syncing}
              style={{ borderColor: '#FF6B00', color: '#FF6B00' }}
            >
              <Zap size={14} className={syncing ? 'spin' : ''} />
              <span>{syncing ? 'Syncing...' : 'Sync Bank UPI Feeds'}</span>
            </button>

            <button
              onClick={() => navigate('/upi-banking')}
              className="btn btn-primary btn-sm"
            >
              <Smartphone size={14} />
              <span>Open UPI Hub</span>
            </button>
          </div>
        </div>

        {/* Top 4 Stat Cards */}
        <div className="stat-grid">
          <StatCard
            title="Total Balance"
            value={`$${summary ? parseFloat(summary.currentBalance).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}`}
            icon={Wallet}
            color="orange"
            subtitle={summary?.currentBalance >= 0 ? 'Positive Cash Flow' : 'Negative Balance'}
          />

          <StatCard
            title="Total Income"
            value={`$${summary ? parseFloat(summary.totalIncome).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}`}
            icon={TrendingUp}
            color="income"
            subtitle="Earnings & Inflow"
          />

          <StatCard
            title="Total Expenses"
            value={`$${summary ? parseFloat(summary.totalExpenses).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}`}
            icon={TrendingDown}
            color="expense"
            subtitle="Outgoing & Bills"
          />

          <StatCard
            title="Transactions"
            value={summary ? summary.transactionCount : 0}
            icon={Receipt}
            color="info"
            subtitle={`Largest: $${summary ? parseFloat(summary.largestExpense).toFixed(2) : '0.00'}`}
          />
        </div>

        {/* Middle Section: Charts & AI Insights */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          {/* AI Insights Card */}
          <AiInsightsCard
            insights={aiInsights}
            loading={aiLoading}
            onRefresh={loadAiInsights}
          />

          {/* Income vs Expenses Chart */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <BarChart3 size={18} color="#FF6B00" />
                <span>Income vs Expenses</span>
              </h3>
            </div>
            <IncomeExpenseChart
              income={summary ? parseFloat(summary.totalIncome) : 0}
              expenses={summary ? parseFloat(summary.totalExpenses) : 0}
            />
          </div>
        </div>

        {/* Second Row: Monthly Trends & Category Doughnut */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          {/* Monthly Comparison */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <TrendingUp size={18} color="#FF6B00" />
                <span>Monthly Cashflow Trends</span>
              </h3>
            </div>
            <MonthlyBarChart monthlyData={monthlyData} />
          </div>

          {/* Category Breakdown */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <PieChart size={18} color="#FF6B00" />
                <span>Expenses by Category</span>
              </h3>
            </div>
            <CategoryPieChart categories={categories} />
          </div>
        </div>

        {/* Category Budget & Spending Progress Tracker */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <h3 className="card-title">
              <Zap size={18} color="#FF6B00" />
              <span>Monthly Category Budgets & Spending Limits</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Live Threshold Alerts</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {categories.slice(0, 4).map((cat) => {
              const budget = categoryBudgets[cat.category] || 500;
              const spent = parseFloat(cat.totalAmount);
              const percentage = Math.min(100, Math.round((spent / budget) * 100));
              const isOver = percentage >= 90;
              const isWarning = percentage >= 70 && percentage < 90;

              return (
                <div key={cat.category} style={{ padding: '14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>{cat.category}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isOver ? '#EF4444' : isWarning ? '#F59E0B' : '#10B981' }}>
                      ${spent.toFixed(0)} / ${budget} ({percentage}%)
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: isOver ? '#EF4444' : isWarning ? '#F59E0B' : '#10B981',
                        borderRadius: '9999px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '0.75rem', color: isOver ? '#EF4444' : '#64748B' }}>
                    {isOver ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} color="#10B981" />}
                    <span>{isOver ? 'Exceeding budget target!' : 'Within target range'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Section: Recent Transactions Table */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Receipt size={18} color="#FF6B00" />
              <span>Recent Transactions</span>
            </h3>
            <button
              onClick={() => navigate('/transactions')}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>View All Transactions</span>
              <ArrowRight size={14} />
            </button>
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
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#94A3B8' }}>
                      No transactions recorded yet. Click <strong>Add Transaction</strong> or <strong>Sync Bank UPI Feeds</strong> to get started!
                    </td>
                  </tr>
                ) : (
                  recentTransactions.map((tx) => (
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
                            title="View"
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
