import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { StatCard } from '../components/StatCard';
import { adminService } from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Receipt,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  RefreshCw,
  Eye,
  X,
  Wallet,
  Calendar,
  Tag,
  ArrowRight
} from 'lucide-react';

export const Admin = () => {
  const { addToast } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'transactions'

  // Selected User Portfolio Modal State
  const [selectedUserPortfolio, setSelectedUserPortfolio] = useState(null);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData, txData] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
        adminService.getTransactions(0, 30),
      ]);
      setStats(statsData);
      setUsers(usersData);
      setTransactions(txData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      addToast('Failed to load admin telemetry', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInspectUser = async (userId) => {
    try {
      setLoadingPortfolio(true);
      const portfolioData = await adminService.getUserPortfolio(userId);
      setSelectedUserPortfolio(portfolioData);
    } catch (err) {
      addToast('Failed to load user financial portfolio', 'error');
    } finally {
      setLoadingPortfolio(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  return (
    <div>
      <Navbar
        title="Admin Management Console"
        subtitle="Platform-wide telemetry, user portfolio inspector, and global transaction ledger"
      />

      <div className="content-area">
        {/* Admin Metric Cards */}
        <div className="stat-grid">
          <StatCard
            title="Total Users"
            value={stats ? stats.totalUsers : 0}
            icon={Users}
            color="orange"
            subtitle="Registered Accounts"
          />

          <StatCard
            title="Platform Transactions"
            value={stats ? stats.totalTransactions : 0}
            icon={Receipt}
            color="info"
            subtitle="Processed Records"
          />

          <StatCard
            title="Total Volume (Income)"
            value={`$${stats ? parseFloat(stats.totalSystemIncome).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}`}
            icon={TrendingUp}
            color="income"
            subtitle="System-Wide Inflow"
          />

          <StatCard
            title="Total Volume (Expenses)"
            value={`$${stats ? parseFloat(stats.totalSystemExpenses).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}`}
            icon={TrendingDown}
            color="expense"
            subtitle="System-Wide Outflow"
          />
        </div>

        {/* System Health Overview Card */}
        <div className="card" style={{ marginBottom: '24px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED' }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>FinTrack Administrative Engine</h4>
                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Live PostgreSQL Connection • Real-Time User Financial Portfolio Inspector</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <span className="badge badge-income" style={{ padding: '6px 12px' }}>
                PostgreSQL 17 (Live)
              </span>
              <span className="badge badge-orange" style={{ padding: '6px 12px' }}>
                Admin Privileges Active
              </span>
              <button onClick={loadAdminData} className="btn btn-secondary btn-sm" title="Refresh Telemetry">
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            onClick={() => setActiveTab('users')}
            className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          >
            <Users size={16} />
            <span>User Directory & Portfolios ({users.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`btn ${activeTab === 'transactions' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          >
            <Receipt size={16} />
            <span>System Transactions ({stats?.totalTransactions || 0})</span>
          </button>
        </div>

        {/* Tab 1: Users Registry with Direct Drilldown */}
        {activeTab === 'users' && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Users size={18} color="#FF6B00" />
                <span>User Directory (Click any user to inspect their live portfolio)</span>
              </h3>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th>Registration Date</th>
                    <th style={{ textAlign: 'right' }}>Portfolio Drilldown</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={{ cursor: 'pointer' }} onClick={() => handleInspectUser(u.id)}>
                      <td style={{ fontWeight: 700, color: '#64748B' }}>#{u.id}</td>
                      <td style={{ fontWeight: 700, color: '#0F172A' }}>{u.name}</td>
                      <td style={{ color: '#475569' }}>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'ADMIN' ? 'badge-admin' : 'badge-orange'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ color: '#64748B' }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Active'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-outline-orange btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInspectUser(u.id);
                          }}
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        >
                          <Eye size={13} />
                          <span>Inspect Portfolio</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Global Transactions Ledger */}
        {activeTab === 'transactions' && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Receipt size={18} color="#FF6B00" />
                <span>Recent Platform Transactions</span>
              </h3>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Tx ID</th>
                    <th>User ID</th>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td style={{ fontWeight: 700, color: '#64748B' }}>#{tx.id}</td>
                      <td style={{ fontWeight: 600, color: '#FF6B00' }}>User #{tx.userId}</td>
                      <td style={{ color: '#475569' }}>{tx.transactionDate}</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* USER PORTFOLIO DRILLDOWN INSPECTOR MODAL */}
      {selectedUserPortfolio && (
        <div className="modal-overlay" onClick={() => setSelectedUserPortfolio(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {selectedUserPortfolio.user.name}'s Portfolio
                  </h3>
                  <span className="badge badge-orange">User #{selectedUserPortfolio.user.id}</span>
                </div>
                <div style={{ fontSize: '0.825rem', color: '#64748B', marginTop: '2px' }}>
                  {selectedUserPortfolio.user.email} • Registered {selectedUserPortfolio.user.createdAt ? new Date(selectedUserPortfolio.user.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
              <button onClick={() => setSelectedUserPortfolio(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={22} />
              </button>
            </div>

            {/* Portfolio Stat Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
              <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Net Balance</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: selectedUserPortfolio.summary.netSavings >= 0 ? '#10B981' : '#EF4444', marginTop: '4px' }}>
                  ${parseFloat(selectedUserPortfolio.summary.netSavings).toFixed(2)}
                </div>
              </div>

              <div style={{ background: '#F0FDF4', padding: '14px', borderRadius: '10px', border: '1px solid #BBF7D0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Total Inflow</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#16A34A', marginTop: '4px' }}>
                  +${parseFloat(selectedUserPortfolio.summary.totalIncome).toFixed(2)}
                </div>
              </div>

              <div style={{ background: '#FEF2F2', padding: '14px', borderRadius: '10px', border: '1px solid #FECACA' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#991B1B', textTransform: 'uppercase' }}>Total Outflow</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#DC2626', marginTop: '4px' }}>
                  -${parseFloat(selectedUserPortfolio.summary.totalExpenses).toFixed(2)}
                </div>
              </div>
            </div>

            {/* User Transaction History */}
            <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', marginBottom: '12px' }}>
              Transaction Ledger ({selectedUserPortfolio.transactions.length} Records)
            </h4>

            {selectedUserPortfolio.transactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: '#94A3B8', fontSize: '0.875rem' }}>
                This user has not recorded any transactions yet.
              </div>
            ) : (
              <div className="table-container" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUserPortfolio.transactions.map((tx) => (
                      <tr key={tx.id}>
                        <td style={{ color: '#475569' }}>{tx.transactionDate}</td>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
