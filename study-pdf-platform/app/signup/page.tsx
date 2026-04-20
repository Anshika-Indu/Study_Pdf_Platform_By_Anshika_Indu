'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [success, setSuccess]   = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    setTimeout(() => router.push('/dashboard'), 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-brand-600/10 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-accent-cyan/8 blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl btn-glow flex items-center justify-center text-white font-display font-bold text-lg">
              S
            </div>
            <span className="font-display font-bold text-2xl gradient-text">StudyLens</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Join thousands of students studying smarter
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, #10B981, #06B6D4)' }}>
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white font-semibold text-lg">Account created!</p>
              <p style={{ color: 'var(--text-muted)' }} className="text-sm mt-1">Redirecting to your dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                />
              </div>

              {error && (
                <div className="rounded-xl px-4 py-3 text-sm text-red-300"
                  style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-glow w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create account →'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
