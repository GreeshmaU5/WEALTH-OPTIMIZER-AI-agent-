/**
 * Financial Calculation Engine for Wealth Optimizer
 * All formulas are transparent, student-friendly, and avoid deceptive complexity.
 */

// Formats number into readable currency (Default: INR ₹ with Indian numbering system)
export function formatCurrency(amount, currency = 'INR') {
  const num = Number(amount) || 0;
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(num);
}

// Monthly Cash Flow
export function calculateCashFlow(income = 0, expenses = 0) {
  const inc = Math.max(0, Number(income) || 0);
  const exp = Math.max(0, Number(expenses) || 0);
  const available = inc - exp;
  const savingsRate = inc > 0 ? (available / inc) * 100 : 0;

  return {
    income: inc,
    expenses: exp,
    available: available,
    savingsRate: Math.round(savingsRate),
    isDeficit: available < 0,
    status: available > inc * 0.2 ? 'healthy' : available >= 0 ? 'tight' : 'deficit'
  };
}

// Calculate remaining months between today and target date
export function getMonthsRemaining(targetDateStr) {
  if (!targetDateStr) return 6; // default fallback
  const now = new Date();
  const target = new Date(targetDateStr);
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const months = Math.ceil(diffDays / 30.4);
  return Math.max(1, months);
}

// Goal Metrics & Feasibility
export function calculateGoalMetrics(goal, availableMonthly = 0) {
  const target = Math.max(0, Number(goal.targetAmount) || 0);
  const current = Math.max(0, Number(goal.currentAmount) || 0);
  const remaining = Math.max(0, target - current);
  const months = goal.monthsRemaining || getMonthsRemaining(goal.targetDate);
  const requiredMonthly = months > 0 ? Math.ceil(remaining / months) : remaining;
  const progressPct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  
  const isFeasible = requiredMonthly <= availableMonthly;
  const deficitMonthly = requiredMonthly - availableMonthly;

  let insight = '';
  if (remaining === 0) {
    insight = '🎉 Goal reached! Amazing discipline.';
  } else if (isFeasible) {
    insight = `You need ${formatCurrency(requiredMonthly)}/month for ${months} months. Fits comfortably within your ${formatCurrency(availableMonthly)} available cash!`;
  } else {
    insight = `Goal requires about ${formatCurrency(requiredMonthly)}/month, but you currently have around ${formatCurrency(availableMonthly)} available each month. You could extend the deadline by ${Math.ceil(remaining / Math.max(1, availableMonthly)) - months} months or save more gradually.`;
  }

  return {
    ...goal,
    target,
    current,
    remaining,
    monthsRemaining: months,
    requiredMonthly,
    progressPct,
    isFeasible,
    deficitMonthly,
    insight
  };
}

// Debt Metrics & Non-shaming assessment
export function calculateDebtMetrics(debts = [], monthlyIncome = 0) {
  const inc = Math.max(1, Number(monthlyIncome) || 0);
  let totalDebt = 0;
  let totalMonthlyPayment = 0;
  let highestInterestDebt = null;

  debts.forEach((debt) => {
    const bal = Math.max(0, Number(debt.balance) || 0);
    const pmt = Math.max(0, Number(debt.monthlyPayment) || 0);
    const rate = Number(debt.interestRate) || 0;

    totalDebt += bal;
    totalMonthlyPayment += pmt;

    if (!highestInterestDebt || rate > (highestInterestDebt.interestRate || 0)) {
      highestInterestDebt = debt;
    }
  });

  const dti = (totalMonthlyPayment / inc) * 100;

  let status = 'good'; // 🟢 Good
  let statusText = 'Manageable';
  let guidance = 'No burdensome debt detected. Keep building your savings!';

  if (totalDebt > 0) {
    if (dti > 40 || totalMonthlyPayment > inc * 0.4) {
      status = 'priority'; // 🔴 High priority
      statusText = 'High Priority';
      guidance = 'Debt payments take a significant share of your monthly money. Focus on preventing new balances and paying high-cost balances steadily.';
    } else if (dti > 15 || totalDebt > 5000) {
      status = 'attention'; // 🟡 Needs attention
      statusText = 'Needs Attention';
      guidance = 'Paying a small minimum amount each month can make repayment take longer, especially if interest applies. Consider chipping in a little extra when possible.';
    } else {
      status = 'good';
      statusText = 'On Track';
      guidance = 'Your current repayments are well within your monthly budget.';
    }
  }

  return {
    totalDebt,
    totalMonthlyPayment,
    dti: Math.round(dti),
    status,
    statusText,
    guidance,
    highestInterestDebt
  };
}

// Investment Metrics & Unrealized Gain/Loss Engine
export function calculateInvestmentMetrics(investments = []) {
  let totalCost = 0;
  let currentValue = 0;

  investments.forEach((inv) => {
    totalCost += Math.max(0, Number(inv.costBasis) || 0);
    currentValue += Math.max(0, Number(inv.currentValue) || 0);
  });

  const unrealizedChange = currentValue - totalCost;
  const unrealizedPct = totalCost > 0 ? ((unrealizedChange / totalCost) * 100).toFixed(1) : 0;
  const isLoss = unrealizedChange < 0;
  const isGain = unrealizedChange > 0;

  let studentExplanation = '';
  if (totalCost === 0) {
    studentExplanation = 'You have not added any investments yet. When you are ready and debt-free, investing can help your money grow over time.';
  } else if (isLoss) {
    studentExplanation = `Your investments are currently worth ${formatCurrency(Math.abs(unrealizedChange))} less than what you paid. Because you still hold them, this is called an "unrealized loss"—it is not locked in unless you sell. Avoid panic selling based on temporary dips.`;
  } else if (isGain) {
    studentExplanation = `Your investments have grown by ${formatCurrency(unrealizedChange)} (${unrealizedPct}%). This is an "unrealized gain" because the profit stays in the asset until you choose to sell.`;
  } else {
    studentExplanation = 'Your investments are currently worth the exact amount you paid for them.';
  }

  return {
    totalCost,
    currentValue,
    unrealizedChange,
    unrealizedPct: Number(unrealizedPct),
    isLoss,
    isGain,
    studentExplanation
  };
}

// Student Financial Health Indicator (Plain English Diagnostic)
export function calculateFinancialHealth({
  monthlyIncome = 0,
  monthlyExpenses = 0,
  savings = 0,
  totalDebt = 0,
  totalMonthlyDebt = 0,
  goals = []
}) {
  const available = monthlyIncome - monthlyExpenses;
  const monthlyBurn = Math.max(1, monthlyExpenses);
  const emergencyMonths = (savings / monthlyBurn).toFixed(1);

  // Score factors
  let issues = [];
  let strengths = [];

  if (available < 0) {
    issues.push('Monthly spending exceeds monthly income (cash deficit).');
  } else if (available > 0) {
    strengths.push(`You have ${formatCurrency(available)} left over each month.`);
  }

  if (emergencyMonths < 1) {
    issues.push('Savings buffer is less than 1 month of living expenses.');
  } else if (emergencyMonths >= 3) {
    strengths.push(`Healthy emergency cushion (${emergencyMonths} months of living costs).`);
  }

  if (totalDebt > 0 && totalMonthlyDebt > monthlyIncome * 0.35) {
    issues.push('Debt obligations consume over 35% of monthly income.');
  }

  let status = 'good'; // 🟢
  let title = 'Good Financial Health';
  let summary = 'You are in a solid position with positive cash flow and healthy habits.';

  if (available < 0 || (totalDebt > 0 && totalMonthlyDebt > monthlyIncome * 0.4)) {
    status = 'priority'; // 🔴
    title = 'High Priority Items';
    summary = 'Your cash flow or debt payments need immediate balancing to avoid financial stress.';
  } else if (emergencyMonths < 1.5 || totalDebt > 0 || issues.length > 0) {
    status = 'attention'; // 🟡
    title = 'Needs Attention';
    summary = 'Your foundation is decent, but boosting emergency savings and trimming liabilities will make you much safer.';
  }

  return {
    status,
    title,
    summary,
    emergencyMonths: Number(emergencyMonths),
    strengths,
    issues
  };
}
