'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Briefcase, GraduationCap, Award } from 'lucide-react'
import { HINDI_UI } from '@/lib/constants'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userId = localStorage.getItem('pathai_user_id')
    const userProfile = localStorage.getItem('pathai_user')

    if (!userId || !userProfile) {
      router.push('/onboarding')
    } else {
      setUser(JSON.parse(userProfile))
    }
  }, [router])

  if (!user) return null

  const isHindi = user.language === 'hi'

  const labels = {
    greeting: isHindi ? `नमस्ते, ${user.name}! 👋` : `Namaste, ${user.name}! 👋`,
    subtitle: `${user.trade} · ${user.district}, ${user.state}`,
    
    // Card 1
    jobTitle: isHindi ? HINDI_UI.findJobs : 'Find Jobs Near You',
    jobSubtitle: isHindi ? 'AI आपकी स्किल से जॉब मैच करता है' : 'AI matches jobs to your skills',
    jobBtn: isHindi ? 'नौकरियां खोजें' : 'Explore Jobs',
    
    // Card 2
    assessTitle: isHindi ? HINDI_UI.startAssessment : 'Skill Assessment',
    assessSubtitle: isHindi ? 'सर्टिफिकेट पाने के लिए टेस्ट दें' : 'Test your knowledge, earn credentials',
    assessBtn: isHindi ? 'टेस्ट शुरू करें' : 'Start Assessment',
    
    // Card 3
    credTitle: isHindi ? HINDI_UI.yourCertificate : 'My Credentials',
    credSubtitle: isHindi ? 'अपने कमाए हुए सर्टिफिकेट देखें और शेयर करें' : 'View and share your earned certificates',
    credBtn: isHindi ? 'सर्टिफिकेट देखें' : 'View Credentials',

    startOver: isHindi ? 'शुरुआत से शुरू करें (डेमो)' : 'Start Over (Demo)'
  }

  const handleStartOver = () => {
    localStorage.clear()
    router.push('/onboarding')
  }

  return (
    <div className="flex-1 bg-surface flex flex-col p-6 max-w-2xl mx-auto w-full">
      
      {/* User Greeting */}
      <div className="mb-8 mt-2 pl-3 border-l-4 border-brand-400">
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          {labels.greeting}
        </h1>
        <p className="text-sm font-semibold text-brand-600 mt-1">
          {labels.subtitle}
        </p>
      </div>

      {/* Action Cards stack */}
      <div className="flex flex-col gap-6">
        
        {/* Card 1: Jobs */}
        <div className="bg-surface-card p-6 rounded-2xl border border-surface-border shadow-sm flex flex-col gap-4 hover:shadow-md hover:border-brand-300 transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-center text-brand-600">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink">{labels.jobTitle}</h2>
              <p className="text-xs text-ink-secondary">{labels.jobSubtitle}</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/jobs')}
            className="w-full py-3 bg-brand-400 hover:bg-brand-500 text-white font-semibold rounded-xl text-sm transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
          >
            {labels.jobBtn}
          </button>
        </div>

        {/* Card 2: Assessment */}
        <div className="bg-surface-card p-6 rounded-2xl border border-surface-border shadow-sm flex flex-col gap-4 hover:shadow-md hover:border-brand-300 transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-center text-brand-600">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink">{labels.assessTitle}</h2>
              <p className="text-xs text-ink-secondary">{labels.assessSubtitle}</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/assessment')}
            className="w-full py-3 bg-brand-400 hover:bg-brand-500 text-white font-semibold rounded-xl text-sm transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
          >
            {labels.assessBtn}
          </button>
        </div>

        {/* Card 3: Credentials */}
        <div className="bg-surface-card p-6 rounded-2xl border border-surface-border shadow-sm flex flex-col gap-4 hover:shadow-md hover:border-brand-300 transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-center text-brand-600">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink">{labels.credTitle}</h2>
              <p className="text-xs text-ink-secondary">{labels.credSubtitle}</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/credentials')}
            className="w-full py-3 bg-brand-400 hover:bg-brand-500 text-white font-semibold rounded-xl text-sm transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
          >
            {labels.credBtn}
          </button>
        </div>

      </div>

      {/* Start Over Button */}
      <div className="mt-auto pt-10 text-center">
        <button
          onClick={handleStartOver}
          className="text-xs text-ink-muted hover:text-danger underline font-semibold transition-all duration-200"
        >
          {labels.startOver}
        </button>
      </div>

    </div>
  )
}
