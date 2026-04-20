'use client'

import { useState } from 'react'
import { StudyLensNote, Highlight, Summary } from '@/types'

interface StudyLensPanelProps {
  notes: StudyLensNote[]
  highlights: Highlight[]
  summary: Summary | null
  onAddNote: (content: string) => void
  onDeleteNote: (id: string) => void
  isSummarizing: boolean
  onGenerateSummary: () => void
}

type Tab = 'summary' | 'highlights' | 'notes'

export default function StudyLensPanel({
  notes,
  highlights,
  summary,
  onAddNote,
  onDeleteNote,
  isSummarizing,
  onGenerateSummary,
}: StudyLensPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('summary')
  const [newNote, setNewNote] = useState('')

  function handleAddNote() {
    if (!newNote.trim()) return
    onAddNote(newNote.trim())
    setNewNote('')
  }

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'summary',    label: 'Summary' },
    { id: 'highlights', label: 'Highlights', count: highlights.length },
    { id: 'notes',      label: 'Notes',      count: notes.length },
  ]

  return (
    <aside className="w-80 flex flex-col glass border-l h-full overflow-hidden"
      style={{ borderColor: 'var(--border-subtle)' }}>
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-2"
        style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #6047ff, #06B6D4)' }}>
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <span className="font-display font-bold text-white text-sm">Study Lens</span>
      </div>

      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-xs font-semibold transition-colors relative ${
              activeTab === tab.id ? 'text-white' : 'text-white/40 hover:text-white/70'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px]"
                style={{ background: 'rgba(96,71,255,0.3)', color: '#a78bfa' }}>
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ background: 'linear-gradient(90deg, #6047ff, #06B6D4)' }} />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">

        {/* ─── Summary Tab ─── */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            {summary ? (
              <>
                <div className="glass rounded-xl p-4">
                  <p className="text-xs text-white/70 leading-relaxed">{summary.summary_text}</p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(96,71,255,0.1)' }}>
                  <svg className="w-7 h-7 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-xs text-white/60 mb-4 leading-relaxed">
                  Generate an AI-powered summary of this document to understand key concepts quickly.
                </p>
                <button
                  onClick={onGenerateSummary}
                  disabled={isSummarizing}
                  className="btn-glow w-full py-2.5 rounded-xl text-white text-xs font-semibold disabled:opacity-60"
                >
                  {isSummarizing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3 h-3 border border-white/60 border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </span>
                  ) : '✨ Generate Summary'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── Highlights Tab ─── */}
        {activeTab === 'highlights' && (
          <div className="space-y-3">
            {highlights.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Select text in the PDF and click Highlight to save it here.
                </p>
              </div>
            ) : (
              highlights.map((h) => (
                <div key={h.id} className="glass rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: h.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/80 leading-relaxed line-clamp-3">
                        {h.highlighted_text}
                      </p>
                      {h.page_number && (
                        <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                          Page {h.page_number}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ─── Notes Tab ─── */}
        {activeTab === 'notes' && (
          <div className="space-y-3">
            {/* Add note input */}
            <div className="space-y-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.metaKey) handleAddNote()
                }}
                placeholder="Add a study note... (⌘Enter to save)"
                rows={3}
                className="input-dark w-full px-3 py-2.5 rounded-xl text-xs resize-none"
              />
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="btn-glow w-full py-2 rounded-xl text-white text-xs font-semibold disabled:opacity-40"
              >
                Add Note
              </button>
            </div>

            {/* Notes list */}
            {notes.length === 0 ? (
              <p className="text-center text-xs py-4" style={{ color: 'var(--text-muted)' }}>
                No notes yet. Add your first insight above.
              </p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="glass rounded-xl p-3 group relative">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs text-white/80 leading-relaxed flex-1">{note.note_content}</p>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all flex-shrink-0"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {note.note_type === 'ai_insight' && (
                    <span className="inline-block mt-2 text-[10px] px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(96,71,255,0.2)', color: '#a78bfa' }}>
                      ✨ AI Insight
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
