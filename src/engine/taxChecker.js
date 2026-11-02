/**
 * Tax Impact Checker Engine
 * Educational tax awareness for students considering buying/selling assets.
 * Explains capital gains, holding periods, and emphasizes verified rules & professional verification.
 */

import { formatCurrency } from './calculations.js';

export function evaluateTaxImpact({
  assetType = 'equity_shares', // 'equity_shares', 'mutual_funds', 'fixed_deposit', 'crypto', 'other'
  purchasePrice = 0,
  sellingPrice = 0,
  holdingMonths = 14,
  currency = 'INR'
}) {
  const buy = Math.max(0, Number(purchasePrice) || 0);
  const sell = Math.max(0, Number(sellingPrice) || 0);
  const gain = sell - buy;
  const isGain = gain > 0;
  const isLoss = gain < 0;

  // Indian tax rules educational classification
  // Equity: > 12 months is LTCG (Long-Term Capital Gain), <= 12 months is STCG (Short-Term Capital Gain)
  // Debt/FD: Slabs or holding-specific
  // Crypto: flat 30% without loss setoff (VDA rules)
  let termType = 'neutral';
  let taxRateGuidance = '';
  let studentSummary = '';
  let riskNote = '';

  if (assetType === 'equity_shares' || assetType === 'mutual_funds') {
    if (holdingMonths >= 12) {
      termType = 'Long-Term Capital Gain (LTCG)';
      taxRateGuidance = 'Equity held over 12 months in India is taxed under LTCG (currently 12.5% on gains exceeding the standard annual exemption threshold of ₹1.25 Lakh under recent budget revisions).';
      studentSummary = `Because you held this for ${holdingMonths} months (≥ 12 months), it is treated as Long-Term. For most students with modest gains, no tax may be payable if total gains stay under the annual exemption limit!`;
    } else {
      termType = 'Short-Term Capital Gain (STCG)';
      taxRateGuidance = 'Equity held under 12 months is taxed under STCG (currently 20% on short-term equity gains).';
      studentSummary = `Because you held this for ${holdingMonths} months (< 12 months), profits are classified as Short-Term. A 20% tax applies on the gain if your total income exceeds the basic tax-exempt slab.`;
    }
  } else if (assetType === 'fixed_deposit') {
    termType = 'Interest Income (Income from Other Sources)';
    taxRateGuidance = 'FD returns are taxed as normal interest income according to your regular personal income tax slab rate. Banks deduct TDS (10%) if interest exceeds ₹40,000/year.';
    studentSummary = 'If your total annual student income is below ₹3,00,000 - ₹7,00,000 (standard rebate slabs), you will generally owe zero net income tax and can claim any deducted TDS back by filing an ITR.';
  } else if (assetType === 'crypto') {
    termType = 'Virtual Digital Asset (VDA)';
    taxRateGuidance = 'Flat 30% tax applies on profits from VDAs/crypto, plus 1% TDS on transactions. Losses cannot be offset against other gains.';
    studentSummary = 'Crypto is subject to very strict high-rate taxation in India regardless of how long you hold it or your student income slab.';
    riskNote = 'High regulatory scrutiny and rigid tax liability without loss offset.';
  } else {
    termType = holdingMonths >= 36 ? 'Long-Term Asset' : 'Short-Term Asset';
    taxRateGuidance = 'Tax rate depends on specific asset classification and holding period.';
    studentSummary = 'Taxes will depend on whether this is movable property, gold, or other asset classes.';
  }

  const disclaimer = 'Tax treatment can depend on the asset, holding period, changes in national budget rules, and your individual annual income. Consider checking latest official tax guidance or speaking with a qualified tax professional for important decisions.';

  return {
    buy,
    sell,
    gain,
    gainFormatted: formatCurrency(Math.abs(gain), currency),
    isGain,
    isLoss,
    termType,
    taxRateGuidance,
    studentSummary,
    riskNote,
    disclaimer,
    hasTaxAlert: isGain && sell > 0
  };
}
