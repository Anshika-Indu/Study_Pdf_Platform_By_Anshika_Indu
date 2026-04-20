// ─── Phase 3: AI Concept Explainer ───────────────────────────
// Explains selected text from a PDF in student-friendly language

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ExplanationResult {
  explanation: string
  simpleAnalogy: string
  relatedConcepts: string[]
}

export async function explainConcept(
  selectedText: string,
  documentContext?: string
): Promise<ExplanationResult> {
  const contextSnippet = documentContext
    ? `\n\nDocument context: ${documentContext.slice(0, 800)}`
    : ''

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a brilliant tutor helping a student understand academic content.
Explain concepts clearly, like you're talking to an intelligent 18-year-old student.
Return JSON with shape:
{
  "explanation": "Clear 2-3 paragraph explanation",
  "simpleAnalogy": "A simple real-world analogy to make this click",
  "relatedConcepts": ["Related concept 1", "Related concept 2", ...]
}`,
      },
      {
        role: 'user',
        content: `Explain this selected text: "${selectedText}"${contextSnippet}`,
      },
    ],
    response_format: { type: 'json_object' },
    max_tokens: 600,
  })

  const raw = response.choices[0].message.content ?? '{}'
  const parsed = JSON.parse(raw)

  return {
    explanation: parsed.explanation ?? 'Could not generate explanation.',
    simpleAnalogy: parsed.simpleAnalogy ?? '',
    relatedConcepts: parsed.relatedConcepts ?? [],
  }
}

// ─── Phase 3: Semantic Search ────────────────────────────────
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text.slice(0, 8000),
  })
  return response.data[0].embedding
}
