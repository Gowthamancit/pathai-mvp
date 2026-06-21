'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/LoadingSpinner'
import { JobMatch } from '@/lib/types'
import { Search, MapPin, DollarSign, AlertCircle } from 'lucide-react'

export default function JobsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [matches, setMatches] = useState<JobMatch[]>([])

  const fetchMatches = async () => {
    setLoading(true)
    setError('')

    const userId = localStorage.getItem('pathai_user_id')
    if (!userId) {
      router.push('/auth/login')
      return
    }

    try {
      const response = await fetch('/api/match-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch job matches')
      }

      setMatches(data.matches || [])
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMatches()
  }, [router])

  const handleSelectJob = (match: JobMatch) => {
    localStorage.setItem('pathai_selected_job', JSON.stringify(match.job))
    router.push(`/skill-gap?job_id=${match.job.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <LoadingSpinner message="AI is finding the best jobs for you..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center text-center gap-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center w-full max-w-sm">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-500 mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className="font-bold text-lg text-red-500 mb-1">Error</p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
        <button
          onClick={fetchMatches}
          className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="mb-6 pl-3 border-l-4 border-teal-500">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            AI matched jobs
          </h1>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Recommended jobs matching your trade and skill set
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 bg-teal-50 border border-teal-100 rounded-full flex items-center justify-center text-teal-400 mb-4">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-slate-900 font-bold text-lg">No Jobs Found</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              We couldn't find jobs for your trade. You can try changing your trade in onboarding.
            </p>
            <button
              onClick={() => {
                localStorage.clear()
                router.push('/auth/register')
              }}
              className="mt-6 px-5 py-2.5 border border-slate-200 bg-slate-50 text-teal-600 rounded-xl text-sm font-semibold hover:bg-teal-50 hover:border-teal-300 transition-all duration-200"
            >
              Change Profile
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {matches.map((match, idx) => {
              const { job, match_percent, matched_skills, gap_skills } = match
              
              // Color code based on percentage
              let pctClass = 'inline-flex items-center gap-1 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full'
              if (match_percent >= 80) {
                pctClass = 'inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full'
              } else if (match_percent >= 60) {
                pctClass = 'inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full'
              }

              return (
                <div 
                  key={job.id || idx}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4 hover:shadow-md hover:border-teal-100 transition-all duration-200"
                >
                  {/* Match percentage badge */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900 tracking-tight mb-0.5">
                        {job.title}
                      </h2>
                      <p className="text-sm font-semibold text-teal-700 mb-3">
                        {job.employer}
                      </p>
                    </div>
                    <div className={pctClass}>
                      {match_percent}% Match
                    </div>
                  </div>

                  {/* Meta details */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.district}, {job.state}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                      Rs. {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()} /mo
                    </span>
                  </div>

                  {/* Skills section */}
                  <div className="flex flex-col gap-3">
                    
                    {/* Matched skills */}
                    {matched_skills.length > 0 && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Matched Skills</span>
                        <div className="flex flex-wrap gap-1.5">
                          {matched_skills.map(skill => (
                            <span key={skill} className="inline-flex items-center bg-teal-50 border border-teal-200 text-teal-700 text-xs font-medium px-3 py-1.5 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills to develop */}
                    {gap_skills.length > 0 && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-bold tracking-widest uppercase text-slate-400 mt-3 mb-2">Skills to Develop</span>
                        <div className="flex flex-wrap gap-1.5">
                          {gap_skills.map(skill => (
                            <span key={skill} className="inline-flex items-center bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Action button */}
                  <button
                    onClick={() => handleSelectJob(match)}
                    className="w-full mt-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-150 active:scale-95 shadow-sm shadow-teal-100"
                  >
                    View Skill Gap & Start Assessment
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
