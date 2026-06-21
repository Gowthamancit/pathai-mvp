'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Briefcase, Award } from 'lucide-react'
import { HINDI_UI } from '@/lib/constants'
import { useAuth } from '@/context/AuthContext'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading, logout } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <LoadingSpinner message="Loading your dashboard..." />
      </div>
    )
  }

  const isHindi = user.language === 'hi'

  const labels = {
    greeting: isHindi ? `नमस्ते, ${user.name}! 👋` : `Namaste, ${user.name}! 👋`,
    subtitle: `${user.trade} · ${user.district}, ${user.state}`,
    
    // Card 1
    jobTitle: isHindi ? HINDI_UI.findJobs : 'Find Jobs Near You',
    jobSubtitle: isHindi ? 'AI आपकी स्किल से जॉब मैच करता है' : 'AI matches jobs to your skills',
    jobBtn: isHindi ? 'नौकरियां खोजें' : 'Explore Jobs',
    
    // Card 2
    credTitle: isHindi ? HINDI_UI.yourCertificate : 'My Credentials',
    credSubtitle: isHindi ? 'अपने कमाए हुए सर्टिफिकेट देखें और शेयर करें' : 'View and share your earned certificates',
    credBtn: isHindi ? 'सर्टिफिकेट देखें' : 'View Credentials',

    startOver: isHindi ? 'शुरुआत से शुरू करें (डेमो)' : 'Start Over (Demo)'
  }

  const handleStartOver = async () => {
    await logout()
    router.push('/auth/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        
        {/* User Greeting */}
        <div className="mb-8 mt-2 pl-4 border-l-4 border-teal-500">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {labels.greeting}
          </h1>
          <p className="text-sm text-teal-600 font-semibold mt-0.5">
            {labels.subtitle}
          </p>
        </div>

        {/* Action Cards stack */}
        <div className="space-y-4">
          
          {/* Card 1: Jobs */}
          <div 
            onClick={() => router.push('/jobs')}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-teal-100 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center text-teal-600 group-hover:bg-teal-100 transition-colors shrink-0">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 mb-1">{labels.jobTitle}</h2>
                <p className="text-sm text-slate-500">{labels.jobSubtitle}</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                router.push('/jobs')
              }}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl text-sm transition-all duration-150 active:scale-95"
            >
              {labels.jobBtn}
            </button>
          </div>

          {/* Card 2: Credentials */}
          <div 
            onClick={() => router.push('/credentials')}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-teal-100 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center text-amber-500 group-hover:bg-amber-100 transition-colors shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 mb-1">{labels.credTitle}</h2>
                <p className="text-sm text-slate-500">{labels.credSubtitle}</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                router.push('/credentials')
              }}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl text-sm transition-all duration-150 active:scale-95"
            >
              {labels.credBtn}
            </button>
          </div>

        </div>

        {/* Start Over Button */}
        <button
          onClick={handleStartOver}
          className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors mt-8 block text-center mx-auto"
        >
          {labels.startOver}
        </button>

      </div>
    </div>
  )
}
