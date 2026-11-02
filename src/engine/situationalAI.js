/**
 * Situational Reasoning & Natural Language Engine for Student Wealth Optimizer
 * Parses custom student situational questions, extracts numerical figures & context,
 * and performs live financial calculations against the student's exact financial profile.
 */

import { formatCurrency } from './calculations.js';

// Helper to extract numbers, currency values, and unit scales (e.g., ₹30000, 30k, 2.5k, 5000 rs)
export function extractAmounts(query = '') {
  const q = query.toLowerCase().replace(/,/g, '');
  const amounts = [];

  // Match ₹30000, Rs 30000, 30000 rs, 30000 inr
  const rupeePattern = /(?:₹|rs\.?|inr)\s*(\d+(?:\.\d+)?)/gi;
  let match;
  while ((match = rupeePattern.exec(q)) !== null) {
    amounts.push(parseFloat(match[1]));
  }

  // Match 30k, 2.5k, 5k, 50k
  const kPattern = /(\d+(?:\.\d+)?)\s*k\b/gi;
  while ((match = kPattern.exec(q)) !== null) {
    amounts.push(parseFloat(match[1]) * 1000);
  }

  // Match raw standalone numbers between 50 and 10000000 (excluding timeframe matches like '7' in 7months)
  const cleaned = q.replace(/(\d+)\s*(?:month|months|mo|year|years|yr|week|weeks|wk|days?)\b/gi, ' ');
  const rawNumPattern = /\b(\d{2,8})\b/g;
  while ((match = rawNumPattern.exec(cleaned)) !== null) {
    const val = parseFloat(match[1]);
    if (!amounts.includes(val)) {
      amounts.push(val);
    }
  }

  return amounts;
}

// Helper to extract months / timeframe (handles '7months', '7 months', '1 year', etc.)
export function extractTimeframe(query = '') {
  const q = query.toLowerCase();
  
  // Handles '7months', '7 months', '7mo', '7 mo'
  const monthMatch = q.match(/(\d+)\s*(?:month|months|moths|mo)\b/);
  if (monthMatch) return parseInt(monthMatch[1], 10);

  const weekMatch = q.match(/(\d+)\s*(?:week|weeks|wk)\b/);
  if (weekMatch) return Math.max(1, Math.ceil(parseInt(weekMatch[1], 10) / 4));

  const yearMatch = q.match(/(\d+)\s*(?:year|years|yr)\b/);
  if (yearMatch) return parseInt(yearMatch[1], 10) * 12;

  if (q.includes('next week') || q.includes('this week')) return 0.25;
  if (q.includes('next month') || q.includes('this month')) return 1;
  if (q.includes('semester')) return 5;

  return null;
}

// Core Situational Classifier & Math Solver
export function analyzeSituationalQuery(query, userContext = {}) {
  // Normalize string and common typos (e.g., investemnts -> investments)
  let q = (query || '').toLowerCase().trim();
  q = q.replace(/investemnts?/g, 'investments')
       .replace(/investmnts?/g, 'investments')
       .replace(/moths?\b/g, 'months')
       .replace(/mounths?\b/g, 'months')
       .replace(/recieved/g, 'received')
       .replace(/alowance/g, 'allowance');

  const amounts = extractAmounts(q);
  const primaryAmount = amounts.length > 0 ? amounts[0] : null;
  const timeframe = extractTimeframe(q);

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
    marketCondition = 'stable'
  } = userContext;

  const topGoal = goals[0] || { name: 'your goal', targetAmount: 50000, currentAmount: 20000, monthsRemaining: 10 };
  const goalRemaining = Math.max(0, (topGoal.targetAmount || 50000) - (topGoal.currentAmount || 0));
  const goalMonthlyReq = Math.ceil(goalRemaining / Math.max(1, topGoal.monthsRemaining || 10));

  // =========================================================================
  // SITUATION 1: TARGET ACCUMULATION & INVESTMENT HORIZON SOLVER
  // (e.g. "I need 30000 by the end of 7 months, what investments can I do?")
  // =========================================================================
  const isTargetQuery = 
    (q.includes('need') || q.includes('want') || q.includes('target') || q.includes('save') || q.includes('reach') || q.includes('get') || q.includes('accumulate')) &&
    (primaryAmount || timeframe);

  const isInvestmentInquiry = 
    q.includes('invest') || q.includes('mutual fund') || q.includes('stocks') || q.includes('where to put') || q.includes('which fund');

  if ((isTargetQuery && (isInvestmentInquiry || timeframe)) || (isInvestmentInquiry && timeframe)) {
    const targetAmt = primaryAmount || goalRemaining || 30000;
    const months = timeframe || 7;
    const requiredMonthly = Math.ceil(targetAmt / months);
    const monthlyGap = requiredMonthly - availableCash;
    const isShortTerm = months <= 12; // < 1 year

    let instrumentGuidance = '';
    let whyHorizonMatters = '';
    let recommendationSteps = [];

    if (isShortTerm) {
      instrumentGuidance = `For a ${months}-month timeframe, stock markets or equity mutual funds are HIGH RISK and unsuitable. Short-term volatility can drop stock values by 10%–20% right when you need to withdraw. Safe capital-preservation tools like Recurring Deposits (RD) or Liquid Funds are the only reliable choice.`;
      
      whyHorizonMatters = `Because your deadline is only ${months} months away, you cannot afford to risk market drawdowns. In the stock market, 7 months is pure speculation. An RD guarantees that 100% of your money is protected and earns ~6.5%–7.25% fixed interest.`;

      recommendationSteps = [
        `Step 1 (Safe Investment Choice): Open a ${months}-month Bank Recurring Deposit (RD) or Liquid Mutual Fund. This guarantees you will not lose a single rupee of principal.`,
        monthlyGap > 0
          ? `Step 2 (Cover the ${formatCurrency(monthlyGap)} gap): You need ${formatCurrency(requiredMonthly)}/month, and currently have ${formatCurrency(availableCash)} available. Cutting just one weekend outing or non-essential food spend per month bridges this gap completely.`
          : `Step 2 (Budget check): Your required ${formatCurrency(requiredMonthly)}/month fits comfortably inside your ${formatCurrency(availableCash)} monthly surplus!`,
        `Step 3 (Automate savings): Set up an auto-debit of ${formatCurrency(requiredMonthly)} on the day you receive your monthly money so you hit your exact ${formatCurrency(targetAmt)} target in month ${months}.`
      ];
    } else {
      instrumentGuidance = `For a ${months}-month (${(months / 12).toFixed(1)} years) horizon, you can divide your savings: a conservative hybrid fund or low-cost Nifty 50 index mutual fund for growth, combined with safe fixed deposits.`;
      
      whyHorizonMatters = `With a longer horizon of ${months} months, compounding and market recovery cycles work in your favor, smoothing out short-term fluctuations.`;

      recommendationSteps = [
        `Step 1: Invest ${formatCurrency(requiredMonthly)}/month via Systematic Investment Plan (SIP) in low-cost index funds.`,
        `Step 2: Maintain your existing ${formatCurrency(savings)} emergency buffer untouched.`,
        `Step 3: Review progress every 6 months without panic-selling during temporary dips.`
      ];
    }

    return {
      title: `Reaching ${formatCurrency(targetAmt)} in ${months} Months: Investment & Savings Plan`,
      whatHappened: `To reach ${formatCurrency(targetAmt)} in ${months} months, you need to set aside exactly ${formatCurrency(requiredMonthly)} every month (${formatCurrency(targetAmt)} ÷ ${months}). Your current monthly available surplus is ${formatCurrency(availableCash)} (Income ${formatCurrency(income)} - Expenses ${formatCurrency(expenses)}).`,
      whyItMatters: whyHorizonMatters,
      whatYouCanDo: recommendationSteps,
      disclaimer: 'Equity investments carry market risk and should only be used for 3+ year horizons. For goals under 12 months, always prioritize guaranteed capital-preservation tools like Bank RDs or Liquid Funds.'
    };
  }

  // =========================================================================
  // SITUATION 2: GENERAL "WHAT INVESTMENTS CAN I DO?" (Without specific target)
  // =========================================================================
  if (
    q.includes('what investments can i do') || q.includes('where should i invest') ||
    q.includes('how should i invest') || q.includes('how to start investing') ||
    q.includes('what investment options')
  ) {
    const hasDebt = totalDebt > 0;
    return {
      title: 'Student Investment Roadmap for Your Finances',
      whatHappened: `You have ${formatCurrency(availableCash)} in monthly available cash, ${formatCurrency(savings)} in savings, and ${hasDebt ? formatCurrency(totalDebt) + ' in debt liabilities' : 'zero debt'}.`,
      whyItMatters: hasDebt
        ? `Before putting money into the stock market, understand that your ${formatCurrency(totalDebt)} debt likely charges 18%–24% interest. No safe investment in the world consistently pays 24%! Paying off your debt gives you an instant, guaranteed 24% return.`
        : `Investing as a student is about building good habits. You don't need a huge portfolio—even ₹500 to ₹1,000 per month starts the compounding engine.`,
      whatYouCanDo: [
        hasDebt
          ? `Priority 1: Direct your monthly surplus to clear your ${formatCurrency(totalDebt)} debt. That saves you guaranteed interest.`
          : `Priority 1: Ensure you keep your ${formatCurrency(savings)} emergency cushion in high-yield savings.`,
        `Step 2: For money you don't need for 3+ years, start a ₹500–₹1,000 monthly SIP in a low-cost Nifty 50 Index Fund.`,
        `Step 3: For goals needed within 1 year, strictly use Bank Recurring Deposits (RD) or Liquid Funds to avoid market drop risk.`
      ]
    };
  }

  // =========================================================================
  // SITUATION 3: WINDFALL / BONUS / GIFT / SCHOLARSHIP (Extra money received)
  // =========================================================================
  if (
    q.includes('got ₹') || q.includes('received') || q.includes('birthday') ||
    q.includes('gift') || q.includes('bonus') || q.includes('scholarship') ||
    q.includes('windfall') || q.includes('extra cash') || q.includes('won') ||
    q.includes('freelance') || (q.includes('got') && primaryAmount)
  ) {
    const amt = primaryAmount || 5000;
    const canClearAllDebt = totalDebt > 0 && amt >= totalDebt;

    return {
      title: `How to allocate your extra ${formatCurrency(amt)}`,
      whatHappened: `You have received a windfall of ${formatCurrency(amt)}. In your current profile, you carry ${formatCurrency(totalDebt)} in debt liabilities, have ${formatCurrency(savings)} in savings, and need ${formatCurrency(goalRemaining)} for your ${topGoal.name}.`,
      whyItMatters: canClearAllDebt
        ? `You have a golden opportunity: ${formatCurrency(amt)} is enough to eliminate 100% of your outstanding debt today! Clearing this immediately frees up your monthly debt EMI payment and stops high annual interest bleed.`
        : `Windfalls are easy to accidentally spend on routine impulses. Intentionally directing this money toward guaranteed debt savings or your ${topGoal.name} gives you huge psychological momentum.`,
      whatYouCanDo: [
        canClearAllDebt
          ? `Step 1 (Recommended): Pay off your entire ${formatCurrency(totalDebt)} debt liability right now. You will instantly be debt-free!`
          : totalDebt > 0
          ? `Step 1: Put ${formatCurrency(Math.round(amt * 0.6))} directly toward reducing your ${formatCurrency(totalDebt)} debt balance.`
          : `Step 1: Deposit ${formatCurrency(Math.round(amt * 0.5))} toward your emergency savings buffer.`,
        `Step 2: Allocate ${formatCurrency(Math.round(amt * (totalDebt > 0 ? 0.3 : 0.4)))} into your ${topGoal.name} fund, bringing your remaining target down to ${formatCurrency(Math.max(0, goalRemaining - Math.round(amt * 0.4)))}.`,
        `Step 3: Keep ${formatCurrency(Math.round(amt * 0.1))} as guilt-free spending money to celebrate your discipline!`
      ]
    };
  }

  // =========================================================================
  // SITUATION 4: BIG PURCHASE ON EMI / CREDIT (iPhone, phone, laptop on credit)
  // =========================================================================
  if (
    q.includes('emi') || q.includes('bnpl') || q.includes('credit card instalment') ||
    q.includes('buy on emi') || q.includes('iphone') || q.includes('phone on emi')
  ) {
    const cost = primaryAmount || 50000;
    const estimatedEmi = Math.round(cost / 12 * 1.15); // 12-month with ~15% interest/processing
    const isEmiDangerous = estimatedEmi > availableCash * 0.5;

    return {
      title: `Should you buy a ${formatCurrency(cost)} item on EMI?`,
      whatHappened: `A ${formatCurrency(cost)} purchase on a 12-month EMI typically costs around ${formatCurrency(estimatedEmi)}/month (including interest charges). Your current monthly surplus is ${formatCurrency(availableCash)}.`,
      whyItMatters: isEmiDangerous
        ? `This EMI would swallow ${Math.round((estimatedEmi / availableCash) * 100)}% of your available cash every single month for a full year! If your allowance drops or an unexpected college bill arrives, you will face severe payment stress.`
        : `EMIs lock you into mandatory commitments before you have earned the money. For students with fluctuating part-time income, EMIs are the #1 cause of bad credit balances.`,
      whatYouCanDo: [
        'Instead of an EMI, save for it in advance using your Goal Planner tab. Saving ₹3,000/month lets you buy it in cash with 0% interest.',
        `If your phone/device is essential for classes right now, explore refurbished or student-discounted models in the ₹15,000–₹25,000 range.`,
        'Avoid Buy-Now-Pay-Later (BNPL) schemes that hide steep late fees and penalty rates.'
      ]
    };
  }

  // =========================================================================
  // SITUATION 5: UNPLANNED DISCRETIONARY EXPENSE / BUYING TICKETS / SHOPPING
  // =========================================================================
  if (
    q.includes('concert') || q.includes('ticket') || q.includes('festival') ||
    q.includes('party') || q.includes('trip') || q.includes('vacation') ||
    q.includes('shoes') || q.includes('clothes') || q.includes('shopping') ||
    q.includes('guitar') || q.includes('game') || q.includes('console') ||
    q.includes('can i spend') || q.includes('can i afford') || q.includes('buy a') ||
    (q.includes('spend') && primaryAmount)
  ) {
    const cost = primaryAmount || 3500;
    const pctOfSurplus = availableCash > 0 ? Math.round((cost / availableCash) * 100) : 100;
    const surplusAfterCost = availableCash - cost;
    const canAffordWithoutDeficit = surplusAfterCost >= 0;

    return {
      title: `Affordability check for ${formatCurrency(cost)} expense`,
      whatHappened: `You are considering spending ${formatCurrency(cost)}. Your monthly income is ${formatCurrency(income)} and routine expenses are ${formatCurrency(expenses)}, leaving ${formatCurrency(availableCash)} in monthly available surplus.`,
      whyItMatters: `This purchase would consume ${pctOfSurplus}% of your entire monthly surplus. Because your ${topGoal.name} goal already requires ${formatCurrency(goalMonthlyReq)}/month, spending ${formatCurrency(cost)} leaves only ${formatCurrency(Math.max(0, surplusAfterCost))} for goals and emergency savings this month.`,
      whatYouCanDo: [
        canAffordWithoutDeficit
          ? `If you proceed, make a conscious trade-off: reduce discretionary food/outing spends by ${formatCurrency(Math.round(cost * 0.35))} over the next 2 weeks to balance your cash flow.`
          : `Because ${formatCurrency(cost)} exceeds your monthly surplus of ${formatCurrency(availableCash)}, this would push you into a monthly deficit unless covered by savings.`,
        `Understand that this may delay your ${topGoal.name} goal by approximately ${Math.max(1, Math.ceil(cost / Math.max(500, goalMonthlyReq)))} month(s).`,
        `Rule of thumb: Never put discretionary festival or entertainment expenses onto a credit card or EMI!`
      ]
    };
  }

  // =========================================================================
  // SITUATION 6: LENDING OR BORROWING WITH FRIENDS
  // =========================================================================
  if (
    q.includes('friend') || q.includes('lend') || q.includes('borrow') ||
    q.includes('roommate') || q.includes('loan to')
  ) {
    const amt = primaryAmount || 2000;
    return {
      title: `Should you lend ${formatCurrency(amt)} to a friend?`,
      whatHappened: `You are considering lending ${formatCurrency(amt)}. Currently, you have ${formatCurrency(savings)} in savings, but you also owe ${formatCurrency(totalDebt)} in debt liabilities.`,
      whyItMatters: 'In college, peer loans frequently take months to be repaid or strain friendships. More importantly, carrying your own debt while lending money to others means you are paying interest to a bank while lending interest-free.',
      whatYouCanDo: [
        totalDebt > 0
          ? `Priority check: Since you owe ${formatCurrency(totalDebt)} in liabilities, politely explain: "I'm currently on a strict budget paying off my own college liabilities, so I can't lend money right now."`
          : `If you do lend, only lend an amount you can mentally afford to treat as a gift without affecting your monthly meals or study expenses.`,
        `Never dip into your emergency savings buffer to fund someone else's non-emergency expense.`
      ]
    };
  }

  // =========================================================================
  // SITUATION 7: INCOME DROP / ALLOWANCE CUT / LOST GIG
  // =========================================================================
  if (
    q.includes('cut') || q.includes('reduced') || q.includes('less allowance') ||
    q.includes('lost job') || q.includes('lost tutoring') || q.includes('lower income') ||
    q.includes('stipend delayed')
  ) {
    const cutAmt = primaryAmount || 1000;
    const newIncome = Math.max(0, income - cutAmt);
    const newSurplus = newIncome - expenses;

    return {
      title: `Adjusting to a ${formatCurrency(cutAmt)} income reduction`,
      whatHappened: `If your monthly money drops by ${formatCurrency(cutAmt)}, your income becomes ${formatCurrency(newIncome)} against ${formatCurrency(expenses)} in routine expenses, leaving ${formatCurrency(newSurplus)} in surplus.`,
      whyItMatters: newSurplus < 0
        ? `Your current expenses (${formatCurrency(expenses)}) will exceed your new income (${formatCurrency(newIncome)}), creating a deficit of ${formatCurrency(Math.abs(newSurplus))}/month. Action is needed immediately to prevent taking on debt.`
        : `Your monthly available cash decreases from ${formatCurrency(availableCash)} to ${formatCurrency(newSurplus)}. Your ${topGoal.name} savings pace will need to be adjusted.`,
      whatYouCanDo: [
        'Review your monthly expenses in the Money tab: target non-essential outings (₹800) and food delivery first.',
        `Extend your ${topGoal.name} deadline by 2–3 months so you don't feel stressed trying to maintain the same savings rate.`,
        'Explore safe student income options like on-campus library assistance, peer tutoring, or freelance proofreading.'
      ]
    };
  }

  // =========================================================================
  // SITUATION 8: INVESTING ALL SAVINGS / CRYPTO / STOCKS TEMPTATION
  // =========================================================================
  if (
    q.includes('invest all') || q.includes('all savings') || q.includes('crypto') ||
    q.includes('bitcoin') || q.includes('invest my savings') || q.includes('stocks vs fd')
  ) {
    return {
      title: 'Should you invest all your savings in stocks or crypto?',
      whatHappened: `You currently have ${formatCurrency(savings)} in savings, which acts as your safety buffer for living expenses (${expenses > 0 ? (savings / expenses).toFixed(1) : '2.5'} months runway).`,
      whyItMatters: 'Emergency savings and investments serve completely opposite purposes: savings are for safety and quick access (liquidity), while investments are for long-term growth with market swings. If you invest your emergency fund and an unexpected expense happens during a market dip, you will be forced to sell at a loss.',
      whatYouCanDo: [
        `Rule: Keep at least ₹15,000–₹20,000 safe in a savings account or high-yield sweep account. Never touch this for stock speculation.`,
        `If you have surplus cash above your safety buffer and zero high-interest debt, invest a modest ₹500 to ₹1,000/month into broad index mutual funds (like Nifty 50).`,
        'Avoid crypto or speculative derivatives: crypto carries flat 30% tax rules in India and extreme volatility that college budgets cannot withstand.'
      ]
    };
  }

  // =========================================================================
  // SITUATION 9: REACHING GOAL FASTER / ACCELERATION
  // =========================================================================
  if (
    q.includes('faster') || q.includes('speed up') || q.includes('earlier') ||
    q.includes('accelerate') || q.includes('laptop sooner')
  ) {
    const targetMonths = timeframe || 6;
    const acceleratedReq = Math.ceil(goalRemaining / targetMonths);
    const deficitFromAvailable = acceleratedReq - availableCash;

    return {
      title: `How to reach your ${topGoal.name} in ${targetMonths} months`,
      whatHappened: `You have ${formatCurrency(goalRemaining)} left to save for your ${topGoal.name}. Reaching it in ${targetMonths} months requires saving ${formatCurrency(acceleratedReq)}/month. You currently have ${formatCurrency(availableCash)}/month available.`,
      whyItMatters: deficitFromAvailable > 0
        ? `Saving ${formatCurrency(acceleratedReq)}/month is ${formatCurrency(deficitFromAvailable)} higher than your current surplus of ${formatCurrency(availableCash)}. To reach this target, you either need extra income or tighter budgeting.`
        : `Great news! ${formatCurrency(acceleratedReq)}/month fits comfortably within your ${formatCurrency(availableCash)} available cash.`,
      whatYouCanDo: [
        deficitFromAvailable > 0
          ? `Option A: Pick up 4–6 hours of weekend tutoring to generate an extra ₹1,500–₹2,000/month.`
          : `Automate a transfer of ${formatCurrency(acceleratedReq)} on the 1st of every month into a separate savings space.`,
        `Option B: Check for student discounts, festival sales, or exchange bonuses which could lower your ${topGoal.name} target by 10–15%.`,
        'Use the Timeline Adjuster slider in your Goals tab to experiment with different monthly contributions.'
      ]
    };
  }

  // =========================================================================
  // SITUATION 10: BUDGET CUTTING & EXPENSE LEAKS
  // =========================================================================
  if (
    q.includes('cut expense') || q.includes('save more') || q.includes('leaking') ||
    q.includes('overspending') || q.includes('cut down') || q.includes('reduce spending')
  ) {
    return {
      title: 'Where to optimize your monthly spending',
      whatHappened: `You currently spend ${formatCurrency(expenses)}/month. Your biggest expense buckets are food/mess (₹3,500), commute (₹2,000), study materials (₹1,000), utilities (₹700), and personal leisure (₹800).`,
      whyItMatters: 'Small recurring leaks (daily food delivery, unused streaming subscriptions, frequent auto rides instead of student metro passes) often total ₹1,500–₹2,500/month without you noticing.',
      whatYouCanDo: [
        'Quick Win 1: Switch 3 auto-rickshaw rides a week to college campus shuttles or metro passes (saves ~₹600/month).',
        'Quick Win 2: Share streaming accounts or buy student-tier subscription plans (saves ~₹300/month).',
        'Quick Win 3: Cook or eat in mess on weekends instead of ordering late-night snacks (saves ~₹800/month).',
        `Reinvesting this saved ₹1,700/month into your ${topGoal.name} cuts your remaining wait time in half!`
      ]
    };
  }

  // =========================================================================
  // SITUATION 11: MARKET DIPS / PANIC / RED PORTFOLIO
  // =========================================================================
  if (
    q.includes('crash') || q.includes('market down') || q.includes('red') ||
    q.includes('panic') || q.includes('losing money') || q.includes('sell everything')
  ) {
    return {
      title: 'Market Dip Reality Check',
      whatHappened: `Your investments currently show an unrealized change of ${formatCurrency(unrealizedChange)}. Markets are currently in an "${marketCondition}" climate.`,
      whyItMatters: 'When stock prices drop, your ownership units do not disappear. Only the daily trading price moves. Selling during a red day locks in a permanent "realized loss". Holding through the cycle allows recovery when company earnings rebound.',
      whatYouCanDo: [
        'Take a deep breath and close trading screens: short-term movements are noise for student investors.',
        `Verify your time horizon: if you won't need this cash for at least 3 years, temporary dips are completely harmless.`,
        'Never sell out of fear alone. If you need money urgently in the short term, that money should never have been in the stock market.'
      ]
    };
  }

  // =========================================================================
  // SITUATION 12: DYNAMIC SMART FALLBACK FOR ANY OTHER CUSTOM STUDENT QUESTION
  // =========================================================================
  const extractedSubject = primaryAmount ? `a ${formatCurrency(primaryAmount)} transaction` : 'your query';
  return {
    title: `Custom Advice for ${primaryAmount ? formatCurrency(primaryAmount) : 'your situation'}`,
    whatHappened: `Regarding ${extractedSubject}: You currently have ${formatCurrency(availableCash)} in monthly available surplus (Income ${formatCurrency(income)} - Expenses ${formatCurrency(expenses)}), ${formatCurrency(savings)} in emergency savings, and ${totalDebt > 0 ? formatCurrency(totalDebt) + ' in debt obligations' : 'zero debt'}.`,
    whyItMatters: `Every unplanned commitment impacts your monthly surplus. With your top goal (${topGoal.name}) requiring ${formatCurrency(goalMonthlyReq)}/month, maintaining a healthy cushion keeps your college finances stable.`,
    whatYouCanDo: [
      totalDebt > 0
        ? `Step 1: Keep prioritizing your ${formatCurrency(totalDebt)} debt repayment to eliminate ongoing interest costs.`
        : `Step 1: Protect your ${formatCurrency(savings)} emergency cushion in high-yield savings.`,
      primaryAmount && primaryAmount > availableCash
        ? `Step 2: Note that ${formatCurrency(primaryAmount)} exceeds your monthly surplus of ${formatCurrency(availableCash)}, so you may need to spread it across multiple months or tap temporary savings.`
        : `Step 2: Check if this aligns with your ${topGoal.name} savings pace (${formatCurrency(goalMonthlyReq)}/month).`,
      `Step 3: If you need an exact calculation, ask: "Can I afford ₹${primaryAmount || 2000}?" or "How to save for a goal in X months?"`
    ]
  };
}
