-- ============================================================
-- Study PDF Platform — Supabase Schema
-- Run this entire file in your Supabase SQL Editor
-- ============================================================

-- ─── DOCUMENTS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name   TEXT NOT NULL,
  file_url    TEXT NOT NULL,
  file_size   BIGINT,
  page_count  INT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  last_opened TIMESTAMPTZ,
  summary_ready BOOLEAN DEFAULT FALSE
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own documents"
  ON documents FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── HIGHLIGHTS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS highlights (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id      UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  highlighted_text TEXT NOT NULL,
  page_number      INT,
  color            TEXT DEFAULT '#FBBF24',
  position_data    JSONB,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own highlights"
  ON highlights FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── UNDERLINES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS underlines (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id      UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  underlined_text  TEXT NOT NULL,
  page_number      INT,
  position_data    JSONB,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE underlines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own underlines"
  ON underlines FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── STUDY LENS (NOTES) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS study_lens (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id  UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note_content TEXT NOT NULL,
  note_type    TEXT DEFAULT 'manual' CHECK (note_type IN ('manual', 'ai_insight', 'key_concept')),
  source_text  TEXT,
  page_number  INT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE study_lens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own study lens notes"
  ON study_lens FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── SUMMARIES ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS summaries (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id  UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  summary_text TEXT NOT NULL,
  model_used   TEXT DEFAULT 'gpt-4o-mini',
  token_count  INT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own summaries"
  ON summaries FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── SEARCH INDEX (for semantic search / embeddings) ─────────
CREATE TABLE IF NOT EXISTS search_index (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chunk_text  TEXT NOT NULL,
  page_number INT,
  embedding   vector(1536),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE search_index ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own search index"
  ON search_index FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── STORAGE BUCKETS ─────────────────────────────────────────
-- Run these in Supabase Dashboard → Storage → Create bucket
-- Bucket name: pdfs        (private)
-- Bucket name: thumbnails  (public)

-- Storage policies (run after creating buckets):
CREATE POLICY "Users can upload their own PDFs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can read their own PDFs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own PDFs"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);
