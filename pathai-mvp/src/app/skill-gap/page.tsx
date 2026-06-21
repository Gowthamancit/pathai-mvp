'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import LoadingSpinner from '@/components/LoadingSpinner'
import { GapAnalysis } from '@/lib/types'

function SkillGapContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const job_id = searchParams.get('job_id')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState<{
    gap: GapAnalysis
    user: { name: string; trade: string }
    job: { title: string; employer: string }
  } | null>(null)

  const [recommendations, setRecommendations] = useState<Record<string, {
    loading: boolean
    error?: string
    data?: {
      what_to_study: string
      why_it_matters: string
      quick_tip: string
      study_hint_hindi: string
      estimated_study_time: string
      free_resources: string[]
    }
    expanded: boolean
  }>>({})

  const handleToggleStudy = async (skillName: string, severity: number) => {
    const current = recommendations[skillName]
    
    if (current?.expanded) {
      setRecommendations(prev => ({
        ...prev,
        [skillName]: { ...prev[skillName], expanded: false }
      }))
      return
    }

    if (current?.data) {
      setRecommendations(prev => ({
        ...prev,
        [skillName]: { ...prev[skillName], expanded: true }
      }))
      return
    }

    setRecommendations(prev => ({
      ...prev,
      [skillName]: { loading: true, expanded: true }
    }))

    try {
      const response = await fetch('/api/study-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trade: data?.user.trade, skill: skillName, severity })
      })

      const resData = await response.json()

      if (!response.ok) {
        throw new Error(resData.error || 'Failed to fetch recommendation')
      }

      setRecommendations(prev => ({
        ...prev,
        [skillName]: {
          loading: false,
          data: resData.recommendation,
          expanded: true
        }
      }))
    } catch (err: any) {
      setRecommendations(prev => ({
        ...prev,
        [skillName]: {
          loading: false,
          error: err.message || 'Something went wrong',
          expanded: true
        }
      }))
    }
  }

  const fetchGap = async () => {
    const userId = localStorage.getItem('pathai_user_id')
    if (!userId) {
      router.push('/auth/login')
      return
    }

    if (!job_id) {
      setError('Missing target job reference.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/skill-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, job_id })
      })

      const resData = await response.json()

      if (!response.ok) {
        throw new Error(resData.error || 'Failed to analyze skill gap')
      }

      setData(resData)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGap()
  }, [router, job_id])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <LoadingSpinner message="Analyzing your skill profile..." />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center text-center gap-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center w-full max-w-sm">
          <p className="font-bold text-lg text-red-500 mb-1">Analysis Failed</p>
          <p className="text-sm text-red-600">{error || 'Could not fetch data'}</p>
        </div>
        <button
          onClick={fetchGap}
          className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
        >
          Retry
        </button>
      </div>
    )
  }

  const { gap, user, job } = data
  const readiness_percent = Math.min(100, Math.max(0, gap.readiness_percent))

  // Find the first gap skill that has an assessment available
  const assessableGapSkill = gap.gap_skills.find(gs => gs.has_assessment)

  const handleStartAssessment = (skillName: string) => {
    router.push(`/assessment?skill=${encodeURIComponent(skillName)}&trade=${encodeURIComponent(user.trade)}`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        
        {/* Target Job Title & Employer */}
        <div className="mb-6 pl-3 border-l-4 border-teal-500">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-teal-600 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full mb-3">
            TARGET JOB
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {job.title}
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1 mb-6">
            {job.employer}
          </p>
        </div>

        {/* Circular Readiness Indicator */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4 text-center">
          <div className="relative flex items-center justify-center">
            <svg className="w-36 h-36" viewBox="0 0 36 36">
              <path
                className="text-slate-200"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-teal-500"
                strokeDasharray={`${readiness_percent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-slate-900">{readiness_percent}%</span>
              <span className="text-xs font-bold tracking-widest uppercase text-teal-500 mt-1">Ready</span>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-4 text-center">
            Your readiness matches {readiness_percent}% of this job's required core skills.
          </p>
        </div>

        {/* Strengths Section */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
          <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">
            Your Strengths ({gap.matched_skills.length})
          </h3>
          {gap.matched_skills.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No exact matched skills listed for this profile.</p>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {gap.matched_skills.map(skill => (
                <div 
                  key={skill}
                  className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0"
                >
                  <span className="text-sm font-semibold text-slate-700">{skill}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    Matched
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skills to Develop Section */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
          <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">
            Skills to Develop ({gap.gap_skills.length})
          </h3>
          {gap.gap_skills.length === 0 ? (
            <p className="text-xs text-emerald-600 font-bold italic">You meet all listed skill requirements for this job!</p>
          ) : (
            <div className="flex flex-col gap-4">
              {gap.gap_skills.map(item => {
                const severityPct = Math.round(item.severity * 100)
                const rec = recommendations[item.skill]
                
                return (
                  <div key={item.skill} className="mb-4 last:mb-0 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center gap-4 mb-2">
                      <span className="text-sm font-semibold text-slate-800">{item.skill}</span>
                      {item.has_assessment ? (
                        <button
                          onClick={() => handleStartAssessment(item.skill)}
                          className="text-xs font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-4 py-2 rounded-xl transition-colors"
                        >
                          Take Assessment
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleStudy(item.skill, item.severity)}
                          className="text-xs font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-4 py-2 rounded-xl transition-colors"
                        >
                          {rec?.expanded ? 'Hide Guide' : 'What to Study'}
                        </button>
                      )}
                    </div>
                    
                    {/* Severity Bar */}
                    <div className="w-full flex items-center gap-3">
                      <span className="text-[10px] text-slate-400 font-bold uppercase w-10">Gap</span>
                      <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                        <div 
                          className="bg-red-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${severityPct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-red-500 font-bold w-8 text-right">{severityPct}%</span>
                    </div>

                    {/* Expandable study details */}
                    {rec?.expanded && (
                      <div className="mt-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-4 transition-all duration-200 animate-fade-in">
                        {rec.loading && (
                          <div className="py-4">
                            <LoadingSpinner message="Generating study recommendations..." />
                          </div>
                        )}
                        
                        {rec.error && (
                          <p className="text-xs text-red-500 font-bold">{rec.error}</p>
                        )}

                        {rec.data && (
                          <div className="flex flex-col gap-3.5 text-xs text-slate-600">
                            <div>
                              <span className="text-[9px] font-bold text-teal-600 uppercase tracking-wider">What to Study / क्या सीखें</span>
                              <p className="font-bold text-slate-900 leading-relaxed mt-0.5">{rec.data.what_to_study}</p>
                              {rec.data.study_hint_hindi && (
                                <p className="text-xs text-slate-600 font-medium italic mt-1 bg-white/60 p-2 rounded-lg border border-slate-200">{rec.data.study_hint_hindi}</p>
                              )}
                            </div>

                            <div>
                              <span className="text-[9px] font-bold text-teal-600 uppercase tracking-wider">Why it Matters</span>
                              <p className="leading-relaxed mt-0.5">{rec.data.why_it_matters}</p>
                            </div>

                            {rec.data.estimated_study_time && (
                              <div>
                                <span className="text-[9px] font-bold text-teal-600 uppercase tracking-wider">Estimated Time</span>
                                <p className="font-semibold text-slate-950 leading-relaxed mt-0.5">{rec.data.estimated_study_time}</p>
                              </div>
                            )}

                            {rec.data.free_resources && rec.data.free_resources.length > 0 && (
                              <div>
                                <span className="text-[9px] font-bold text-teal-600 uppercase tracking-wider">Recommended Free Resources</span>
                                <ul className="list-disc pl-4 mt-0.5 flex flex-col gap-1 text-slate-600 font-medium">
                                  {rec.data.free_resources.map((res, i) => (
                                    <li key={i}>{res}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-[11px] leading-relaxed text-teal-800 font-semibold">
                              💡 Tip: {rec.data.quick_tip}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Start First Assessment CTA at bottom */}
        {assessableGapSkill && (
          <button
            onClick={() => handleStartAssessment(assessableGapSkill.skill)}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-bold py-4 rounded-2xl text-sm transition-all duration-150 active:scale-95 shadow-md shadow-teal-100 mt-6"
          >
            Start Assessment: {assessableGapSkill.skill}
          </button>
        )}

      </div>
    </div>
  )
}

export default function SkillGapPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <LoadingSpinner message="Loading skill gap analysis..." />
      </div>
    }>
      <SkillGapContent />
    </Suspense>
  )
}
