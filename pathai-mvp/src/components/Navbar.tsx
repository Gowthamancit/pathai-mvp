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
    <nav className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div 
        className="flex items-center gap-2.5 cursor-pointer group select-none"
        onClick={() => router.push('/')}
      >
        <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
          <span className="text-white font-black text-base">P</span>
        </div>
        <span className="font-extrabold text-lg text-slate-900 tracking-tight">PathAI</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-lg">
          {language === 'hi' ? 'हिंदी' : 
           language === 'ta' ? 'தமிழ்' :
           language === 'te' ? 'తెలుగు' :
           language === 'bn' ? 'বাংলা' : 'English'}
        </span>
        {user ? (
          <button
            onClick={handleLogout}
            className="text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition-colors duration-150"
          >
            Logout
          </button>
        ) : (
          <span className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg uppercase tracking-wider">
            MVP Demo
          </span>
        )}
      </div>
    </nav>
  )
}
