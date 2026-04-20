// ─── Database Row Types ──────────────────────────────────────

export interface Document {
  id: string
  user_id: string
  file_name: string
  file_url: string
  file_size: number | null
  page_count: number | null
  created_at: string
  last_opened: string | null
  summary_ready: boolean
}

export interface Highlight {
  id: string
  document_id: string
  user_id: string
  highlighted_text: string
  page_number: number | null
  color: string
  position_data: Record<string, unknown> | null
  created_at: string
}

export interface Underline {
  id: string
  document_id: string
  user_id: string
  underlined_text: string
  page_number: number | null
  position_data: Record<string, unknown> | null
  created_at: string
}

export interface StudyLensNote {
  id: string
  document_id: string
  user_id: string
  note_content: string
  note_type: 'manual' | 'ai_insight' | 'key_concept'
  source_text: string | null
  page_number: number | null
  created_at: string
}

export interface Summary {
  id: string
  document_id: string
  user_id: string
  summary_text: string
  model_used: string
  token_count: number | null
  created_at: string
}

// ─── UI / Component Types ─────────────────────────────────────

export interface UploadProgress {
  percent: number
  status: 'idle' | 'uploading' | 'saving' | 'done' | 'error'
  message: string
}

export interface AIState {
  summarizing: boolean
  explaining: boolean
  searching: boolean
  error: string | null
}
