export const SUGGESTION_POOL = [
  "Is it a good idea to buy these stocks trending around $160? Give me the company history, why they're trending up, and what could go wrong.",
  "A target is selling at a 30% discount to peers. What's wrong with the business, and is the discount justified or a red flag?",
  "Break down Acme Corp: revenue trends, debt load, license status, and whether Mr. Red would signal green, amber, or red.",
  "Why is Meridian Freight trending up this quarter? I need ownership history, margins, and litigation exposure before I commit.",
  "Cipher Security is hot right now. Help me understand their moat, customer concentration, and regulatory compliance score.",
  "Should I pursue a $12M SaaS acquisition where churn improved but EBITDA is still negative? What due diligence gaps remain?",
  "This retail chain trades at a deep discount. Analyze foot traffic data, lease obligations, and why insiders might be selling.",
  "NovaPharma is raising Series C. Walk me through FDA pipeline risk, cash runway, and hard gates that could kill the deal.",
  "Compare two logistics targets: one green-signal, one amber. Which has better debt-to-equity and license validity?",
  "GreenLeaf Organics looks strong on paper. Verify market share claims, supplier concentration, and profit margin sustainability.",
  "Harbor Retail is down 40% YTD but volume spiked. Is this a value play or a falling knife? Give me a full signal breakdown.",
  "I'm seeing buzz around a cybersecurity buyout at 18x revenue. Is that multiple justified given their retention and compliance scores?",
  "Atlas Manufacturing has 14 years of history. Summarize cap table changes, OEM dependency, and whether the JV structure adds risk.",
  "A biotech name is trending on social media. Separate hype from fundamentals: revenue, litigation, and sanctions checks.",
  "Why would a profitable food brand sell at 4.2x EBITDA? Dig into customer retention, organic certification, and expansion costs.",
  "TechVault claims 2,400 enterprise clients. Stress-test that number against credit score, years in business, and market position.",
  "Three amber deals in my pipeline. Rank them by score percentage and tell me which hard gates are closest to failing.",
  "Is insider selling at a discount always bad? Explain when amber signals still justify proceeding with due diligence.",
  "Walk me through how Mr. Red scores annual revenue vs credit score vs regulatory compliance for a mid-market target.",
  "I found a company trending up on low float. Check sanctions flags, active litigation, and minimum revenue thresholds.",
  "What does a red signal actually mean in practice? Use a real example with failed gates and recommended next steps.",
  "Should I walk away from a deal with valid licenses but credit score below 600? What's the hard gate engine logic?",
  "Help me draft research factors for a $32M security platform. What numbers matter most for a green signal?",
  "Why are regional freight operators consolidating now? Macro view plus deal-specific financials I should request.",
  "A founder wants a quick close at a premium. What background checks on licenses, litigation, and debt ratio can't I skip?",
  "Explain outcome ledger accuracy. How do predicted green signals compare to actual ROI on closed deals?",
  "I'm comparing public comps trading near $160. Tie stock momentum to underlying deal fundamentals Mr. Red would analyze.",
  "Discounted sale from a PE exit. Is the urgency real? Analyze years in business, margin trend, and employee churn.",
  "Give me a due diligence checklist for healthcare targets with pending regulatory approvals and compliance scores under 7.",
  "Which scoring matrix factors weigh heaviest for manufacturing JVs, and what amber thresholds should trigger a pause?",
];

export function pickSuggestions(
  count: number,
  current: string[] = []
): string[] {
  const available = SUGGESTION_POOL.filter((s) => !current.includes(s));
  const pool = available.length >= count ? available : [...SUGGESTION_POOL];

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function generateMockReply(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes("[attached:")) {
    const names = userMessage.match(/\[Attached: ([^\]]+)\]/i)?.[1] ?? "your file(s)";
    return `**Document analysis — ${names}**

I've received the uploaded material and started a structured pass:

• **Financials & metrics** — revenue trends, margins, debt ratios, and anomalies vs stated claims
• **Compliance & licenses** — permits, regulatory filings, sanctions, and litigation references
• **Deal structure** — valuation assumptions, earn-outs, customer concentration, and red-flag clauses
• **Mr. Red gates** — hard stops on license validity, sanctions, and critical litigation before scoring

*Preliminary signal:* **Amber** until I can verify numbers against independent sources. I'll flag any gate failures as **red** immediately.

Share the target name or any specific questions about the document, and I'll narrow the analysis.`;
  }

  if (lower.includes("160") || lower.includes("stock") || lower.includes("trending")) {
    return `**Mr. Red preliminary read on trending names near $160**

I've flagged this for deeper analysis. Based on typical patterns:

• **Why trending up:** Often driven by earnings beats, sector rotation, or short-covering. Verify with 8-K filings and volume vs float.
• **Company history:** Pull 10-year revenue CAGR, management tenure, and prior restructuring events before sizing a position.
• **Discount vs premium:** If peers trade higher, check whether the gap is litigation, margin compression, or one-off charges.
• **Mr. Red signal:** Run hard gates first (license, sanctions, litigation). Without those passing, score caps at **amber** regardless of momentum.

*Next step:* Create a deal analysis with annual revenue, credit score, and compliance factors. I'll return a full red/amber/green breakdown with gate results.`;
  }

  if (lower.includes("discount") || lower.includes("selling cheap") || lower.includes("what's wrong")) {
    return `**Discounted deals: what usually explains the gap**

Common drivers Mr. Red surfaces:

1. **Balance sheet stress:** debt-to-equity above 3.0 triggers amber; above hard gate thresholds leads to red.
2. **License or compliance gaps:** invalid permits force an automatic red regardless of price.
3. **Customer concentration:** one client >40% revenue often explains a valuation haircut.
4. **Litigation or sanctions:** critical hard gates; do not proceed until cleared.

A discount can be opportunity *only if* gates pass and the scoring matrix shows green on financials. I can run the full matrix if you share the target name.`;
  }

  if (lower.includes("history") || lower.includes("background")) {
    return `**Background research framework**

For company history I cross-reference:

• Years in business & cap table changes
• Industry licenses and regulatory compliance score (0–10)
• Annual revenue trajectory and profit margin trend
• Market share vs stated positioning
• Audit trail of prior deal signals on similar targets in your ledger

Share the company name or open **Deals → New Deal** to populate factors and get a scored signal with hard gate results.`;
  }

  if (lower.includes("green") || lower.includes("amber") || lower.includes("red") || lower.includes("signal")) {
    return `**Mr. Red signal summary**

| Signal | Meaning | Action |
|--------|---------|--------|
| 🟢 Green | Strong profile, gates passed | Proceed with due diligence |
| 🟡 Amber | Moderate risk, review factors | Deep-dive flagged areas |
| 🔴 Red | Critical issues or failed gates | Stop, resolve or pass |

Signals combine the **scoring matrix** (weighted factors) with the **hard gate engine** (non-negotiable fails). Any critical gate failure overrides score to red.

Ask about a specific company or paste financials to simulate an analysis.`;
  }

  return `**Mr. Red**

I'll analyze that across company background, financials, licenses, litigation, and market factors, then return a **red, amber, or green** signal with gate results and a scoring breakdown.

To go deeper:
1. Paste any numbers you have (revenue, credit score, margins).
2. Or open **Deals → New Deal** for a full structured analysis.

What company or deal should I prioritize?`;
}
