'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setLoading(true)
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
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <LoadingSpinner message="Logging you in..." />
      </div>
    )
  }

  return (
    <div className="flex-1 bg-surface flex flex-col p-6 max-w-md mx-auto w-full justify-center">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black tracking-tight text-ink mb-2">Welcome Back</h2>
        <p className="text-ink-secondary text-sm font-medium">
          Sign in to access your career dashboard
        </p>
      </div>

      {error && (
        <div className="bg-danger-light text-danger p-4 rounded-xl text-sm mb-6 border border-danger-border flex flex-col gap-2">
          <span>{error}</span>
          <button 
            type="button" 
            onClick={() => setError('')} 
            className="text-xs underline text-left font-bold text-danger hover:text-red-700 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold tracking-wide uppercase text-ink-muted">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="test@pathai.com"
            className="w-full border border-surface-border rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 bg-white placeholder:text-ink-muted transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold tracking-wide uppercase text-ink-muted">
            Password *
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-surface-border rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 bg-white placeholder:text-ink-muted transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={!email || !password}
          className="w-full py-4 bg-brand-400 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold rounded-2xl text-lg mt-4 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
        >
          Login
        </button>

        <p className="text-center text-xs text-ink-muted mt-2 font-medium">
          Don't have an account yet?{' '}
          <span onClick={() => router.push('/auth/register')} className="text-brand-500 hover:underline font-bold cursor-pointer">
            Register
          </span>
        </p>
      </form>
    </div>
  )
}
