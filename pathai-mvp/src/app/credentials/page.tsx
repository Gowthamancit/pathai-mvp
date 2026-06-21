'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Award, Share2, ExternalLink } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function CredentialsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [credentials, setCredentials] = useState<any[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchCredentials = async () => {
    setLoading(true)
    const userId = localStorage.getItem('pathai_user_id')
    if (!userId) {
      router.push('/auth/login')
      return
    }

    try {
      const { data, error } = await supabase
        .from('credentials')
        .select('*')
        .eq('user_id', userId)
        .order('issued_at', { ascending: false })

      if (error) throw error
      setCredentials(data || [])
    } catch (err) {
      console.error('Error fetching credentials:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCredentials()
  }, [router])

  const handleShare = (id: string) => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const verificationUrl = `${appUrl}/verify/${id}`
    navigator.clipboard.writeText(verificationUrl)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) {
    return (
      <div className="flex-1 bg-surface flex items-center justify-center p-6">
        <LoadingSpinner message="Retrieving your credentials..." />
      </div>
    )
  }

  return (
    <div className="flex-1 bg-surface flex flex-col p-6 max-w-2xl mx-auto w-full">
      
      {/* Header */}
      <div className="mb-6 pl-3 border-l-4 border-brand-400">
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          My Certificates
        </h1>
        <p className="text-xs text-ink-muted mt-1 font-semibold">
          Your earned skills and digital credentials
        </p>
      </div>

      {credentials.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <div className="w-16 h-16 bg-brand-50 border border-brand-100 rounded-full flex items-center justify-center text-brand-400 mb-4">
            <Award className="w-6 h-6" />
          </div>
          <p className="text-ink font-bold text-lg">No Certificates Yet</p>
          <p className="text-xs text-ink-secondary mt-1 max-w-xs leading-relaxed">
            Complete assessment tests for your recommended jobs to earn skills certificates.
          </p>
          <button
            onClick={() => router.push('/jobs')}
            className="mt-6 px-6 py-2.5 bg-brand-400 hover:bg-brand-500 text-white font-semibold rounded-xl text-sm transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
          >
            Find Recommended Jobs
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {credentials.map(cred => {
            const dateStr = new Date(cred.issued_at).toLocaleDateString()
            
            // Badge color mapping
            let badgeStyle = 'bg-surface-muted text-ink-muted border-surface-border'
            if (cred.proficiency_level === 'Advanced') {
              badgeStyle = 'bg-success-light text-success border-success-border'
            } else if (cred.proficiency_level === 'Proficient') {
              badgeStyle = 'bg-brand-50 text-brand-700 border-brand-100'
            } else if (cred.proficiency_level === 'Developing') {
              badgeStyle = 'bg-warning-light text-warning border-warning-border'
            }

            return (
              <div 
                key={cred.id}
                className="bg-surface-card border border-surface-border rounded-2xl shadow-sm p-6 flex flex-col gap-4 relative overflow-hidden hover:shadow-md hover:border-brand-300 transition-all duration-200"
              >
                {/* Decorative mini left border bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-400" />
                
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-base font-bold text-ink leading-snug">
                      {cred.skill}
                    </h3>
                    <p className="text-xs font-semibold text-ink-secondary mt-0.5">
                      {cred.trade} Trade
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 border rounded-full whitespace-nowrap ${badgeStyle}`}>
                    {cred.proficiency_level}
                  </span>
                </div>

                <div className="text-xs text-ink-secondary font-medium flex justify-between items-center py-2 border-t border-b border-surface-border">
                  <span>Score: <span className="text-ink font-bold">{cred.score_percent}%</span></span>
                  <span>Issued: <span className="text-ink font-bold">{dateStr}</span></span>
                </div>

                <div className="flex gap-2">
                  {/* Verify link */}
                  <a 
                    href={`/verify/${cred.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 border border-surface-border bg-white hover:bg-brand-50 hover:border-brand-300 text-brand-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Verify</span>
                  </a>

                  {/* Share button */}
                  <button
                    onClick={() => handleShare(cred.id)}
                    className="flex-grow-[1.5] py-2.5 bg-brand-400 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm active:scale-95 hover:shadow-md"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedId === cred.id ? 'Link Copied!' : 'Share'}</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Back button */}
      <button
        onClick={() => router.push('/dashboard')}
        className="w-full py-4 mt-8 bg-surface-muted hover:bg-brand-55/40 text-brand-600 font-semibold rounded-2xl text-lg transition-all duration-200 active:scale-95 border border-surface-border hover:border-brand-300"
      >
        Back to Dashboard
      </button>

    </div>
  )
}
