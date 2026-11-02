/**
 * Recommendation Engine for Wealth Optimizer
 * Implements strict 7-tier financial wellness hierarchy:
 * 1. Essential expenses
 * 2. Debt management (high-cost first)
 * 3. Emergency savings buffer
 * 4. Short-term goals
 * 5. Long-term goals
 * 6. Investments
 * 7. Tax awareness
 */

import { formatCurrency } from './calculations.js';

export function generatePersonalizedActionPlan({
  monthlyIncome = 0,
  monthlyExpenses = 0,
  savings = 0,
  debts = [],
  goals = [],
  investments = [],
  marketCondition = 'stable'
}) {
  const availableCash = monthlyIncome - monthlyExpenses;
  const totalDebt = debts.reduce((acc, d) => acc + (Number(d.balance) || 0), 0);
  const emergencyTarget = Math.max(10000, monthlyExpenses * 2); // 2 months minimal buffer for students
  const emergencyShortfall = Math.max(0, emergencyTarget - savings);

  const potentialActions = [];

  // 1. TIER 1: Essential Expenses & Cash Flow
  if (availableCash < 0) {
    potentialActions.push({
      tier: 1,
      category: 'cashflow',
      icon: '⚠️',
      title: 'Balance your monthly cash flow',
      short: 'Pause discretionary spending',
      explanation: `You are spending ${formatCurrency(Math.abs(availableCash))} more than you take in each month. Trimming non-essential costs prevents taking on expensive debt.`,
      suggestedAmount: 0,
      priority: 'Urgent'
    });
  }

  // 2. TIER 2: Debt Management
  if (totalDebt > 0) {
    const highestInterest = debts.reduce((prev, curr) => 
      (Number(curr.interestRate) || 0) > (Number(prev.interestRate) || 0) ? curr : prev, debts[0]);
    
    // Allocate a sensible share of available cash (e.g. 35-50%) toward debt
    const recommendedPayment = availableCash > 0 ? Math.min(totalDebt, Math.max(500, Math.round(availableCash * 0.4))) : 500;

    potentialActions.push({
      tier: 2,
      category: 'debt',
      icon: '💳',
      title: `Reduce ${highestInterest.name || 'outstanding debt'}`,
      short: `Tackle ${highestInterest.name || 'debt balance'}`,
      explanation: `Paying down ${formatCurrency(totalDebt)} saves you guaranteed interest money. Prioritize high-rate balances before putting money in the stock market.`,
      suggestedAmount: recommendedPayment,
      priority: 'High Priority'
    });
  }

  // 3. TIER 3: Emergency Savings Buffer
  if (emergencyShortfall > 0) {
    const suggestedSave = availableCash > 0 ? Math.round(availableCash * (totalDebt > 0 ? 0.35 : 0.5)) : 1000;
    potentialActions.push({
      tier: 3,
      category: 'savings',
      icon: '🏦',
      title: 'Build your safety buffer',
      short: 'Add to emergency savings',
      explanation: `Setting aside ${formatCurrency(suggestedSave)}/month gives you a cushion for medical, gadget repairs, or unexpected college expenses without borrowing.`,
      suggestedAmount: suggestedSave,
      priority: totalDebt > 0 ? 'Medium Priority' : 'High Priority'
    });
  }

  // 4. TIER 4 & 5: Goals (Short-term & Long-term)
  const activeGoals = goals.filter((g) => (Number(g.currentAmount) || 0) < (Number(g.targetAmount) || 0));
  if (activeGoals.length > 0) {
    const topGoal = activeGoals[0];
    const remaining = Number(topGoal.targetAmount) - Number(topGoal.currentAmount);
    const months = Math.max(1, topGoal.monthsRemaining || 10);
    const targetMonthly = Math.ceil(remaining / months);

    // Realistic monthly recommendation based on available cash
    const realisticMonthly = availableCash > 0 
      ? Math.min(targetMonthly, Math.max(500, Math.round(availableCash * 0.35))) 
      : 1000;

    potentialActions.push({
      tier: 4,
      category: 'goals',
      icon: '🎯',
      title: `Save for ${topGoal.name}`,
      short: `Fund ${topGoal.name}`,
      explanation: `Contribute about ${formatCurrency(realisticMonthly)}/month toward your ${formatCurrency(topGoal.targetAmount)} goal. Steady contributions beat sporadic bursts.`,
      suggestedAmount: realisticMonthly,
      priority: 'Medium'
    });
  }

  // 5. TIER 6: Investments
  const totalInvested = investments.reduce((acc, i) => acc + (Number(i.costBasis) || 0), 0);
  if (totalDebt === 0 && emergencyShortfall === 0 && availableCash > 1000) {
    potentialActions.push({
      tier: 6,
      category: 'investments',
      icon: '📈',
      title: 'Start low-cost index investing',
      short: 'Explore diversified mutual funds',
      explanation: `With zero high-cost debt and a safe emergency buffer, putting a small portion (e.g. ₹500 - ₹1,000) into diversified mutual funds helps fight inflation over college years.`,
      suggestedAmount: Math.min(2000, Math.round(availableCash * 0.25)),
      priority: 'Long Term'
    });
  } else if (investments.length > 0) {
    potentialActions.push({
      tier: 6,
      category: 'investments',
      icon: '🧘',
      title: 'Hold steady through market swings',
      short: 'Avoid emotional trading',
      explanation: 'Check whether your holdings still match your timeline. If you don\'t need the cash soon, avoid panic selling during daily dips.',
      suggestedAmount: 0,
      priority: 'Mindset'
    });
  }

  // 6. TIER 7: Tax & Smarter Planning
  if (investments.length > 0) {
    potentialActions.push({
      tier: 7,
      category: 'tax',
      icon: '📑',
      title: 'Review holding periods before selling',
      short: 'Check tax implications',
      explanation: 'Holding equity investments for over 12 months qualifies for Long-Term Capital Gains (LTCG) with lower tax rates in India. Plan before selling!',
      suggestedAmount: 0,
      priority: 'Awareness'
    });
  }

  // Sort by strict hierarchy and pick top 3
  potentialActions.sort((a, b) => a.tier - b.tier);
  const next3Steps = potentialActions.slice(0, 3);

  return {
    next3Steps,
    allRecommendations: potentialActions
  };
}
