import React, { useState } from 'react';
import { useWealth } from '../../context/WealthContext';
import { CreditCard, AlertTriangle, ShieldCheck, Plus, Trash2, Calculator, ArrowRight, HeartHandshake } from 'lucide-react';

export function DebtView() {
  const { state, debtMetrics, formatMoney, addDebt, removeDebt, updateDebt } = useWealth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('Credit Card');
  const [balance, setBalance] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [interestRate, setInterestRate] = useState('18');
  const [extraPayment, setExtraPayment] = useState(500);

  const handleAddDebt = (e) => {
    e.preventDefault();
    const bal = Number(balance);
    const pmt = Number(monthlyPayment);
    if (!name || isNaN(bal) || bal <= 0 || isNaN(pmt) || pmt <= 0) return;

    addDebt({
      name,
      type,
      balance: bal,
      monthlyPayment: pmt,
      interestRate: Number(interestRate) || 0,
      dueDate: 'Every month'
    });

    setName('');
    setBalance('');
    setMonthlyPayment('');
    setShowAddModal(false);
  };

  // Payoff calculations
  const totalBalance = debtMetrics.totalDebt;
  const currentMonthly = Math.max(100, debtMetrics.totalMonthlyPayment);
  const monthsCurrent = totalBalance > 0 ? Math.ceil(totalBalance / currentMonthly) : 0;
  const acceleratedMonthly = currentMonthly + extraPayment;
  const monthsAccelerated = totalBalance > 0 ? Math.ceil(totalBalance / acceleratedMonthly) : 0;
  const monthsSaved = Math.max(0, monthsCurrent - monthsAccelerated);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Empathetic Banner */}
      <div
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 67, 0.85) 0%, rgba(18, 26, 43, 0.85) 100%)',
          padding: '24px 28px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <HeartHandshake size={18} style={{ color: 'var(--amber-light)' }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--amber-light)', fontWeight: 700, textTransform: 'uppercase' }}>
                Supportive & Shame-Free Debt Optimizer
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', marginTop: '4px' }}>
              Managing & Reducing Your Liabilities
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '650px', marginTop: '4px' }}>
              Having debt during college is common. Our goal is simply to help you understand the true cost of interest and give you a steady path to freedom.
            </p>
          </div>

          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            <span>Add Liability</span>
          </button>
        </div>

        {/* Status banner */}
        <div
          style={{
            marginTop: '20px',
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            background: debtMetrics.status === 'priority' ? 'var(--rose-subtle)' : debtMetrics.totalDebt > 0 ? 'var(--amber-subtle)' : 'var(--emerald-subtle)',
            border: `1px solid ${debtMetrics.status === 'priority' ? 'rgba(244,63,94,0.3)' : debtMetrics.totalDebt > 0 ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          {debtMetrics.totalDebt > 0 ? <AlertTriangle size={20} style={{ color: '#fbbf24', flexShrink: 0 }} /> : <ShieldCheck size={20} style={{ color: '#34d399', flexShrink: 0 }} />}
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: debtMetrics.totalDebt > 0 ? '#fef3c7' : '#d1fae5' }}>
              {debtMetrics.totalDebt > 0 ? `🟡 ${debtMetrics.statusText}: This debt deserves attention` : '🟢 Debt Free! You have zero active liabilities.'}
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {debtMetrics.guidance}
            </div>
          </div>
        </div>
      </div>

      {/* Liabilities List & Simulator Split */}
      <div className="grid-dashboard-main">
        {/* Left: Active Liabilities */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Your Active Liabilities</h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Total: {formatMoney(debtMetrics.totalDebt)}
            </span>
          </div>

          {state.debts.length === 0 ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎉</div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>No Debts Recorded</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                You have no loans, EMIs, or credit card balances. Any extra money can go directly to your goals!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {state.debts.map((debt) => (
                <div
                  key={debt.id}
                  style={{
                    padding: '16px 18px',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-glass)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.1rem' }}>💳</span>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{debt.name}</h4>
                        <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                          {debt.type}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Interest Rate: {debt.interestRate ? `${debt.interestRate}% APR` : 'Not specified'} • Due: {debt.dueDate || 'Monthly'}
                      </div>
                    </div>

                    <button
                      className="btn-ghost"
                      style={{ color: 'var(--rose-light)' }}
                      onClick={() => removeDebt(debt.id)}
                      title="Remove debt"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid-3" style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Outstanding</span>
                      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fbbf24' }}>
                        {formatMoney(debt.balance)}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monthly Payment</span>
                      <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                        {formatMoney(debt.monthlyPayment)}/mo
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Est. Payoff</span>
                      <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                        ~{Math.ceil(debt.balance / Math.max(50, debt.monthlyPayment))} months
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '6px' }}>
                    💡 <strong>Insight:</strong> Paying just the minimum {formatMoney(debt.monthlyPayment)} can cause interest to accumulate. Chipping in an extra ₹300–₹500 speeds up your freedom.
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Section 7 Extra Payment Payoff Simulator & Best Practices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Interactive Extra Payment Simulator */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Calculator size={18} style={{ color: 'var(--primary-light)' }} />
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Extra Payment Simulator</h4>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              See what happens if you add a tiny extra contribution each month instead of discretionary spending:
            </p>

            {totalBalance > 0 ? (
              <div>
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                    <span>Extra monthly payment:</span>
                    <strong style={{ color: 'var(--primary-light)' }}>+{formatMoney(extraPayment)}/mo</strong>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="3000"
                    step="100"
                    value={extraPayment}
                    onChange={(e) => setExtraPayment(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--primary)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    <span>+₹100</span>
                    <span>+₹1,500</span>
                    <span>+₹3,000</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 'var(--radius-md)', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.78rem', color: '#34d399', textTransform: 'uppercase', fontWeight: 700 }}>
                    Time Saved To Debt Free
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', margin: '4px 0' }}>
                    {monthsSaved} Months Faster
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    You will be completely debt-free in ~{monthsAccelerated} months instead of ~{monthsCurrent} months!
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                You have zero debt right now! You can divert that extra money into your savings goals.
              </div>
            )}
          </div>

          {/* Supportive Rules of Thumb */}
          <div className="glass-card">
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '12px' }}>
              Student Debt Best Practices
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--primary-light)' }}>•</span>
                <span><strong>Avoid borrowing to invest:</strong> Stock returns are never guaranteed, but debt interest is 100% guaranteed.</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--primary-light)' }}>•</span>
                <span><strong>Prioritize high-cost balances:</strong> Credit cards (18–36% APR) should always be cleared before low-interest education loans.</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--primary-light)' }}>•</span>
                <span><strong>Keep a small emergency buffer:</strong> Having ₹5,000 in savings prevents swiping a card when unexpected expenses pop up.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add Debt Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Add Debt / Liability</h3>
            <form onSubmit={handleAddDebt}>
              <div className="form-group">
                <label className="form-label">Liability Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Phone EMI, Credit Card balance, Borrowed from friend"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Liability Type</label>
                <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="Credit Card">Credit Card</option>
                  <option value="EMI">Consumer EMI (Gadget, phone, etc.)</option>
                  <option value="Education Loan">Education / Student Loan</option>
                  <option value="BNPL">Buy Now Pay Later (BNPL)</option>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Peer Debt">Borrowed from Friend/Family</option>
                </select>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Outstanding Balance (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 5000"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Monthly Payment / EMI (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 500"
                    value={monthlyPayment}
                    onChange={(e) => setMonthlyPayment(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Annual Interest Rate (%)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 18"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                />
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  If unsure, credit cards usually charge ~24-36%, EMIs ~14-18%, education loans ~8-11%.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Liability</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
