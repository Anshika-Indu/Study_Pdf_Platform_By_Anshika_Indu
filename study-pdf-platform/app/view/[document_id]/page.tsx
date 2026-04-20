import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ViewerClient from './ViewerClient'

interface Props {
  params: { document_id: string }
}

export default async function ViewerPage({ params }: Props) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch document (RLS ensures user can only get their own)
  const { data: doc, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', params.document_id)
    .single()

  if (error || !doc) notFound()

  // Update last_opened
  await supabase
    .from('documents')
    .update({ last_opened: new Date().toISOString() })
    .eq('id', doc.id)

  // Fetch annotations
  const [{ data: highlights }, { data: notes }, { data: summaries }] = await Promise.all([
    supabase.from('highlights').select('*').eq('document_id', doc.id).order('created_at', { ascending: false }),
    supabase.from('study_lens').select('*').eq('document_id', doc.id).order('created_at', { ascending: false }),
    supabase.from('summaries').select('*').eq('document_id', doc.id).order('created_at', { ascending: false }).limit(1),
  ])

  return (
    <ViewerClient
      doc={doc}
      userId={user.id}
      initialHighlights={highlights ?? []}
      initialNotes={notes ?? []}
      initialSummary={summaries?.[0] ?? null}
    />
  )
}
