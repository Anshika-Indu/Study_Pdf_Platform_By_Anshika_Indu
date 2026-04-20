import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateEmbedding } from '@/lib/ai/explain'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { query, documentId } = await req.json()
    if (!query || !documentId) {
      return NextResponse.json({ error: 'query and documentId required' }, { status: 400 })
    }

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query)

    // Search using pgvector cosine similarity
    // Requires: CREATE EXTENSION vector; and the search_index table with embedding column
    const { data: results, error } = await supabase.rpc('search_document_chunks', {
      query_embedding: queryEmbedding,
      document_id_input: documentId,
      match_count: 5,
    })

    if (error) throw error

    return NextResponse.json({ results: results ?? [] })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
