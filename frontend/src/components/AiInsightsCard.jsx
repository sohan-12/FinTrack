import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, AlertTriangle, Lightbulb, RefreshCw } from 'lucide-react';

export const AiInsightsCard = ({ insights, loading, onRefresh }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="card" style={{ background: 'linear-gradient(180deg, #FFFDFB 0%, #FFFFFF 100%)', border: '1px solid #FFEDD5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FF6B00', marginBottom: '16px' }}>
          <Sparkles size={20} />
          <span style={{ fontWeight: 700 }}>FinTrack AI Insights</span>
        </div>
        <div style={{ padding: '20px 0', textAlign: 'center', color: '#94A3B8' }}>
          Analyzing your spending patterns and generating insights...
        </div>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div
      className="card"
      style={{
        background: 'linear-gradient(180deg, #FFFDFB 0%, #FFFFFF 100%)',
        border: '1px solid #FDBA74',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FF6B00' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#FFEDD5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={16} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A' }}>FinTrack AI Insights</span>
          {insights.aiGenerated && (
            <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>
              Gemini Powered
            </span>
          )}
        </div>

        <button
          onClick={onRefresh}
          className="btn btn-secondary btn-sm"
          title="Refresh Insights"
          style={{ padding: '4px 8px' }}
        >
          <RefreshCw size={14} />
        </button>
      </div>

      <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, marginBottom: '18px' }}>
        {insights.spendingSummary}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '18px' }}>
        {/* Health Score */}
        <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
            Financial Health
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={18} color="#10B981" />
            <span>{insights.healthScore || 'Good'}</span>
          </div>
        </div>

        {/* Top Category Impact */}
        <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
            Top Expense Driver
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FF6B00' }}>
            {insights.topSpendingCategory || 'None'}
          </div>
        </div>
      </div>

      {/* Actionable Savings Suggestions */}
      {insights.savingsSuggestions && insights.savingsSuggestions.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
            <Lightbulb size={16} color="#F59E0B" />
            <span>Smart Recommendations</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {insights.savingsSuggestions.map((tip, idx) => (
              <li
                key={idx}
                style={{
                  fontSize: '0.85rem',
                  color: '#475569',
                  padding: '8px 12px',
                  background: '#FFF7ED',
                  borderRadius: '6px',
                  border: '1px solid #FFEDD5',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                }}
              >
                <span style={{ color: '#FF6B00', fontWeight: 700 }}>•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => navigate('/ai-assistant')}
          className="btn btn-outline-orange btn-sm"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <span>Chat with FinTrack AI for Custom Advice</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
