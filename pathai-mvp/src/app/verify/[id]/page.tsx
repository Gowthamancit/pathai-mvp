'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface VerifiedCredential {
  id: string
  holder_name: string
  skill: string
  trade: string
  score_percent: number
  proficiency_level: string
  issued_at: string
  issued_by: string
}

type VerifyStatus = 'loading' | 'verified' | 'not_found' | 'invalid'

export default function VerifyPage() {
  const params = useParams()
  const id = params.id as string
  const [status, setStatus] = useState<VerifyStatus>('loading')
  const [credential, setCredential] = useState<VerifiedCredential | null>(null)

  useEffect(() => {
    if (!id) return

    const verify = async () => {
      try {
        const res = await fetch(`/api/credentials/${id}`)
        const data = await res.json()

        if (data.status === 'VERIFIED') {
          setStatus('verified')
          setCredential(data.credential)
        } else if (data.status === 'INVALID') {
          setStatus('invalid')
        } else {
          setStatus('not_found')
        }
      } catch {
        setStatus('not_found')
      }
    }

    verify()
  }, [id])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-teal-400 font-medium">
            Verifying credential...
          </p>
        </div>
      </div>
    )
  }

  if (status === 'not_found') {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Credential Not Found
          </h1>
          <p className="text-gray-500 text-sm">
            This credential ID does not exist or may have been removed.
          </p>
          <p className="text-xs text-gray-400 mt-4 font-mono break-all">
            ID: {id}
          </p>
        </div>
      </div>
    )
  }

  if (status === 'invalid') {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Credential Revoked
          </h1>
          <p className="text-gray-500 text-sm">
            This credential has been revoked and is no longer valid.
          </p>
        </div>
      </div>
    )
  }

  if (status === 'verified' && credential) {
    const issuedDate = new Date(credential.issued_at).toLocaleDateString(
      'en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }
    )

    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center px-6 py-10">
        <div className="max-w-sm w-full">

          {/* Verified badge */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-full text-sm font-black shadow-lg shadow-emerald-900/30 tracking-wide mb-6">
              <span>✓</span>
              <span>VERIFIED CREDENTIAL</span>
            </div>
          </div>

          {/* Main credential card */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 overflow-hidden border border-white/10">
            
            {/* Card header */}
            <div className="bg-[#0D1B2A] px-6 pt-6 pb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-black text-lg">P</span>
                </div>
                <div>
                  <p className="text-teal-400 text-xs font-black tracking-widest uppercase">
                    PathAI
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Skill Certificate
                  </p>
                </div>
                <div className="ml-auto">
                  <span className="ml-auto text-emerald-400 text-xs font-bold border border-emerald-500/50 bg-emerald-500/10 px-3 py-1.5 rounded-full">
                    ✓ AI Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Card body */}
            <div className="px-6 py-5 space-y-4">
              
              {/* Holder name */}
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-1">
                  AWARDED TO
                </p>
                <p className="text-3xl font-black text-slate-900 tracking-tight">
                  {credential.holder_name}
                </p>
              </div>

              {/* Skill */}
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-1">
                  SKILL CERTIFIED
                </p>
                <p className="text-xl font-bold text-slate-900 capitalize">
                  {credential.skill}
                </p>
                <p className="text-sm text-slate-500 mt-0.5">
                  {credential.trade} Trade
                </p>
              </div>

              {/* Score and level */}
              <div className="flex gap-3">
                <div className="flex-1 bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-black text-teal-600">
                    {credential.score_percent}%
                  </p>
                  <p className="text-xs text-teal-500 font-semibold mt-1">
                    Score
                  </p>
                </div>
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                  <p className="text-base font-black text-slate-800">
                    {credential.proficiency_level}
                  </p>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    Level
                  </p>
                </div>
              </div>

              {/* Date */}
              <div className="flex justify-between text-xs text-slate-400 pt-3 border-t border-slate-100 mt-1">
                <span>Issued on {issuedDate}</span>
                <span>{credential.issued_by}</span>
              </div>

              {/* Credential ID */}
              <div className="bg-slate-50 rounded-2xl p-4 mt-1">
                <p className="text-xs text-slate-400 mb-2 font-bold tracking-widest uppercase">
                  Credential ID
                </p>
                <p className="text-xs font-mono text-slate-600 break-all leading-relaxed">
                  {credential.id}
                </p>
              </div>

            </div>

            {/* Verified footer */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-t border-emerald-100 px-6 py-4 text-center">
              <p className="text-emerald-700 text-xs font-bold">
                ✓ This credential is genuine and was issued by PathAI
              </p>
              <p className="text-emerald-600 text-xs mt-0.5">
                Verified on {new Date().toLocaleDateString('en-IN')}
              </p>
            </div>

          </div>

          {/* Bottom note */}
          <p className="text-center text-gray-500 text-xs mt-6">
            SahAI for Shiksha Hackathon 2026
          </p>
        </div>
      </div>
    )
  }

  return null
}
