'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/supabase/client'
import { UploadProgress } from '@/types'

interface UploadModalProps {
  userId: string
  onClose: () => void
  onSuccess: () => void
}

export default function UploadModal({ userId, onClose, onSuccess }: UploadModalProps) {
  const supabase = createClient()
  const [progress, setProgress] = useState<UploadProgress>({
    percent: 0,
    status: 'idle',
    message: 'Drop your PDF here',
  })

  const upload = useCallback(async (file: File) => {
    if (!file || file.type !== 'application/pdf') {
      setProgress({ percent: 0, status: 'error', message: 'Please upload a PDF file.' })
      return
    }

    setProgress({ percent: 10, status: 'uploading', message: 'Uploading to cloud storage...' })

    const filePath = `${userId}/${Date.now()}_${file.name}`

    const { error: storageError } = await supabase.storage
      .from('pdfs')
      .upload(filePath, file, { cacheControl: '3600', upsert: false })

    if (storageError) {
      setProgress({ percent: 0, status: 'error', message: storageError.message })
      return
    }

    setProgress({ percent: 60, status: 'uploading', message: 'Getting file URL...' })

    const { data: urlData } = supabase.storage.from('pdfs').getPublicUrl(filePath)

    setProgress({ percent: 80, status: 'saving', message: 'Saving to your library...' })

    const { error: dbError } = await supabase.from('documents').insert({
      user_id: userId,
      file_name: file.name,
      file_url: urlData.publicUrl,
      file_size: file.size,
    })

    if (dbError) {
      setProgress({ percent: 0, status: 'error', message: dbError.message })
      return
    }

    setProgress({ percent: 100, status: 'done', message: 'Uploaded successfully!' })
    setTimeout(() => {
      onSuccess()
      onClose()
    }, 800)
  }, [userId, supabase, onSuccess, onClose])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => upload(files[0]),
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: progress.status === 'uploading' || progress.status === 'saving',
  })

  const isLoading = progress.status === 'uploading' || progress.status === 'saving'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative glass rounded-2xl p-8 w-full max-w-md animate-fade-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl text-white">Upload PDF</h2>
          {!isLoading && (
            <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Drop zone */}
        <div
          {...getRootProps()}
          className={`rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-brand-400 bg-brand-600/10'
              : 'border-white/10 hover:border-brand-500/50 hover:bg-white/5'
          } ${isLoading ? 'cursor-not-allowed opacity-60' : ''}`}
        >
          <input {...getInputProps()} />

          {progress.status === 'done' ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #10B981, #06B6D4)' }}>
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white font-semibold">{progress.message}</p>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-brand-400 border-t-transparent animate-spin" />
              <p className="text-white/80 text-sm">{progress.message}</p>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress.percent}%`, background: 'linear-gradient(90deg, #6047ff, #06B6D4)' }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-1"
                style={{ background: 'rgba(96,71,255,0.15)' }}>
                <svg className="w-7 h-7 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-white font-semibold">
                {isDragActive ? 'Drop it here!' : 'Drag & drop your PDF'}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                or click to browse files
              </p>
            </div>
          )}
        </div>

        {/* Error */}
        {progress.status === 'error' && (
          <div className="mt-4 rounded-xl px-4 py-3 text-sm text-red-300"
            style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)' }}>
            {progress.message}
          </div>
        )}
      </div>
    </div>
  )
}
