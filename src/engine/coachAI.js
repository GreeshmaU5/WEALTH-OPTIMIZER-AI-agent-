/**
 * AI Wealth Coach Knowledge & Reasoning Engine
 * Supports real-time situational queries from students.
 * Integrates:
 * 1. Live Gemini AI integration (when API key is provided)
 * 2. Advanced Situational Natural Language & Math Solver
 * 3. Core Financial Wellness Knowledge Base
 * 4. Safety Guardrails (No stock picking, no shaming, no false tax certainty)
 */

import { formatCurrency } from './calculations.js';
import { analyzeSituationalQuery } from './situationalAI.js';
import { queryGeminiLive } from './geminiLive.js';

export async function getCoachResponseAsync(query, userContext = {}) {
  // If user provided a Gemini API Key in settings, attempt real-time Gemini Flash call first
  if (userContext.geminiApiKey) {
    const liveResponse = await queryGeminiLive({
      apiKey: userContext.geminiApiKey,
      query,
      userContext
    });
    if (liveResponse) return liveResponse;
  }

  // Otherwise, use our built-in real-time situational engine
  return getCoachResponse(query, userContext);
}

export function getCoachResponse(query, userContext = {}) {
  const q = (query || '').toLowerCase().trim();
  const {
    income = 12000,
    expenses = 8000,
    availableCash = 4000,
    savings = 20000,
    totalDebt = 5000,
    debts = [],
    goals = [],
    investments = [],
    unrealizedChange = -1000,
    isLoss = true,
    marketCondition = 'stable'
  } = userContext;

  const topGoal = goals[0] || { name: 'your savings goal', targetAmount: 50000, currentAmount: 20000, monthsRemaining: 10 };
  const goalRemaining = Math.max(0, (topGoal.targetAmount || 50000) - (topGoal.currentAmount || 0));
  const goalMonthlyReq = Math.ceil(goalRemaining / Math.max(1, topGoal.monthsRemaining || 10));

  // 1. Guardrail against speculative stock picking / day trading / hot tips
  if (
    q.includes('which stock') || q.includes('what stock to buy') || q.includes('crypto tip') ||
    q.includes('multibagger') || q.includes('day trade') || q.includes('penny stock') ||
    q.includes('future and options') || q.includes('f&o')
  ) {
    return {
      title: 'Wealth Optimizer Safety Guardrail',
      whatHappened: 'You asked for specific stock picks, trading recommendations, or speculative trading tips.',
      whyItMatters: 'Wealth Optimizer is an educational wellness companion, NOT a speculative brokerage or licensed SEBI financial advisor. Over 90% of active retail traders and students lose money in speculative derivatives and penny stocks.',
      whatYouCanDo: [
        'Focus on building solid financial foundations first: reliable cash flow buffers, zero bad debt, and emergency savings.',
        'When you begin investing, explore broad, low-cost index mutual funds (like Nifty 50) rather than gambling on individual penny stocks.',
        'Always research independently and consult a registered advisor before committing real capital.'
      ]
    };
  }

  // 2. "Should I save or invest?" (exact match)
  if ((q.includes('save or invest') || q.includes('invest or save') || q.includes('save vs invest')) && !q.includes('all') && !q.includes('bonus')) {
    const hasHighDebt = totalDebt > 0;
    return {
      title: 'Should you save or invest right now?',
      whatHappened: `You have ${formatCurrency(availableCash)} available each month, with ${formatCurrency(savings)} in savings and ${formatCurrency(totalDebt)} in total debt liabilities.`,
      whyItMatters: 'Investments fluctuate up and down. If you invest money before having emergency savings or while carrying high-interest debt, an unexpected bill might force you to sell your investments at a loss or borrow at high interest.',
      whatYouCanDo: [
        hasHighDebt 
          ? `Priority 1: Pay down your ${formatCurrency(totalDebt)} debt first. Clearing a debt gives you a guaranteed 18-24% "return" in saved interest.`
          : `Maintain at least ₹15,000–₹25,000 in a safe savings account for unexpected college expenses.`,
        `Once your debt is manageable and you have a 2-month emergency cushion, you can start investing a modest ₹500 to ₹1,000/month into broad index mutual funds.`,
        `Keep money you need within 1–2 years in high-yield savings or fixed deposits, not the stock market.`
      ]
    };
  }

  // 3. "What does unrealized loss mean?" (exact match)
  if (q.includes('unrealized loss') || q.includes('unrealized gain') || q.includes('what is unrealized')) {
    return {
      title: 'Understanding Unrealized Gains & Losses',
      whatHappened: isLoss 
        ? `Your investments are currently worth ${formatCurrency(Math.abs(unrealizedChange))} less than what you paid for them.`
        : `Your investments are currently worth ${formatCurrency(unrealizedChange)} more than your purchase cost.`,
      whyItMatters: '"Unrealized" simply means the change is only on paper because you haven\'t sold the asset yet. Market prices bounce around every single day. A loss or profit only becomes "realized" (locked in) when you actually click Sell.',
      whatYouCanDo: [
        'Do not panic if market prices dip temporarily. As long as you don\'t need that cash tomorrow, dips are a normal part of student investing.',
        'Review your original purpose: if you invested for a 3- to 5-year timeline, daily paper movements shouldn\'t dictate your decisions.',
        'Never sell out of fear alone—only sell if the asset fundamentals broke down or you intentionally reached your planned goal.'
      ]
    };
  }

  // 4. "Will I have to pay tax if I sell?" / tax questions
  if (q.includes('tax') || q.includes('sell my investment') || q.includes('pay tax')) {
    return {
      title: 'Understanding Taxes Before You Sell',
      whatHappened: 'Selling an investment that has gained in value generates a capital gain, which tax authorities classify as taxable income.',
      whyItMatters: 'Tax rules depend heavily on holding period. For Indian equities and equity mutual funds: holding under 12 months is Short-Term Capital Gains (STCG @ 20%), while holding over 12 months is Long-Term Capital Gains (LTCG @ 12.5% above the annual exemption limit).',
      whatYouCanDo: [
        'Check how long you have held the asset in your portfolio before selling.',
        'For most college students with total annual income under basic exemption slabs, tax obligations might be minimal or zero, but reporting or filing an ITR is good practice.',
        'Use our Tax Impact Checker tool tab to simulate your exact gain before confirming any sale.'
      ],
      disclaimer: 'Tax rules depend on individual tax slabs and current fiscal legislation. Always consult official IT department portals or a tax professional for significant transactions.'
    };
  }

  // 5. Check if query is a situational student question (mentions amounts, concerts, buying items, gifts, allowance cut, EMI, lending, etc.)
  return analyzeSituationalQuery(query, userContext);
}
