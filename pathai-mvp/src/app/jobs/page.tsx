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
      <div className="flex-1 bg-surface flex items-center justify-center p-6">
        <LoadingSpinner message="AI is finding the best jobs for you..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 bg-surface p-6 flex flex-col items-center justify-center text-center gap-4">
        <div className="bg-danger-light border border-danger-border rounded-2xl p-6 text-center w-full max-w-sm">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-danger mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className="font-bold text-lg text-danger mb-1">Error</p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
        <button
          onClick={fetchMatches}
          className="px-6 py-2.5 bg-brand-400 hover:bg-brand-500 text-white font-semibold rounded-xl text-sm shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-surface flex flex-col p-6 max-w-2xl mx-auto w-full">
      
      {/* Header */}
      <div className="mb-6 pl-3 border-l-4 border-brand-400">
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          AI matched jobs
        </h1>
        <p className="text-xs text-ink-muted mt-1 font-semibold">
          Recommended jobs matching your trade and skill set
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <div className="w-16 h-16 bg-brand-50 border border-brand-100 rounded-full flex items-center justify-center text-brand-400 mb-4">
            <Search className="w-6 h-6" />
          </div>
          <p className="text-ink font-bold text-lg">No Jobs Found</p>
          <p className="text-xs text-ink-secondary mt-1 max-w-xs leading-relaxed">
            We couldn't find jobs for your trade. You can try changing your trade in onboarding.
          </p>
          <button
            onClick={() => {
              localStorage.clear()
              router.push('/auth/register')
            }}
            className="mt-6 px-5 py-2.5 border border-surface-border bg-surface-muted text-brand-600 rounded-xl text-sm font-semibold hover:bg-brand-50 hover:border-brand-300 transition-all duration-200"
          >
            Change Profile
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {matches.map((match, idx) => {
            const { job, match_percent, matched_skills, gap_skills } = match
            
            // Color code based on percentage
            let pctColor = 'text-danger bg-danger-light border-danger-border'
            if (match_percent >= 80) {
              pctColor = 'text-success bg-success-light border-success-border'
            } else if (match_percent >= 60) {
              pctColor = 'text-warning bg-warning-light border-warning-border'
            }

            return (
              <div 
                key={job.id || idx}
                className="bg-surface-card rounded-2xl border border-surface-border shadow-sm p-6 flex flex-col gap-4 relative overflow-hidden hover:shadow-md hover:border-brand-300 transition-all duration-200"
              >
                {/* Match percentage badge */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-ink tracking-tight leading-snug">
                      {job.title}
                    </h2>
                    <p className="text-sm font-semibold text-ink-secondary mt-0.5">
                      {job.employer}
                    </p>
                  </div>
                  <div className={`px-3 py-1 border rounded-full font-bold text-xs whitespace-nowrap ${pctColor}`}>
                    {match_percent}% Match
                  </div>
                </div>

                {/* Meta details */}
                <div className="text-xs text-ink-secondary font-medium flex flex-wrap gap-x-4 gap-y-2 items-center">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-400" />
                    {job.district}, {job.state}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <DollarSign className="w-3.5 h-3.5 text-brand-400" />
                    Rs. {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()} /mo
                  </span>
                </div>

                {/* Skills section */}
                <div className="flex flex-col gap-3 py-3 border-t border-b border-surface-border">
                  
                  {/* Matched skills */}
                  {matched_skills.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-ink-muted tracking-wide uppercase">Matched Skills</span>
                      <div className="flex flex-wrap gap-1.5">
                        {matched_skills.map(skill => (
                          <span key={skill} className="bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full border border-brand-100">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills to develop */}
                  {gap_skills.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-ink-muted tracking-wide uppercase">Skills to Develop</span>
                      <div className="flex flex-wrap gap-1.5">
                        {gap_skills.map(skill => (
                          <span key={skill} className="bg-warning-light text-warning text-xs font-semibold px-3 py-1 rounded-full border border-warning-border">
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
                  className="w-full py-3 bg-brand-400 hover:bg-brand-500 text-white font-semibold rounded-xl text-sm transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                >
                  View Skill Gap & Start Assessment
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
