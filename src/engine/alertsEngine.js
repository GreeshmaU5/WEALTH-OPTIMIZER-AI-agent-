/**
 * Intelligent Alert Engine for Wealth Optimizer
 * Generates proactive, friendly, non-scary notifications based on the user's financial state.
 */

import { formatCurrency } from './calculations.js';

export function evaluateSmartAlerts({
  cashFlow,
  debtMetrics,
  investmentsMetrics,
  goals = [],
  marketCondition = 'stable',
  debts = []
}) {
  const alerts = [];

  // 1. Debt Alert
  if (debtMetrics && debtMetrics.totalDebt > 0) {
    if (debtMetrics.status === 'priority') {
      alerts.push({
        id: 'debt-priority',
        type: 'danger',
        icon: '💳',
        title: 'Debt Alert: High payment share',
        message: 'Your monthly debt obligations are taking a heavy portion of your income. Focus on clearing the costliest balance first before committing funds elsewhere.',
        actionView: 'debt'
      });
    } else if (debtMetrics.status === 'attention') {
      alerts.push({
        id: 'debt-attention',
        type: 'warning',
        icon: '💳',
        title: 'Debt Notice: Paying minimums takes longer',
        message: `You have ${formatCurrency(debtMetrics.totalDebt)} in outstanding liabilities. Adding just ₹300-₹500 extra to your monthly payments cuts total repayment time significantly.`,
        actionView: 'debt'
      });
    }
  }

  // 2. Goal Pace Alert
  if (goals && goals.length > 0) {
    goals.forEach((g) => {
      const remaining = Math.max(0, (Number(g.targetAmount) || 0) - (Number(g.currentAmount) || 0));
      const months = Math.max(1, g.monthsRemaining || 10);
      const req = Math.ceil(remaining / months);

      if (remaining > 0 && cashFlow && req > cashFlow.available && cashFlow.available > 0) {
        alerts.push({
          id: `goal-pace-${g.id || g.name}`,
          type: 'warning',
          icon: '🎯',
          title: `Goal Alert: ${g.name} savings pace`,
          message: `Your planned target requires about ${formatCurrency(req)}/month, which is higher than your current ${formatCurrency(cashFlow.available)} available cash. Consider extending your timeline so you don't feel stressed!`,
          actionView: 'goals'
        });
      }
    });
  }

  // 3. Investment Unrealized Loss/Gain Alert
  if (investmentsMetrics && investmentsMetrics.totalCost > 0) {
    if (investmentsMetrics.isLoss) {
      alerts.push({
        id: 'inv-unrealized-loss',
        type: 'info',
        icon: '📉',
        title: 'Investment Alert: Unrealized price change',
        message: `Your investments are down by ${formatCurrency(Math.abs(investmentsMetrics.unrealizedChange))}. Because you still hold your assets, this is an unrealized change. Markets fluctuate regularly—avoid emotional panic selling.`,
        actionView: 'investments'
      });
    } else if (investmentsMetrics.isGain) {
      alerts.push({
        id: 'inv-unrealized-gain',
        type: 'success',
        icon: '📈',
        title: 'Investment Notice: Healthy unrealized gain',
        message: `Your portfolio has an unrealized gain of ${formatCurrency(investmentsMetrics.unrealizedChange)} (+${investmentsMetrics.unrealizedPct}%). Keep in mind taxes and goals before deciding to cash out.`,
        actionView: 'investments'
      });
    }
  }

  // 4. Market Risk Alert
  if (marketCondition === 'volatile') {
    alerts.push({
      id: 'market-volatility',
      type: 'warning',
      icon: '🌊',
      title: 'Market Alert: High short-term volatility',
      message: 'Financial markets are swinging widely right now. If your money is invested for long-term college/life goals, stick to your plan and avoid reactionary trading.',
      actionView: 'investments'
    });
  }

  // 5. Cash Flow Deficit Alert
  if (cashFlow && cashFlow.available < 0) {
    alerts.push({
      id: 'cashflow-deficit',
      type: 'danger',
      icon: '⚠️',
      title: 'Cash Flow Alert: Monthly expenses exceed income',
      message: `You are spending ${formatCurrency(Math.abs(cashFlow.available))} more than your monthly intake. Review recurring subscriptions or leisure spends to avoid running into debt.`,
      actionView: 'money'
    });
  }

  return alerts;
}
