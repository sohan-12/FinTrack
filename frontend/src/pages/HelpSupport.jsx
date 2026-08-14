import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { supportService } from '../services/supportService';
import { useAuth } from '../context/AuthContext';
import {
  HelpCircle,
  MessageSquare,
  LifeBuoy,
  Mail,
  Phone,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Send,
  Sparkles,
  ShieldCheck,
  Smartphone,
  FileText,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HelpSupport = () => {
  const { addToast } = useAuth();
  const navigate = useNavigate();

  const [faqs, setFaqs] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState(null);

  // Ticket Form State
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('UPI & Banking');
  const [priority, setPriority] = useState('Medium');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const loadSupportData = async () => {
    try {
      const [faqData, ticketData] = await Promise.all([
        supportService.getFaqs(),
        supportService.getTickets(),
      ]);
      setFaqs(faqData || []);
      setTickets(ticketData || []);
    } catch (err) {
      console.error('Error loading support data:', err);
    }
  };

  useEffect(() => {
    loadSupportData();
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      addToast('Please provide both a subject and message.', 'error');
      return;
    }

    try {
      setLoading(true);
      const newTicket = await supportService.createTicket({
        subject,
        category,
        priority,
        message,
      });

      addToast(`Ticket #${newTicket.ticketId} created and resolved by AI Agent!`, 'success');
      setSubject('');
      setMessage('');
      loadSupportData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to submit ticket.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'UPI & Banking', 'AI Financial Advisor', 'Data Security', 'Exports & Reports'];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCat = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div>
      <Navbar
        title="Help & Customer Support"
        subtitle="24/7 financial support, interactive FAQs, and AI resolution ticket center"
      />

      <div className="content-area">
        {/* Top 3 Quick Contact Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {/* Card 1: AI Assistant */}
          <div
            className="card"
            style={{
              cursor: 'pointer',
              border: '1px solid #FDBA74',
              background: '#FFFDFB',
              transition: 'transform 0.2s ease',
            }}
            onClick={() => navigate('/ai-assistant')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#FFEDD5', color: '#FF6B00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>FinTrack AI Assistant</h4>
                <span className="badge badge-income" style={{ fontSize: '0.65rem' }}>INSTANT ANSWERS</span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5 }}>
              Ask anything about your income, career breaks, loan affordability, or savings calculations.
            </p>
          </div>

          {/* Card 2: Email Support */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#EDE9FE', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>Direct Email Support</h4>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#7C3AED' }}>support@fintrack.com</div>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5 }}>
              Guaranteed response within 4 business hours from our certified financial operations team.
            </p>
          </div>

          {/* Card 3: Toll-Free Helpline */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Phone size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>Toll-Free Helpline</h4>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#059669' }}>1800-FIN-TRACK (24/7)</div>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5 }}>
              Dedicated customer assistance for urgent banking queries or account security concerns.
            </p>
          </div>
        </div>

        {/* SECTION: FAQS & SUBMIT TICKET SPLIT */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          {/* FAQ Accordion */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <HelpCircle size={18} color="#FF6B00" />
                <span>Frequently Asked Questions</span>
              </h3>
            </div>

            {/* Search FAQ */}
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '36px', fontSize: '0.875rem' }}
                placeholder="Search FAQs by keyword (e.g. UPI, AI, CSV)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActiveCategory(c)}
                  className={`chip-btn ${activeCategory === c ? 'active' : ''}`}
                  style={{
                    fontSize: '0.75rem',
                    background: activeCategory === c ? '#FF6B00' : '#F1F5F9',
                    color: activeCategory === c ? 'white' : '#475569',
                    border: 'none',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* FAQs List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredFaqs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: '#94A3B8', fontSize: '0.875rem' }}>
                  No matching FAQs found. You can submit a support ticket below!
                </div>
              ) : (
                filteredFaqs.map((faq) => {
                  const isOpen = expandedFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      style={{
                        border: '1px solid #E2E8F0',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        background: '#FFFFFF',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>
                          {faq.question}
                        </span>
                        {isOpen ? <ChevronUp size={16} color="#FF6B00" /> : <ChevronDown size={16} color="#94A3B8" />}
                      </button>

                      {isOpen && (
                        <div style={{ padding: '0 16px 14px', fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Submit Support Ticket Form */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <LifeBuoy size={18} color="#FF6B00" />
                <span>Submit a Support Ticket</span>
              </h3>
            </div>

            <form onSubmit={handleCreateTicket}>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Brief description of your issue or request"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="UPI & Banking">UPI & Banking</option>
                    <option value="AI Financial Advisor">AI Advisor</option>
                    <option value="Transactions">Transactions</option>
                    <option value="Account & Security">Account & Security</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High (Urgent)</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Message Details</label>
                <textarea
                  rows={4}
                  required
                  className="form-input"
                  placeholder="Explain your query in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Send size={15} />
                <span>{loading ? 'Submitting Ticket...' : 'Submit Ticket to FinTrack Support'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* SECTION: MY SUPPORT TICKETS HISTORY */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Clock size={18} color="#FF6B00" />
              <span>My Support Tickets</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
              {tickets.length} Active Records
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tickets.map((t) => (
              <div
                key={t.ticketId}
                style={{
                  padding: '16px',
                  background: '#F8FAFC',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, color: '#FF6B00', fontSize: '0.85rem' }}>
                      #{t.ticketId}
                    </span>
                    <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', margin: 0 }}>
                      {t.subject}
                    </h4>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span className="badge badge-category" style={{ fontSize: '0.7rem' }}>
                      {t.category}
                    </span>
                    <span className="badge badge-income" style={{ fontSize: '0.7rem' }}>
                      {t.status}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '10px' }}>
                  {t.message}
                </p>

                {t.responseMessage && (
                  <div
                    style={{
                      background: '#FFFFFF',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      borderLeft: '3px solid #10B981',
                      fontSize: '0.825rem',
                      color: '#0F172A',
                      lineHeight: 1.5,
                    }}
                  >
                    <div style={{ fontWeight: 700, color: '#059669', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={13} />
                      <span>FinTrack Support Team Resolution:</span>
                    </div>
                    {t.responseMessage}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
