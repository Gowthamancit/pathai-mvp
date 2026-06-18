'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function WelcomePage() {
  const router = useRouter()

  useEffect(() => {
    // If user already exists, go directly to dashboard
    const userId = localStorage.getItem('pathai_user_id')
    if (userId) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-surface to-white flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      
      {/* Decorative background circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-200 rounded-full opacity-20 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-300 rounded-full opacity-20 translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10 max-w-sm w-full">
        {/* Badge */}
        <div className="inline-block bg-brand-100/80 text-brand-800 text-xs font-bold px-4 py-2 rounded-full mb-8 border border-brand-200/50 tracking-wide uppercase">
          SahAI for Shiksha Hackathon 2026
        </div>
        
        {/* Logo */}
        <div className="w-20 h-20 bg-white border border-brand-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <span className="text-brand-500 font-black text-3xl">P</span>
        </div>
        
        {/* Title */}
        <h1 className="text-5xl font-black text-ink mb-3 tracking-tight">
          PathAI
        </h1>
        <p className="text-brand-600 text-xl font-bold mb-1">
          आपका करियर, आपकी भाषा में
        </p>
        <p className="text-ink-secondary text-sm font-medium italic mb-10">
          Your career, in your language
        </p>
        
        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {['Voice-first', 'AI-powered', '5 Indian languages', 'Free forever'].map(f => (
            <span key={f} className="bg-brand-50/50 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-brand-100">
              {f}
            </span>
          ))}
        </div>
        
        {/* CTA */}
        <button
          onClick={() => router.push('/onboarding')}
          className="w-full bg-brand-400 hover:bg-brand-500 text-white font-semibold py-4 px-8 rounded-2xl text-lg shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
        >
          शुरू करें — Get Started
        </button>
        
        <p className="text-ink-muted text-xs mt-6 font-medium">
          Works offline · Free forever · Built for Bharat
        </p>
      </div>
    </div>
  )
}
