'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    const userProfile = localStorage.getItem('pathai_user')
    if (userProfile) {
      try {
        const parsed = JSON.parse(userProfile)
        setLanguage(parsed.language || 'en')
      } catch (e) {
        console.error(e)
      }
    }
  }, [pathname, user]) // Trigger update when route or user changes

  // Don't show navbar on welcome page
  if (pathname === '/') return null

  const handleLogout = async () => {
    await logout()
    router.push('/auth/login')
  }

  return (
    <nav className="bg-white border-b border-surface-border shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div 
        className="flex items-center gap-2 cursor-pointer select-none"
        onClick={() => router.push('/')}
      >
        <div className="w-8 h-8 bg-brand-50 border border-brand-200 rounded-xl flex items-center justify-center text-brand-500 font-bold text-sm">
          P
        </div>
        <span className="font-bold text-lg tracking-tight text-ink">PathAI</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-brand-600 bg-brand-50 border border-brand-100 px-2.5 py-1 rounded-full">
          {language === 'hi' ? 'हिंदी' : 
           language === 'ta' ? 'தமிழ்' :
           language === 'te' ? 'తెలుగు' :
           language === 'bn' ? 'বাংলা' : 'English'}
        </span>
        {user ? (
          <button
            onClick={handleLogout}
            className="text-xs font-bold text-danger bg-danger-light border border-danger-border px-3 py-1 rounded-full cursor-pointer hover:bg-red-100 transition-colors"
          >
            Logout
          </button>
        ) : (
          <span className="text-[10px] font-bold text-ink-secondary bg-surface-muted border border-surface-border px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            MVP Demo
          </span>
        )}
      </div>
    </nav>
  )
}
