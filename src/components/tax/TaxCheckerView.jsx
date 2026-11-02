import React, { useState, useMemo } from 'react';
import { useWealth } from '../../context/WealthContext';
import { evaluateTaxImpact } from '../../engine/taxChecker';
import { ReceiptText, AlertTriangle, HelpCircle, ShieldCheck, ArrowRight, Info } from 'lucide-react';

export function TaxCheckerView() {
  const { currency, formatMoney } = useWealth();

  const [assetType, setAssetType] = useState('equity_shares');
  const [purchasePrice, setPurchasePrice] = useState('10000');
  const [sellingPrice, setSellingPrice] = useState('15000');
  const [holdingMonths, setHoldingMonths] = useState(14);

  const evaluation = useMemo(() => {
    return evaluateTaxImpact({
      assetType,
      purchasePrice: Number(purchasePrice) || 0,
      sellingPrice: Number(sellingPrice) || 0,
      holdingMonths: Number(holdingMonths) || 1,
      currency
    });
  }, [assetType, purchasePrice, sellingPrice, holdingMonths, currency]);

  const handleApplyPreset = (type, buy, sell, months) => {
    setAssetType(type);
    setPurchasePrice(buy.toString());
    setSellingPrice(sell.toString());
    setHoldingMonths(months);
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
        <span style={{ fontSize: '0.78rem', color: 'var(--amber-light)', fontWeight: 700, textTransform: 'uppercase' }}>
          Feature 5: Pre-Sale Tax Impact Checker
        </span>
        <h2 style={{ fontSize: '1.45rem', marginTop: '4px' }}>
          Check Tax Implications Before You Sell
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '680px', marginTop: '4px' }}>
          Selling an asset may trigger taxes depending on how long you held it, your personal income, and current government rules. Simulate below to avoid surprise tax bills!
        </p>
      </div>

      {/* Preset Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Try Common Scenarios:</span>
        <button
          className="prompt-chip"
          onClick={() => handleApplyPreset('equity_shares', 10000, 15000, 14)}
        >
          📈 Equity Sale (&gt;12 mo LTCG)
        </button>
        <button
          className="prompt-chip"
          onClick={() => handleApplyPreset('equity_shares', 10000, 13000, 6)}
        >
          ⚡ Short-term Equity (&lt;12 mo STCG)
        </button>
        <button
          className="prompt-chip"
          onClick={() => handleApplyPreset('fixed_deposit', 20000, 21400, 12)}
        >
          🏦 Fixed Deposit Interest
        </button>
        <button
          className="prompt-chip"
          onClick={() => handleApplyPreset('equity_shares', 12000, 10000, 8)}
        >
          📉 Selling at a Loss
        </button>
      </div>

      {/* Calculator Grid */}
      <div className="grid-dashboard-main">
        {/* Left: Input Form */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '18px' }}>
            Asset & Sale Parameters
          </h3>

          <div className="form-group">
            <label className="form-label">Asset Classification</label>
            <select
              className="form-select"
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
            >
              <option value="equity_shares">Equity Shares / Index ETFs</option>
              <option value="mutual_funds">Equity Mutual Funds</option>
              <option value="fixed_deposit">Fixed Deposit / Recurring Deposit</option>
              <option value="crypto">Virtual Digital Asset / Crypto</option>
              <option value="other">Other Asset (Gold, Real Property, etc.)</option>
            </select>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">What You Paid / Cost (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 10000"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Planned Selling Price (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 15000"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="form-label" style={{ margin: 0 }}>Holding Period</label>
              <strong style={{ fontSize: '0.9rem', color: 'var(--primary-light)' }}>{holdingMonths} Months</strong>
            </div>
            <input
              type="range"
              min="1"
              max="48"
              value={holdingMonths}
              onChange={(e) => setHoldingMonths(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>1 Month</span>
              <span>12 Months (LTCG Threshold)</span>
              <span>36+ Months</span>
            </div>
          </div>
        </div>

        {/* Right: Simulation Output & Advice */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Status Alert Banner */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              background: evaluation.isGain ? 'var(--amber-subtle)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${evaluation.isGain ? 'rgba(245,158,11,0.3)' : 'var(--border-glass)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            {evaluation.isGain ? (
              <AlertTriangle size={20} style={{ color: '#fbbf24', flexShrink: 0 }} />
            ) : (
              <Info size={20} style={{ color: 'var(--cyan-light)', flexShrink: 0 }} />
            )}
            <div>
              <strong style={{ fontSize: '0.95rem', color: evaluation.isGain ? '#fef3c7' : '#ffffff' }}>
                {evaluation.isGain ? '⚠️ A sale may have tax implications.' : evaluation.isLoss ? 'No Tax on Capital Losses' : 'Neutral Price Point'}
              </strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {evaluation.termType}
              </p>
            </div>
          </div>

          {/* Key Numbers */}
          <div className="grid-2" style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Potential Profit/Loss</span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: evaluation.isGain ? '#34d399' : evaluation.isLoss ? '#fb7185' : '#ffffff', marginTop: '2px' }}>
                {evaluation.isGain ? '+' : evaluation.isLoss ? '-' : ''}{evaluation.gainFormatted}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Holding Classification</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '4px' }}>
                {holdingMonths >= 12 ? 'Long-Term (≥12m)' : 'Short-Term (<12m)'}
              </div>
            </div>
          </div>

          {/* Student Explanation */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-light)', marginBottom: '4px' }}>
              Tax Rule Explanation
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {evaluation.taxRateGuidance}
            </p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
              {evaluation.studentSummary}
            </p>
          </div>

          {/* Safety Disclaimer */}
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.45, borderTop: '1px solid var(--border-glass)', paddingTop: '12px' }}>
            ⚖️ <strong>Safety Disclaimer:</strong> {evaluation.disclaimer}
          </div>
        </div>
      </div>
    </div>
  );
}
