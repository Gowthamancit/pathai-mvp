'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setIsLoading(true)
    setError('')

    try {
      if (!email.includes('@')) {
        throw new Error('Enter a valid email address')
      }
      await login(email.trim().toLowerCase(), password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col 
                    items-center justify-center px-4">
      <div className="w-full max-w-md">
        
        {/* Single clean card — everything inside */}
        <div className="bg-white rounded-2xl shadow-sm border 
                        border-slate-200/80 px-8 py-10">

          {/* Logo + App name row at top of card */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 
                            to-teal-600 rounded-xl flex items-center 
                            justify-center shadow-sm flex-shrink-0">
              <span className="text-white font-black text-lg 
                               leading-none">P</span>
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900 
                               tracking-tight">PathAI</span>
              <p className="text-xs text-slate-400 font-medium 
                            leading-none mt-0.5">
                Career Navigator
              </p>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-extrabold text-slate-900 
                         tracking-tight mb-1">
            Sign in
          </h1>
          <p className="text-sm text-slate-500 font-medium mb-8">
            आपका करियर, आपकी भाषा में
          </p>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email field */}
            <div>
              <label className="block text-sm font-semibold 
                                text-slate-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 
                                flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" 
                       fill="none" stroke="currentColor" 
                       viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 
                             rounded-xl text-sm text-slate-800 bg-white
                             placeholder:text-slate-400
                             focus:outline-none focus:ring-2 
                             focus:ring-teal-500/30 focus:border-teal-500 
                             transition-all duration-150"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-semibold 
                                text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 
                                flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" 
                       fill="none" stroke="currentColor" 
                       viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-16 py-3 border border-slate-200 
                             rounded-xl text-sm text-slate-800 bg-white
                             placeholder:text-slate-400
                             focus:outline-none focus:ring-2 
                             focus:ring-teal-500/30 focus:border-teal-500 
                             transition-all duration-150"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex 
                             items-center text-xs font-semibold 
                             text-slate-400 hover:text-slate-600 
                             transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2.5 bg-red-50 
                              border border-red-200 rounded-xl 
                              px-4 py-3">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0" 
                     fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" 
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                        clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-teal-600 hover:bg-teal-700 
                         active:bg-teal-800 text-white font-bold 
                         py-3.5 rounded-xl text-sm transition-all 
                         duration-150 active:scale-95 mt-2
                         disabled:opacity-40 disabled:cursor-not-allowed 
                         disabled:active:scale-100
                         shadow-sm shadow-teal-200"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 
                                   border-t-white rounded-full 
                                   animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs font-semibold text-slate-400 
                             uppercase tracking-widest">
              New to PathAI?
            </span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <a 
              href="/auth/register"
              className="text-teal-600 font-bold hover:text-teal-700 
                         transition-colors"
            >
              Create account →
            </a>
          </p>

        </div>

        {/* Below card note */}
        <p className="text-center text-xs text-slate-400 mt-6 
                      font-medium">
          SahAI for Shiksha Hackathon 2026 · PathAI MVP
        </p>

      </div>
    </div>
  )
}
