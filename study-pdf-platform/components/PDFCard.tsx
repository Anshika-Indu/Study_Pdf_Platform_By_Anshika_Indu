'use client'

import Link from 'next/link'
import { Document } from '@/types'

const CARD_GRADIENTS = [
  'linear-gradient(135deg, #6047ff22, #06B6D422)',
  'linear-gradient(135deg, #10B98122, #06B6D422)',
  'linear-gradient(135deg, #F59E0B22, #F43F5E22)',
  'linear-gradient(135deg, #8b5cf622, #6047ff22)',
]

interface PDFCardProps {
  doc: Document
  index: number
}

export default function PDFCard({ doc, index }: PDFCardProps) {
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length]
  const date = new Date(doc.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  const fileSizeKB = doc.file_size ? Math.round(doc.file_size / 1024) : null

  return (
    <Link href={`/view/${doc.id}`}>
      <div className="glass glass-hover rounded-2xl overflow-hidden cursor-pointer group">
        {/* Thumbnail area */}
        <div className="h-36 flex items-center justify-center relative"
          style={{ background: gradient }}>
          {/* PDF icon */}
          <div className="w-14 h-18 flex flex-col items-center justify-center">
            <svg className="w-12 h-12 text-white/40 group-hover:text-white/60 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10.92,12.31C10.68,11.54 10.15,9.08 11.55,9.09C12.95,9.1 12.03,11.6 11.78,12.31C12.38,13.9 14.05,14.37 14.05,14.37C14.43,14.28 15.01,14.23 15.01,14.64C15.01,15.05 14.54,15.1 14.42,15.11C13.54,15.11 12.6,14.5 12.6,14.5C12.6,14.5 10.86,14.94 10.27,15.76C9.68,16.58 9.68,17.5 10.08,17.65C10.48,17.8 11.03,17.06 11.63,16.13C12.23,15.2 14.1,14.97 14.1,14.97C14.1,14.97 15.26,15.76 15.77,15.71C16.27,15.66 16.71,15.11 16.43,14.75C16.14,14.39 14.9,13.95 14.9,13.95C14.9,13.95 14.24,11.58 13.03,11.08C11.82,10.58 10.92,12.31 10.92,12.31Z" />
            </svg>
          </div>

          {/* Summary badge */}
          {doc.summary_ready && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #10B981, #06B6D4)' }}>
              AI Ready
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-white truncate mb-1 font-display" title={doc.file_name}>
            {doc.file_name.replace('.pdf', '')}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{date}</span>
            {fileSizeKB && (
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{fileSizeKB} KB</span>
            )}
          </div>

          {/* Placeholder stats */}
          <div className="flex items-center gap-3 mt-3">
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              0 highlights
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
              </svg>
              {doc.page_count ? `${doc.page_count} pages` : 'PDF'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
