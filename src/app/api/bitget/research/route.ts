import { NextResponse } from 'next/server';
import { getEquityData } from '@/services/bitget/mcp-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Map of supported Bitget MCP signals
const SUPPORTED_SIGNALS: Record<string, string> = {
  price: 'equity_price_quote',
  profile: 'equity_profile',
  estimates: 'equity_estimates_consensus',
};

export async function POST(request: Request) {
  try {
    const { question, symbol, signalType = 'price' } = await request.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const entryId = SUPPORTED_SIGNALS[signalType] || SUPPORTED_SIGNALS.price;

    // --- LAYER 1: Bitget MCP (Factual Evidence) ---
    let mcpEvidence = null;
    let mcpError = null;
    
    if (symbol) {
      try {
        const rawData = await getEquityData(entryId, { symbol });
        mcpEvidence = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
      } catch (err: any) {
        mcpError = err.message;
        console.warn('[Research] MCP failed, proceeding with Qwen fallback:', mcpError);
      }
    }

    // --- LAYER 2: Qwen (Grounded Explanation) ---
    const systemPrompt = `You are an AI research assistant for a professional trading desk. 
STRICT RULES:
1. EVIDENCE FIRST: Base your answer strictly on the provided MCP data.
2. HONEST UNCERTAINTY: If the data is missing or the question cannot be answered, state that clearly. Do not invent prices or facts.
3. READ-ONLY: You cannot place trades or execute orders. You only provide research.
4. NO FINANCIAL ADVICE: Present facts and analysis, not buy/sell recommendations.
5. PROVENANCE: Reference the specific data points provided in the context.`;

    const userPrompt = `User Question: "${question}"\n\nContext (Symbol: ${symbol || 'N/A'}, Data Type: ${signalType}):\n${mcpEvidence ? JSON.stringify(mcpEvidence, null, 2) : 'No MCP data available.'}${mcpError ? `\nMCP Error: ${mcpError}` : ''}`;

    const qwenResponse = await fetch(`${process.env.QWEN_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.QWEN_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.QWEN_MODEL || 'qwen3.8-max',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!qwenResponse.ok) {
      const errText = await qwenResponse.text();
      throw new Error(`Qwen API failed: ${qwenResponse.status} - ${errText}`);
    }

    const qwenData = await qwenResponse.json();
    const answer = qwenData.choices?.[0]?.message?.content || 'No response generated.';

    // --- LAYER 3: Orchestrated Response ---
    return NextResponse.json({
      question,
      answer,
      provenance: {
        symbol,
        mcpSource: 'bitget_data',
        mcpEntryId: entryId,
        signalType,
        timestamp: new Date().toISOString(),
        mcpError,
      },
      rawEvidence: mcpEvidence,
    });

  } catch (error: any) {
    console.error('[Research API Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
