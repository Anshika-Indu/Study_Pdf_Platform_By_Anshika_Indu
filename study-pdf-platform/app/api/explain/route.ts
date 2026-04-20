import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { explainConcept } from '@/lib/ai/explain'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { selectedText, documentContext } = await req.json()
    if (!selectedText) return NextResponse.json({ error: 'selectedText required' }, { status: 400 })

    const result = await explainConcept(selectedText, documentContext)
    return NextResponse.json(result)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
