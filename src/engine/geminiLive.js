/**
 * Optional Live Gemini AI Integration
 * When a user provides a Gemini API key in settings, queries Google's Gemini Flash model in real-time
 * with full injection of the student's financial ledger and strict situational JSON instructions.
 */

export async function queryGeminiLive({ apiKey, query, userContext }) {
  if (!apiKey || !apiKey.trim()) return null;

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

  const systemInstruction = `You are the Wealth Optimizer AI Coach—a friendly, empowering financial wellness assistant for university and college students (like Duolingo for finance, NOT a Wall Street terminal).

CURRENT STUDENT FINANCIAL LEDGER (in INR ₹):
- Monthly Income: ₹${income.toLocaleString('en-IN')}
- Routine Living Expenses: ₹${expenses.toLocaleString('en-IN')}
- Net Available Monthly Cash: ₹${availableCash.toLocaleString('en-IN')}
- Current Emergency Savings Buffer: ₹${savings.toLocaleString('en-IN')}
- Total Debt / Liabilities: ₹${totalDebt.toLocaleString('en-IN')} (Details: ${JSON.stringify(debts)})
- Active Financial Goals: ${JSON.stringify(goals)}
- Investments: ${JSON.stringify(investments)} (Unrealized P&L: ₹${unrealizedChange.toLocaleString('en-IN')})
- Market Condition: ${marketCondition}

CRITICAL RULES:
1. Tailor your answer specifically to their exact financial numbers and situational question.
2. Calculate exact math for their situation (e.g. impact on monthly available cash, savings runway, or goal delay).
3. Always respond ONLY in valid JSON matching this exact structure:
{
  "title": "Short punchy student-friendly title",
  "whatHappened": "What this means for your exact budget and current numbers.",
  "whyItMatters": "The economic or psychological why behind it (interest rates, opportunity cost, cash cushion).",
  "whatYouCanDo": [
    "Step 1: Specific action with realistic rupee amount.",
    "Step 2: Specific action.",
    "Step 3: Concrete next move."
  ],
  "disclaimer": "Optional safety note if taxes, debt, or investments are involved."
}
4. NO stock picking, NO speculative trading, NO debt shaming. Keep tone supportive, encouraging, and clear.`;

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: query }]
          }
        ],
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          temperature: 0.4,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('Gemini API returned error:', response.status, errText);
      return null;
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) return null;

    const parsed = JSON.parse(candidateText);
    if (parsed.title && parsed.whatHappened && parsed.whatYouCanDo) {
      return {
        ...parsed,
        source: 'gemini-live'
      };
    }
    return null;
  } catch (err) {
    console.warn('Live Gemini call failed, falling back to built-in situational engine:', err);
    return null;
  }
}
