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
    <div className="min-h-screen bg-[#0D1B2A] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      
      {/* Decorative blurred orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500 rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-400 rounded-full opacity-10 blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      
      <div className="relative z-10 max-w-sm w-full text-center">
        {/* Hackathon badge */}
        <div className="inline-flex items-center gap-2 bg-teal-900/60 border border-teal-700 text-teal-300 text-xs font-bold px-4 py-2 rounded-full mb-8 tracking-widest uppercase backdrop-blur">
          SahAI for Shiksha Hackathon 2026
        </div>
        
        {/* Logo icon container */}
        <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-teal-900/40">
          <span className="text-white font-black text-3xl">P</span>
        </div>
        
        {/* PathAI title */}
        <h1 className="text-5xl font-black text-white mb-3 tracking-tight">
          PathAI
        </h1>
        
        {/* Hindi tagline */}
        <p className="text-teal-400 text-xl font-semibold mb-1">
          आपका करियर, आपकी भाषा में
        </p>
        
        {/* English tagline */}
        <p className="text-slate-400 text-sm italic mb-10">
          Your career, in your language
        </p>
        
        {/* Feature pills container */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {['Voice-first', 'AI-powered', '5 Indian languages', 'Free forever'].map(f => (
            <span key={f} className="bg-slate-800/80 border border-slate-700 text-teal-300 text-xs font-medium px-4 py-1.5 rounded-full">
              {f}
            </span>
          ))}
        </div>
        
        {/* CTA */}
        <div className="flex flex-col gap-3">
          {/* Register button (primary) */}
          <button
            onClick={() => router.push('/auth/register')}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-bold py-4 px-8 rounded-2xl text-base transition-all duration-200 active:scale-95 shadow-lg shadow-teal-900/40 mb-3"
          >
            रजिस्टर — Register
          </button>
          
          {/* Login button (secondary) */}
          <button
            onClick={() => router.push('/auth/login')}
            className="w-full border-2 border-slate-600 text-slate-300 hover:border-teal-500 hover:text-teal-400 font-bold py-4 px-8 rounded-2xl text-base transition-all duration-200 active:scale-95"
          >
            लॉगिन — Login
          </button>
        </div>
        
        {/* Bottom tagline text */}
        <p className="text-slate-500 text-xs mt-8 tracking-wide">
          Works offline · Free forever · Built for Bharat
        </p>
      </div>
    </div>
  )
}
