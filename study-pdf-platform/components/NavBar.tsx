'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface NavBarProps {
  userEmail?: string
}

export default function NavBar({ userEmail }: NavBarProps) {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="glass border-b sticky top-0 z-50" style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg btn-glow flex items-center justify-center text-white font-display font-bold text-sm">
              S
            </div>
            <span className="font-display font-bold text-xl gradient-text">StudyLens</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {userEmail && (
              <span className="hidden sm:block text-sm" style={{ color: 'var(--text-muted)' }}>
                {userEmail}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="glass glass-hover px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
