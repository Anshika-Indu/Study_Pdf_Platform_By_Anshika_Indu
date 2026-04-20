'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import NavBar from '@/components/NavBar'
import PDFCard from '@/components/PDFCard'
import UploadModal from '@/components/UploadModal'
import { Document } from '@/types'

interface Props {
  user: { id: string; email: string }
  initialDocuments: Document[]
}

export default function DashboardClient({ user, initialDocuments }: Props) {
  const supabase = createClient()
  const [documents, setDocuments] = useState<Document[]>(initialDocuments)
  const [showUpload, setShowUpload] = useState(false)
  const [search, setSearch] = useState('')

  async function refreshDocuments() {
    const { data } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setDocuments(data ?? [])
  }

  const filtered = documents.filter((d) =>
    d.file_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen">
      <NavBar userEmail={user.email} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 animate-fade-up">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">
              My Library
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {documents.length} document{documents.length !== 1 ? 's' : ''} in your collection
            </p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="btn-glow inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload PDF
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 animate-fade-up-delay-1">
          {[
            { label: 'Total PDFs', value: documents.length, gradient: 'linear-gradient(135deg,#6047ff,#06B6D4)' },
            { label: 'AI Summaries', value: documents.filter(d => d.summary_ready).length, gradient: 'linear-gradient(135deg,#10B981,#06B6D4)' },
            { label: 'Highlights', value: '—', gradient: 'linear-gradient(135deg,#F59E0B,#F43F5E)' },
            { label: 'Study Notes', value: '—', gradient: 'linear-gradient(135deg,#8b5cf6,#6047ff)' },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-5">
              <div
                className="text-2xl font-display font-bold mb-1"
                style={{ background: stat.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                {stat.value}
              </div>
              <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        {documents.length > 0 && (
          <div className="mb-6 animate-fade-up-delay-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your documents..."
              className="input-dark w-full sm:w-72 px-4 py-2.5 rounded-xl text-sm"
            />
          </div>
        )}

        {/* Documents grid */}
        {filtered.length === 0 ? (
          <div className="animate-fade-up-delay-2">
            {documents.length === 0 ? (
              <EmptyState onUpload={() => setShowUpload(true)} />
            ) : (
              <div className="text-center py-16">
                <p className="text-white/60">No documents match &ldquo;{search}&rdquo;</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fade-up-delay-2">
            {filtered.map((doc, i) => (
              <PDFCard key={doc.id} doc={doc} index={i} />
            ))}
          </div>
        )}
      </main>

      {showUpload && (
        <UploadModal
          userId={user.id}
          onClose={() => setShowUpload(false)}
          onSuccess={refreshDocuments}
        />
      )}
    </div>
  )
}

function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6"
        style={{ background: 'rgba(96,71,255,0.1)', border: '1px solid rgba(96,71,255,0.2)' }}>
        <svg className="w-10 h-10 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h2 className="font-display text-2xl font-bold text-white mb-3">Your library is empty</h2>
      <p className="text-sm max-w-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        Upload your first PDF to start reading, annotating, and generating AI summaries.
      </p>
      <button onClick={onUpload} className="btn-glow px-6 py-3 rounded-xl text-white font-semibold text-sm">
        Upload your first PDF →
      </button>
    </div>
  )
}
