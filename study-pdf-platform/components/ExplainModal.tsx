'use client'

import { ExplanationResult } from '@/lib/ai/explain'

interface ExplainModalProps {
  selectedText: string
  result: ExplanationResult | null
  isLoading: boolean
  error: string | null
  onClose: () => void
  onSaveAsNote: (content: string) => void
}

export default function ExplainModal({
  selectedText,
  result,
  isLoading,
  error,
  onClose,
  onSaveAsNote,
}: ExplainModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative glass rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto animate-fade-up">
        {/* Header */}
        <div className="sticky top-0 glass flex items-center justify-between p-5 border-b"
          style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6047ff, #06B6D4)' }}>
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="font-display font-bold text-white text-sm">AI Explanation</span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Selected text */}
          <div className="rounded-xl px-4 py-3"
            style={{ background: 'rgba(96,71,255,0.1)', border: '1px solid rgba(96,71,255,0.2)' }}>
            <p className="text-xs font-medium text-brand-300 mb-1">Selected text</p>
            <p className="text-sm text-white/70 italic">&ldquo;{selectedText}&rdquo;</p>
          </div>

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-brand-400 border-t-transparent animate-spin" />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Thinking...</p>
            </div>
          )}

          {error && (
            <div className="rounded-xl px-4 py-3 text-sm text-red-300"
              style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)' }}>
              {error}
            </div>
          )}

          {result && !isLoading && (
            <>
              <div>
                <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Explanation</h3>
                <p className="text-sm text-white/85 leading-relaxed">{result.explanation}</p>
              </div>

              {result.simpleAnalogy && (
                <div className="rounded-xl px-4 py-3"
                  style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
                  <p className="text-xs font-medium text-emerald-400 mb-1">💡 Simple Analogy</p>
                  <p className="text-sm text-white/75">{result.simpleAnalogy}</p>
                </div>
              )}

              {result.relatedConcepts.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Related Concepts</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.relatedConcepts.map((concept, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full text-xs"
                        style={{ background: 'rgba(96,71,255,0.15)', color: '#a78bfa' }}>
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => onSaveAsNote(result.explanation)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all text-white/70 hover:text-white"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)' }}
              >
                Save to Study Notes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
