// ─── Phase 3: AI Summary Generator ───────────────────────────
// This module calls the OpenAI API to summarize PDF text content

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? 'placeholder',
})

export interface SummaryResult {
  summary: string
  keyPoints: string[]
  tokenCount: number
}

export async function generateSummary(
  documentText: string,
  fileName: string
): Promise<SummaryResult> {
  const truncatedText = documentText.slice(0, 12000) // ~3k tokens of context

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an expert academic assistant. Summarize academic documents clearly and concisely.
Return your response as JSON with the shape:
{
  "summary": "A 3-5 paragraph comprehensive summary",
  "keyPoints": ["Key point 1", "Key point 2", ...] // 5-8 bullet points
}`,
      },
      {
        role: 'user',
        content: `Please summarize this document titled "${fileName}":\n\n${truncatedText}`,
      },
    ],
    response_format: { type: 'json_object' },
    max_tokens: 1000,
  })

  const raw = response.choices[0].message.content ?? '{}'
  const parsed = JSON.parse(raw)

  return {
    summary: parsed.summary ?? 'Could not generate summary.',
    keyPoints: parsed.keyPoints ?? [],
    tokenCount: response.usage?.total_tokens ?? 0,
  }
}
