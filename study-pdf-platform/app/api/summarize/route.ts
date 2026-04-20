import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateSummary } from '@/lib/ai/summarize'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { documentId } = await req.json()
    if (!documentId) return NextResponse.json({ error: 'documentId required' }, { status: 400 })

    // Get document (RLS protects this)
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (docError || !doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 })

    // NOTE: In production, fetch the PDF text using a PDF parsing library
    // For now, we use the file name as context and a placeholder
    // To extract real text: use pdf-parse on the file buffer fetched from storage
    const placeholderText = `Document: ${doc.file_name}. This is a PDF document uploaded by the user.`

    const result = await generateSummary(placeholderText, doc.file_name)

    // Save to DB
    const { data: savedSummary, error: saveError } = await supabase
      .from('summaries')
      .insert({
        document_id: documentId,
        user_id: user.id,
        summary_text: result.summary,
        model_used: 'gpt-4o-mini',
        token_count: result.tokenCount,
      })
      .select()
      .single()

    if (saveError) throw saveError

    // Mark document as summary_ready
    await supabase.from('documents').update({ summary_ready: true }).eq('id', documentId)

    return NextResponse.json({ summary: savedSummary, keyPoints: result.keyPoints })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
