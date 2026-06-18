'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { CheckCircle2, XCircle, AlertTriangle, ExternalLink } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function VerifyPage() {
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState<any>(null)

  const verifyCredential = async () => {
    if (!id) {
      setError('Credential ID is missing.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/credentials/${id}`)
      const resData = await response.json()

      // Handle 404 cleanly by setting data state with status NOT_FOUND
      if (response.status === 404) {
        setData({ status: 'NOT_FOUND', message: 'Credential not found.' })
      } else if (!response.ok) {
        throw new Error(resData.message || 'Verification failed')
      } else {
        setData(resData)
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    verifyCredential()
  }, [id])

  if (loading) {
    return (
      <div className="flex-1 bg-surface flex items-center justify-center p-6">
        <LoadingSpinner message="Verifying credential authenticity..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 bg-surface p-6 flex flex-col items-center justify-center text-center gap-4">
        <div className="bg-danger-light text-danger p-6 rounded-2xl border border-danger-border w-full max-w-sm">
          <p className="font-bold text-lg mb-2">Verification Error</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={verifyCredential}
          className="px-6 py-2.5 bg-brand-400 hover:bg-brand-500 text-white font-semibold rounded-xl text-sm shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
        >
          Retry
        </button>
      </div>
    )
  }

  const status = data?.status

  return (
    <div className="flex-1 bg-surface flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto w-full">
      
      <div className="bg-surface-card rounded-3xl border border-surface-border shadow-xl p-8 w-full max-w-md flex flex-col items-center gap-6 hover:shadow-2xl transition-all duration-300">
        
        {/* PathAI Logo */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-brand-400 rounded-lg flex items-center justify-center text-white font-black text-sm">P</div>
          <span className="font-extrabold text-lg text-ink tracking-tight">PathAI Verify</span>
        </div>

        {/* VERIFIED STATUS */}
        {status === 'VERIFIED' && (
          <div className="flex flex-col items-center gap-6 w-full">
            <CheckCircle2 className="w-16 h-16 text-success" />
            
            <div className="text-center">
              <h2 className="text-xl font-bold text-success tracking-tight uppercase">
                Verified Genuine ✓
              </h2>
              <p className="text-xs text-ink-muted mt-1 max-w-[280px] mx-auto font-semibold">
                This skill credential is authentic and was officially issued by PathAI.
              </p>
            </div>

            {/* Credential Data details block */}
            <div className="w-full bg-surface-muted border border-surface-border rounded-2xl p-5 text-left flex flex-col gap-4 text-xs">
              
              <div className="flex justify-between items-center py-1 border-b border-surface-border/50">
                <span className="text-ink-muted font-bold uppercase tracking-wider text-[9px]">Holder Name</span>
                <span className="text-ink font-bold">{data.credential.holder_name}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-surface-border/50">
                <span className="text-ink-muted font-bold uppercase tracking-wider text-[9px]">Skill</span>
                <span className="text-brand-600 font-bold">{data.credential.skill}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-surface-border/50">
                <span className="text-ink-muted font-bold uppercase tracking-wider text-[9px]">Trade</span>
                <span className="text-ink font-bold">{data.credential.trade}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-surface-border/50">
                <span className="text-ink-muted font-bold uppercase tracking-wider text-[9px]">Proficiency</span>
                <span className="text-brand-900 font-bold">{data.credential.proficiency_level}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-surface-border/50">
                <span className="text-ink-muted font-bold uppercase tracking-wider text-[9px]">Score</span>
                <span className="text-ink font-extrabold">{data.credential.score_percent}%</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-ink-muted font-bold uppercase tracking-wider text-[9px]">Date Issued</span>
                <span className="text-ink font-semibold">
                  {new Date(data.credential.issued_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-ink-muted font-bold tracking-wide uppercase border-t border-surface-border w-full pt-4">
              Issuer: {data.credential.issued_by}
            </div>
          </div>
        )}

        {/* NOT_FOUND STATUS */}
        {status === 'NOT_FOUND' && (
          <div className="flex flex-col items-center gap-4 py-4 w-full">
            <XCircle className="w-16 h-16 text-danger" />
            <div>
              <h2 className="text-xl font-bold text-danger tracking-tight uppercase">
                Invalid Credential
              </h2>
              <p className="text-xs text-ink-secondary mt-2 max-w-xs leading-relaxed font-semibold">
                {data.message || 'This credential does not exist or has been deleted.'}
              </p>
            </div>
          </div>
        )}

        {/* INVALID / REVOKED STATUS */}
        {status === 'INVALID' && (
          <div className="flex flex-col items-center gap-4 py-4 w-full">
            <AlertTriangle className="w-16 h-16 text-warning" />
            <div>
              <h2 className="text-xl font-bold text-warning tracking-tight uppercase">
                Revoked Credential
              </h2>
              <p className="text-xs text-ink-secondary mt-2 max-w-xs leading-relaxed font-semibold">
                {data.message || 'This credential has been marked invalid or revoked.'}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
