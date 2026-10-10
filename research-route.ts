import { NextResponse } from 'next/server';
import { getEquityData } from '../../../../services/bitget/mcp/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Host research: Bitget MCP evidence → Qwen explanation.
 * Secrets stay server-side. Read-only.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      question?: string;
      symbol?: string;
      instrumentId?: string;
    };
    const question = body.question?.trim();
    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const symbol = body.symbol?.trim() || undefined;
    let mcpEvidence: unknown = null;
    let mcpError: string | null = null;

    if (symbol) {
      try {
        const raw = await getEquityData('equity_price_quote', { symbol });
        mcpEvidence =
          typeof raw === 'string'
            ? (() => {
                try {
                  return JSON.parse(raw);
                } catch {
                  return raw;
                }
              })()
            : raw;
      } catch (err) {
        mcpError = err instanceof Error ? err.message : String(err);
      }
    }

    const systemPrompt = `You are a stock-market research assistant for a Bitget Reality Thesis Desk.
STRICT RULES:
1. EVIDENCE FIRST: Base answers only on the provided Bitget MCP data.
2. HONEST UNCERTAINTY: If data is missing, say so. Never invent prices or company facts.
3. READ-ONLY: No trades, orders, or investment recommendations.
4. STOCK DOMAIN: Discuss tokenized US stocks / Reality instruments only—not crypto wallets or on-chain smart money.
5. PROVENANCE: Cite specific fields from the evidence when available.`;

    const userPrompt = `User question: "${question}"
Instrument context: symbol=${symbol || 'N/A'}, instrumentId=${body.instrumentId || 'N/A'}

MCP evidence:
${mcpEvidence ? JSON.stringify(mcpEvidence, null, 2) : 'No MCP data available.'}
${mcpError ? `MCP error: ${mcpError}` : ''}`;

    const base = process.env.QWEN_BASE_URL;
    const key = process.env.QWEN_API_KEY;
    if (!base || !key) {
      return NextResponse.json(
        {
          error:
            'Qwen is not configured on the server (QWEN_BASE_URL / QWEN_API_KEY).',
          provenance: {
            symbol: symbol || null,
            instrumentId: body.instrumentId || null,
            mcpSource: 'bitget_data',
            mcpEntryId: symbol ? 'equity_price_quote' : null,
            timestamp: new Date().toISOString(),
            mcpError,
          },
          rawEvidence: mcpEvidence,
        },
        { status: 503 },
      );
    }

    const qwenResponse = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: process.env.QWEN_MODEL || 'qwen3.8-max',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!qwenResponse.ok) {
      const errText = await qwenResponse.text();
      throw new Error(`Qwen API failed: ${qwenResponse.status} - ${errText}`);
    }

    const qwenData = (await qwenResponse.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const answer =
      qwenData.choices?.[0]?.message?.content?.trim() ||
      'No response generated.';

    return NextResponse.json({
      question,
      answer,
      provenance: {
        symbol: symbol || null,
        instrumentId: body.instrumentId || null,
        mcpSource: 'bitget_data',
        mcpEntryId: symbol ? 'equity_price_quote' : null,
        timestamp: new Date().toISOString(),
        mcpError,
      },
      rawEvidence: mcpEvidence,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[Research API]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
