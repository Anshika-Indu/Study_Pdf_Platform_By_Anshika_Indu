# StudyLens — AI Academic Reading Platform

A full-stack Next.js + Supabase platform for intelligent PDF study sessions.

---

## Tech Stack

| Layer        | Technology               |
|--------------|--------------------------|
| Frontend     | Next.js 14 (App Router)  |
| Styling      | Tailwind CSS             |
| Auth         | Supabase Auth            |
| Database     | Supabase (PostgreSQL)    |
| Storage      | Supabase Storage         |
| AI           | OpenAI API (GPT-4o-mini) |
| Deployment   | Vercel                   |

---

## Project Structure

```
study-pdf-platform/
├── app/
│   ├── page.tsx                          # Root redirect
│   ├── layout.tsx                        # Root layout
│   ├── globals.css                       # Global styles + design tokens
│   ├── login/page.tsx                    # Login page
│   ├── signup/page.tsx                   # Signup page
│   ├── dashboard/
│   │   ├── page.tsx                      # Server component (auth + data)
│   │   └── DashboardClient.tsx           # Client component (interactivity)
│   ├── view/[document_id]/
│   │   ├── page.tsx                      # Server component
│   │   └── ViewerClient.tsx              # PDF viewer + annotations
│   └── api/
│       ├── summarize/route.ts            # AI summary endpoint
│       ├── explain/route.ts              # AI concept explainer endpoint
│       └── search/route.ts              # Semantic search endpoint
├── components/
│   ├── NavBar.tsx                        # Navigation bar
│   ├── PDFCard.tsx                       # Dashboard document card
│   ├── UploadModal.tsx                   # Drag-and-drop PDF uploader
│   ├── Toolbar.tsx                       # Viewer annotation toolbar
│   ├── StudyLensPanel.tsx                # Side panel: summaries/highlights/notes
│   └── ExplainModal.tsx                  # AI explanation popup
├── lib/
│   ├── supabase/
│   │   ├── client.ts                     # Browser Supabase client
│   │   └── server.ts                     # Server Supabase client
│   └── ai/
│       ├── summarize.ts                  # OpenAI summary logic
│       └── explain.ts                    # OpenAI explain + embeddings
├── types/index.ts                        # TypeScript types
├── middleware.ts                         # Auth route protection
└── supabase/schema.sql                   # Full database schema + RLS
```

---

## Setup Guide

### Step 1 — Clone and install

```bash
git clone <your-repo>
cd study-pdf-platform
npm install
```

### Step 2 — Create Supabase project

1. Go to https://supabase.com and create a new project
2. Wait for it to provision (~2 minutes)

### Step 3 — Run the database schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Open `supabase/schema.sql` from this project
3. Paste the entire file and click **Run**

### Step 4 — Create Storage buckets

In Supabase dashboard → **Storage** → **New bucket**:

| Bucket name  | Public? |
|--------------|---------|
| `pdfs`       | No (private) |
| `thumbnails` | Yes (public) |

### Step 5 — Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=sk-your-openai-key   # Only needed for Phase 3 AI features
```

**Where to find Supabase keys:**
- Dashboard → Project Settings → API → Project URL + anon public key

### Step 6 — Run locally

```bash
npm run dev
```

Visit http://localhost:3000 — it will redirect to `/login`.

---

## Deployment to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# Settings → Environment Variables → add all 3 from .env.local
```

Or connect your GitHub repo to Vercel for automatic deploys.

---

## Feature Phases

### ✅ Phase 1 — MVP (Complete)
- Email/password authentication
- Dashboard with document library
- PDF upload to Supabase Storage
- PDF viewer with iframe renderer
- User-scoped document filtering (RLS)

### ✅ Phase 2 — Annotations (Complete)
- Highlight text → saved to `highlights` table
- Study notes → saved to `study_lens` table
- Study Lens side panel with tabs
- Underline schema ready

### ✅ Phase 3 — AI Integration (Complete)
- `POST /api/summarize` → GPT-4o-mini document summary
- `POST /api/explain` → Concept explanation with analogy + related concepts
- `POST /api/search` → Semantic search with vector embeddings
- ExplainModal with save-to-notes

---

## Database Tables

| Table          | Purpose                            |
|----------------|------------------------------------|
| `documents`    | Uploaded PDF metadata              |
| `highlights`   | Text highlights with color + page  |
| `underlines`   | Text underlines                    |
| `study_lens`   | Manual notes + AI insights         |
| `summaries`    | AI-generated document summaries    |
| `search_index` | Embedding chunks for semantic search |

All tables have Row Level Security: users can only access their own data.

---

## Extending the Platform

**Add Google OAuth:**
```typescript
// In login page:
await supabase.auth.signInWithOAuth({ provider: 'google' })
```

**Add real PDF text extraction:**
```bash
npm install pdf-parse
```
Then in `/api/summarize/route.ts`, fetch the PDF buffer from Supabase Storage and extract text with `pdf-parse` before sending to OpenAI.

**Enable pgvector for semantic search:**
In Supabase SQL Editor:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

---

## Portfolio Notes

This project demonstrates:
- Full-stack architecture with Next.js App Router (Server + Client Components)
- Supabase Auth with session management via SSR cookies
- Row Level Security on all user tables
- Cloud storage pipeline with Supabase Storage
- AI integration with OpenAI (summarization, explanation, semantic search)
- TypeScript throughout with strict types
- Production-ready folder structure and separation of concerns
