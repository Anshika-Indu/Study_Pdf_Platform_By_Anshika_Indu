'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import NavBar from '@/components/NavBar'
import Toolbar from '@/components/Toolbar'
import StudyLensPanel from '@/components/StudyLensPanel'
import ExplainModal from '@/components/ExplainModal'
import { Document, Highlight, StudyLensNote, Summary } from '@/types'
import { ExplanationResult } from '@/lib/ai/explain'

interface Props {
  doc: Document
  userId: string
  initialHighlights: Highlight[]
  initialNotes: StudyLensNote[]
  initialSummary: Summary | null
}

export default function ViewerClient({
  doc,
  userId,
  initialHighlights,
  initialNotes,
  initialSummary,
}: Props) {
  const supabase = createClient()

  const [highlights, setHighlights]   = useState<Highlight[]>(initialHighlights)
  const [notes, setNotes]             = useState<StudyLensNote[]>(initialNotes)
  const [summary, setSummary]         = useState<Summary | null>(initialSummary)
  const [activeMode, setActiveMode]   = useState<'none' | 'highlight' | 'underline'>('none')
  const [selectedText, setSelectedText] = useState('')
  const [panelOpen, setPanelOpen]     = useState(true)

  // AI state
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [showExplain, setShowExplain]     = useState(false)
  const [isExplaining, setIsExplaining]   = useState(false)
  const [explainResult, setExplainResult] = useState<ExplanationResult | null>(null)
  const [explainError, setExplainError]   = useState<string | null>(null)

  // ─── Annotation Handlers ─────────────────────────────────────

  function handleToggleMode(mode: 'highlight' | 'underline') {
    setActiveMode((prev) => (prev === mode ? 'none' : mode))
  }

  function handleTextSelection() {
    const sel = window.getSelection()
    if (sel && sel.toString().trim()) {
      setSelectedText(sel.toString().trim())
    }
  }

  async function handleHighlight() {
    if (!selectedText) return
    const { data, error } = await supabase
      .from('highlights')
      .insert({
        document_id: doc.id,
        user_id: userId,
        highlighted_text: selectedText,
        color: '#FBBF24',
      })
      .select()
      .single()

    if (!error && data) {
      setHighlights((prev) => [data, ...prev])
      setSelectedText('')
    }
  }

  async function handleAddNote(content: string) {
    const { data, error } = await supabase
      .from('study_lens')
      .insert({
        document_id: doc.id,
        user_id: userId,
        note_content: content,
        note_type: 'manual',
      })
      .select()
      .single()

    if (!error && data) {
      setNotes((prev) => [data, ...prev])
    }
  }

  async function handleDeleteNote(id: string) {
    await supabase.from('study_lens').delete().eq('id', id)
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  // ─── AI Handlers ─────────────────────────────────────────────

  async function handleGenerateSummary() {
    setIsSummarizing(true)
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: doc.id }),
      })
      const data = await res.json()
      if (data.summary) setSummary(data.summary)
    } catch (err) {
      console.error('Summary error:', err)
    } finally {
      setIsSummarizing(false)
    }
  }

  async function handleExplain() {
    if (!selectedText) return
    setShowExplain(true)
    setIsExplaining(true)
    setExplainResult(null)
    setExplainError(null)

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedText }),
      })
      const data = await res.json()
      if (data.error) setExplainError(data.error)
      else setExplainResult(data)
    } catch {
      setExplainError('Failed to get explanation. Check your API key.')
    } finally {
      setIsExplaining(false)
    }
  }

  async function handleSaveExplainAsNote(content: string) {
    await handleAddNote(content)
    // Save as AI insight type
    const { data } = await supabase
      .from('study_lens')
      .update({ note_type: 'ai_insight' })
      .eq('note_content', content)
      .eq('document_id', doc.id)
      .select()
      .single()
    if (data) setNotes((prev) => [data, ...prev.slice(1)])
    setShowExplain(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 px-4 py-2 border-b text-xs"
        style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
        <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-white/60 truncate max-w-[200px]">{doc.file_name}</span>
      </div>

      {/* Toolbar */}
      <Toolbar
        fileName={doc.file_name}
        onHighlight={() => { handleToggleMode('highlight'); if (selectedText) handleHighlight() }}
        onUnderline={() => handleToggleMode('underline')}
        onAddNote={() => { if (selectedText) handleAddNote(selectedText) }}
        onExplain={handleExplain}
        onSearch={() => {/* Phase 3: open search modal */}}
        activeMode={activeMode}
        isExplaining={isExplaining}
        selectedText={selectedText}
      />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* PDF Viewer */}
        <div
          className="flex-1 overflow-auto bg-black/30"
          onMouseUp={handleTextSelection}
        >
          <iframe
            src={`${doc.file_url}#toolbar=0`}
            className="w-full"
            style={{ height: 'calc(100vh - 140px)', border: 'none' }}
            title={doc.file_name}
          />
        </div>

        {/* Study Lens Panel toggle button */}
        <button
          onClick={() => setPanelOpen((p) => !p)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 glass px-1.5 py-3 rounded-l-lg border-l-0"
          style={{ borderColor: 'var(--border-subtle)' }}
          title={panelOpen ? 'Close panel' : 'Open Study Lens'}
        >
          <svg
            className={`w-4 h-4 text-white/60 transition-transform ${panelOpen ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Study Lens Panel */}
        {panelOpen && (
          <StudyLensPanel
            notes={notes}
            highlights={highlights}
            summary={summary}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
            isSummarizing={isSummarizing}
            onGenerateSummary={handleGenerateSummary}
          />
        )}
      </div>

      {/* Explain Modal */}
      {showExplain && (
        <ExplainModal
          selectedText={selectedText}
          result={explainResult}
          isLoading={isExplaining}
          error={explainError}
          onClose={() => setShowExplain(false)}
          onSaveAsNote={handleSaveExplainAsNote}
        />
      )}
    </div>
  )
}
