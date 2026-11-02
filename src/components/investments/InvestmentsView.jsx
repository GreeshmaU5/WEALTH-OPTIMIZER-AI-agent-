import React, { useState } from 'react';
import { useWealth } from '../../context/WealthContext';
import { TrendingUp, TrendingDown, ShieldAlert, Sparkles, Plus, Trash2, HelpCircle, Activity } from 'lucide-react';

export function InvestmentsView() {
  const {
    state,
    investmentsMetrics,
    formatMoney,
    setMarketCondition,
    addInvestment,
    removeInvestment,
    updateInvestment,
    setActiveTab
  } = useWealth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('equity_shares');
  const [costBasis, setCostBasis] = useState('');
  const [currentValue, setCurrentValue] = useState('');

  // Interactive Market Environment status
  const currentEnv = state.marketCondition || 'uncertain';

  const envExplanations = {
    stable: {
      status: '🟢 Relatively Stable',
      color: '#34d399',
      bg: 'var(--emerald-subtle)',
      border: 'rgba(16,185,129,0.3)',
      text: 'Economic conditions and company earnings are steady. Student investments in broad mutual funds are progressing with normal steady fluctuations.'
    },
    uncertain: {
      status: '🟡 Uncertain & Mixed',
      color: '#fbbf24',
      bg: 'var(--amber-subtle)',
      border: 'rgba(245,158,11,0.3)',
      text: 'Markets have been moving up and down recently due to interest rates or inflation headlines. If you don\'t need your investment money soon, avoid making a rushed decision based only on today\'s movements.'
    },
    volatile: {
      status: '🔴 High Volatility',
      color: '#fb7185',
      bg: 'var(--rose-subtle)',
      border: 'rgba(244,63,94,0.3)',
      text: 'Stock swings are sharper than usual. Remember: volatility is the price of long-term growth. Trying to day-trade or panic sell locks in paper losses. Stay calm and focus on your studies.'
    }
  };

  const handleAddInvestment = (e) => {
    e.preventDefault();
    const cost = Number(costBasis);
    const curr = Number(currentValue);
    if (!name || isNaN(cost) || cost <= 0 || isNaN(curr) || curr < 0) return;

    addInvestment({
      name,
      type,
      costBasis: cost,
      currentValue: curr,
      holdingMonths: 6
    });

    setName('');
    setCostBasis('');
    setCurrentValue('');
    setShowAddModal(false);
  };

  // Interactive market simulation (e.g. market drops 10% or rebounds 15%)
  const handleSimulateShift = (pct) => {
    state.investments.forEach((inv) => {
      const newCurr = Math.round(Number(inv.currentValue) * (1 + pct / 100));
      updateInvestment(inv.id, { currentValue: Math.max(0, newCurr) });
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 67, 0.85) 0%, rgba(18, 26, 43, 0.85) 100%)',
          padding: '24px 28px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--cyan-light)', fontWeight: 700, textTransform: 'uppercase' }}>
              Feature 4: Unrealized Gains & Losses • Feature 3: Market Risk Monitor
            </span>
            <h2 style={{ fontSize: '1.45rem', marginTop: '4px' }}>
              Understanding Your Investments
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '680px', marginTop: '4px' }}>
              We demystify market jargon. Discover the difference between paper changes and real money, and build emotional resilience against market swings.
            </p>
          </div>

          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            <span>Add Investment</span>
          </button>
        </div>
      </div>

      {/* Feature 4: Section 10 Unrealized vs Realized Breakdown Card */}
      <div className="glass-card" style={{ border: '1px solid rgba(99,102,241,0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Portfolio Unrealized Gain/Loss Summary</h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              {investmentsMetrics.studentExplanation}
            </p>
          </div>

          {/* Simulate market shifts */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Simulate Market:</span>
            <button
              className="chip-button"
              style={{ color: '#fb7185' }}
              onClick={() => handleSimulateShift(-10)}
              title="Simulate a 10% market dip"
            >
              -10% Dip
            </button>
            <button
              className="chip-button"
              style={{ color: '#34d399' }}
              onClick={() => handleSimulateShift(15)}
              title="Simulate a 15% market recovery"
            >
              +15% Rally
            </button>
          </div>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid-3" style={{ marginBottom: '18px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>1. What You Paid (Cost Basis)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '4px' }}>
              {formatMoney(investmentsMetrics.totalCost)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Original money you invested from savings
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>2. Current Value Today</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '4px' }}>
              {formatMoney(investmentsMetrics.currentValue)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              What it is worth right now in the market
            </div>
          </div>

          <div
            style={{
              background: investmentsMetrics.isLoss ? 'var(--rose-subtle)' : 'var(--emerald-subtle)',
              border: `1px solid ${investmentsMetrics.isLoss ? 'rgba(244,63,94,0.3)' : 'rgba(16,185,129,0.3)'}`,
              padding: '16px',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              3. Unrealized {investmentsMetrics.isLoss ? 'Loss' : 'Gain'}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: investmentsMetrics.isLoss ? '#fb7185' : '#34d399', marginTop: '4px' }}>
              {investmentsMetrics.isLoss ? '-' : '+'}{formatMoney(Math.abs(investmentsMetrics.unrealizedChange))} ({investmentsMetrics.unrealizedPct}%)
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {investmentsMetrics.isLoss ? 'Paper loss. Not locked in unless you sell.' : 'Paper profit. Stays inside until you sell.'}
            </div>
          </div>
        </div>

        {/* Realized vs Unrealized Educational Comparison */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <strong style={{ fontSize: '0.9rem', color: 'var(--primary-light)', display: 'block', marginBottom: '4px' }}>
              What is an "Unrealized" Change?
            </strong>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Because you still hold the units, this is only a quote on paper. Prices fluctuate constantly. You don't actually lose or gain rupees until you execute a sale.
            </p>
          </div>
          <div>
            <strong style={{ fontSize: '0.9rem', color: '#fbbf24', display: 'block', marginBottom: '4px' }}>
              What is a "Realized" Change?
            </strong>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              A change only becomes "realized" once you actually sell your investment. If you sell at a gain, profits become real cash (and may trigger taxes!). If you sell during a dip, you lock in the loss permanently.
            </p>
          </div>
        </div>
      </div>

      {/* Feature 3: Section 9 Market & Economic Risk Monitor */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} style={{ color: 'var(--cyan-light)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Market & Economic Risk Environment</h3>
          </div>

          {/* Toggle market climate */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {['stable', 'uncertain', 'volatile'].map((env) => (
              <button
                key={env}
                className={`chip-button ${currentEnv === env ? 'active' : ''}`}
                style={{ fontSize: '0.78rem' }}
                onClick={() => setMarketCondition(env)}
              >
                {env === 'stable' ? '🟢 Stable' : env === 'uncertain' ? '🟡 Uncertain' : '🔴 Volatile'}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Environment Box */}
        <div
          style={{
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            background: envExplanations[currentEnv].bg,
            border: `1px solid ${envExplanations[currentEnv].border}`,
            marginBottom: '16px'
          }}
        >
          <div style={{ fontSize: '1rem', fontWeight: 800, color: envExplanations[currentEnv].color, marginBottom: '4px' }}>
            {envExplanations[currentEnv].status}
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
            {envExplanations[currentEnv].text}
          </p>
        </div>

        {/* 3 Plain English Macro Concepts */}
        <div className="grid-3">
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <strong style={{ fontSize: '0.85rem', color: 'var(--cyan-light)' }}>🌊 Market Volatility</strong>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
              How much prices swing up and down over short periods. High volatility is normal and doesn't mean your investment is broken.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <strong style={{ fontSize: '0.85rem', color: 'var(--amber-light)' }}>🏷️ Inflation</strong>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
              The rate at which prices of books, food, and rent rise each year (~5-6% in India). Investing helps your money outpace inflation.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <strong style={{ fontSize: '0.85rem', color: 'var(--emerald-light)' }}>🏦 Interest Rates</strong>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
              What central banks set. Higher rates make loans and EMIs costlier, but make savings accounts and fixed deposits earn slightly more.
            </p>
          </div>
        </div>
      </div>

      {/* Holdings List */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Your Portfolio Holdings</h3>
          <button
            className="btn-ghost"
            style={{ fontSize: '0.8rem', color: 'var(--primary-light)' }}
            onClick={() => setActiveTab('tax')}
          >
            Check Tax Impact Before Selling →
          </button>
        </div>

        {state.investments.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No investments recorded. When ready, click "Add Investment" above.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {state.investments.map((inv) => {
              const diff = Number(inv.currentValue) - Number(inv.costBasis);
              const isInvLoss = diff < 0;
              const pct = inv.costBasis > 0 ? ((diff / inv.costBasis) * 100).toFixed(1) : 0;

              return (
                <div
                  key={inv.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-glass)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>{inv.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Cost: {formatMoney(inv.costBasis)} • Held: ~{inv.holdingMonths || 8} months
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{formatMoney(inv.currentValue)}</div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: isInvLoss ? '#fb7185' : '#34d399' }}>
                        {isInvLoss ? '-' : '+'}{formatMoney(Math.abs(diff))} ({pct}%)
                      </div>
                    </div>

                    <button
                      className="btn-ghost"
                      style={{ color: 'var(--rose-light)' }}
                      onClick={() => removeInvestment(inv.id)}
                      title="Remove investment"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Investment Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Add Investment Holding</h3>
            <form onSubmit={handleAddInvestment}>
              <div className="form-group">
                <label className="form-label">Asset / Fund Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Nifty 50 Index Fund, Bluechip ETF, Infosys"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Asset Type</label>
                <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="equity_shares">Equity Shares / Index ETF</option>
                  <option value="mutual_funds">Mutual Fund</option>
                  <option value="fixed_deposit">Fixed Deposit / Recurring Deposit</option>
                  <option value="other">Other Asset</option>
                </select>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Total Cost Basis / Amount Paid (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 15000"
                    value={costBasis}
                    onChange={(e) => setCostBasis(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Current Value Today (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 14000"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Holding</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
