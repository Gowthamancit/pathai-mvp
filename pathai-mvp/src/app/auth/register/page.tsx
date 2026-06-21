'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { TRADES, LANGUAGES, DISTRICTS_BY_STATE, HINDI_UI } from '@/lib/constants'
import { useAuth } from '@/context/AuthContext'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form states
  const [language, setLanguage] = useState('en')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [consentGiven, setConsentGiven] = useState(false)
  const [name, setName] = useState('')
  const [trade, setTrade] = useState('')
  const [state, setState] = useState('')
  const [district, setDistrict] = useState('')
  const [qualification, setQualification] = useState('ITI')
  const [experienceYears, setExperienceYears] = useState(0)

  // Labels based on selected language
  const isHindi = language === 'hi'
  const labels = {
    title: isHindi ? 'रजिस्ट्रेशन' : 'Register',
    stepLabel: isHindi ? 'कदम' : 'Step',
    next: isHindi ? 'आगे बढ़ें' : 'Next',
    back: isHindi ? 'पीछे' : 'Back',
    submit: isHindi ? 'दर्ज करें' : 'Submit',
    emailLabel: isHindi ? 'ईमेल पता' : 'Email Address',
    passwordLabel: isHindi ? 'पासवर्ड' : 'Password',
    confirmPasswordLabel: isHindi ? 'पासवर्ड की पुष्टि करें' : 'Confirm Password',
    nameLabel: isHindi ? HINDI_UI.yourName : 'Your Name',
    tradeLabel: isHindi ? HINDI_UI.yourTrade : 'Your Trade',
    stateLabel: isHindi ? HINDI_UI.yourState : 'Your State',
    districtLabel: isHindi ? HINDI_UI.yourDistrict : 'Your District',
    qualificationLabel: isHindi ? 'योग्यता' : 'Qualification',
    experienceLabel: isHindi ? 'अनुभव (वर्ष)' : 'Experience (Years)',
    consentTitle: isHindi ? 'सहमति' : 'Consent',
    consentBody: isHindi 
      ? HINDI_UI.consentText 
      : 'I consent to share my educational profile and assessment responses with PathAI to generate personalized career recommendations.',
    selectState: isHindi ? '-- राज्य चुनें --' : '-- Select State --',
    selectDistrict: isHindi ? '-- जिला चुनें --' : '-- Select District --',
    selectTrade: isHindi ? '-- ट्रेड चुनें --' : '-- Select Trade --'
  }

  // Get available districts for selected state
  const districts = state ? DISTRICTS_BY_STATE[state] || [] : []

  // Handle state change
  const handleStateChange = (selectedState: string) => {
    setState(selectedState)
    setDistrict('') // Reset district
  }

  // Validation checks for advancing
  const isStep1Valid = !!language
  const isStep2Valid = !!email && email.includes('@') && password.length >= 6 && password === confirmPassword
  const isStep3Valid = name.trim().length >= 2 && !!trade && !!state && !!district && consentGiven

  const handleNext = () => {
    if (step === 1 && isStep1Valid) {
      setStep(2)
    } else if (step === 2) {
      if (!email.includes('@')) {
        setError('Enter a valid email address')
        return
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        return
      }
      setError('')
      setStep(3)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isStep3Valid) return

    setLoading(true)
    setError('')

    try {
      await register({
        email: email.trim().toLowerCase(),
        password,
        name: name.trim(),
        trade,
        state,
        district,
        language,
        qualification,
        experience_years: experienceYears,
        consent_given: consentGiven
      })

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <LoadingSpinner message={isHindi ? 'खाता बनाया जा रहा है...' : 'Creating your profile...'} />
      </div>
    )
  }

  return (
    <div className="flex-1 bg-surface flex flex-col p-6 max-w-2xl mx-auto w-full justify-center">
      
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold tracking-tight text-ink">{labels.title}</h2>
          <span className="text-xs font-bold text-brand-600 bg-brand-50 border border-brand-100 px-3 py-1 rounded-full">
            {labels.stepLabel} {step} / 3
          </span>
        </div>
        <div className="w-full bg-surface-border h-2 rounded-full overflow-hidden">
          <div 
            className="bg-brand-400 h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
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

      {/* STEP 1: Language selection */}
      {step === 1 && (
        <div className="flex-1 flex flex-col gap-6">
          <h3 className="text-lg font-semibold text-ink pl-3 border-l-4 border-brand-400">Choose Language / भाषा चुनें</h3>
          <div className="grid grid-cols-1 gap-3">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`py-4 px-6 rounded-2xl border text-left font-bold text-lg transition-all flex justify-between items-center duration-200 ${
                  language === lang.code 
                    ? 'border-brand-400 bg-brand-50 text-ink shadow-sm' 
                    : 'border-surface-border bg-white text-ink-secondary hover:border-brand-300'
                }`}
              >
                <span>{lang.label}</span>
                {language === lang.code && (
                  <span className="w-3 h-3 bg-brand-400 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={!isStep1Valid}
            className="w-full py-4 bg-brand-400 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold rounded-2xl text-lg mt-auto shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
          >
            {labels.next}
          </button>

          <p className="text-center text-xs text-ink-muted mt-2 font-medium">
            Already have an account? <span onClick={() => router.push('/auth/login')} className="text-brand-500 hover:underline font-bold cursor-pointer">Login</span>
          </p>
        </div>
      )}

      {/* STEP 2: Email and Password */}
      {step === 2 && (
        <div className="flex-1 flex flex-col gap-5">
          <h3 className="text-lg font-semibold text-ink pl-3 border-l-4 border-brand-400">Account details</h3>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide uppercase text-ink-muted">
              {labels.emailLabel} *
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
              {labels.passwordLabel} *
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

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide uppercase text-ink-muted">
              {labels.confirmPasswordLabel} *
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-surface-border rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 bg-white placeholder:text-ink-muted transition-colors"
            />
          </div>

          <div className="flex gap-3 mt-auto">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-4 border border-surface-border bg-surface-muted text-brand-600 font-medium rounded-2xl text-lg hover:bg-brand-50 hover:border-brand-300 transition-all duration-200"
            >
              {labels.back}
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!email || !password || !confirmPassword}
              className="flex-1 py-4 bg-brand-400 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold rounded-2xl text-lg shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
            >
              {labels.next}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Profile form */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5">
          <h3 className="text-lg font-semibold text-ink pl-3 border-l-4 border-brand-400">Profile Details</h3>
          
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide uppercase text-ink-muted">
              {labels.nameLabel} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ravi Kumar"
              className="w-full border border-surface-border rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 bg-white placeholder:text-ink-muted transition-colors"
            />
          </div>

          {/* Trade */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide uppercase text-ink-muted">
              {labels.tradeLabel} *
            </label>
            <select
              required
              value={trade}
              onChange={(e) => setTrade(e.target.value)}
              className="w-full border border-surface-border rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 bg-white transition-colors"
            >
              <option value="">{labels.selectTrade}</option>
              {TRADES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* State */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide uppercase text-ink-muted">
              {labels.stateLabel} *
            </label>
            <select
              required
              value={state}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full border border-surface-border rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 bg-white transition-colors"
            >
              <option value="">{labels.selectState}</option>
              {Object.keys(DISTRICTS_BY_STATE).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* District */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide uppercase text-ink-muted">
              {labels.districtLabel} *
            </label>
            <select
              required
              value={district}
              disabled={!state}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full border border-surface-border rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 bg-white transition-colors disabled:opacity-50"
            >
              <option value="">{labels.selectDistrict}</option>
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Qualification */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide uppercase text-ink-muted">
              {labels.qualificationLabel} *
            </label>
            <div className="flex gap-4">
              {['ITI', 'Polytechnic', 'Both'].map(q => (
                <label key={q} className="flex items-center gap-2 cursor-pointer text-ink-secondary select-none">
                  <input
                    type="radio"
                    name="qualification"
                    value={q}
                    checked={qualification === q}
                    onChange={() => setQualification(q)}
                    className="w-4 h-4 text-brand-400 focus:ring-brand-300 border-surface-border"
                  />
                  <span className="text-sm font-semibold">{q}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Experience Years */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide uppercase text-ink-muted">
              {labels.experienceLabel} *
            </label>
            <select
              value={experienceYears}
              onChange={(e) => setExperienceYears(parseInt(e.target.value))}
              className="w-full border border-surface-border rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 bg-white transition-colors"
            >
              {[0, 1, 2, 3, 4, 5].map(y => (
                <option key={y} value={y}>{y === 5 ? '5+' : y}</option>
              ))}
            </select>
          </div>

          {/* Consent */}
          <label className="flex items-start gap-3 mt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="w-5 h-5 rounded border-surface-border text-brand-600 focus:ring-brand-300 mt-0.5"
            />
            <span className="text-xs font-semibold text-ink-secondary select-none">
              {labels.consentBody}
            </span>
          </label>

          <div className="flex gap-3 mt-auto pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-4 border border-surface-border bg-surface-muted text-brand-600 font-medium rounded-2xl text-lg hover:bg-brand-50 hover:border-brand-300 transition-all duration-200"
            >
              {labels.back}
            </button>
            <button
              type="submit"
              disabled={!isStep3Valid}
              className="flex-1 py-4 bg-brand-400 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold rounded-2xl text-lg shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
            >
              {labels.submit}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
