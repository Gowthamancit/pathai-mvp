'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Mic, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

function AssessmentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const trade = searchParams.get('trade')
  const skill = searchParams.get('skill')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [questions, setQuestions] = useState<any[]>([])
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState<string[]>([])
  
  // Voice recognition states
  const [recognition, setRecognition] = useState<any>(null)
  const [listeningOption, setListeningOption] = useState<number | null>(null)

  useEffect(() => {
    // Check voice support
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const rec = new SpeechRecognition()
        rec.continuous = false
        rec.interimResults = false
        rec.lang = 'en-IN'
        setRecognition(rec)
      }
    }
  }, [])

  const fetchQuestions = async () => {
    if (!trade || !skill) {
      setError('Missing trade or skill information.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/questions?trade=${encodeURIComponent(trade)}&skill=${encodeURIComponent(skill)}&limit=5`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch questions')
      }

      setQuestions(data.questions || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load questions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [router, trade, skill])

  const startVoiceListening = (optIndex: number) => {
    if (!recognition) return
    setListeningOption(optIndex)

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim()
      console.log('Spoken:', transcript)

      const firstChar = transcript.charAt(0)
      if (firstChar === 'a' || transcript.includes('option a') || transcript.includes('apple')) {
        setSelectedOption(0)
      } else if (firstChar === 'b' || transcript.includes('option b') || transcript.includes('boy')) {
        setSelectedOption(1)
      } else if (firstChar === 'c' || transcript.includes('option c') || transcript.includes('cat')) {
        setSelectedOption(2)
      } else if (firstChar === 'd' || transcript.includes('option d') || transcript.includes('dog')) {
        setSelectedOption(3)
      }
    }

    recognition.onerror = () => {
      setListeningOption(null)
    }

    recognition.onend = () => {
      setListeningOption(null)
    }

    recognition.start()
  }

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return
    setSubmitted(true)
  }

  const handleNextQuestion = async () => {
    const letters = ['a', 'b', 'c', 'd']
    const optionLetter = letters[selectedOption!]
    const updatedAnswers = [...answers, optionLetter]
    setAnswers(updatedAnswers)

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1)
      setSelectedOption(null)
      setSubmitted(false)
    } else {
      // Last question completed, submit assessment
      setLoading(true)
      const userId = localStorage.getItem('pathai_user_id')

      try {
        const response = await fetch('/api/assessments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            skill,
            trade,
            answers: updatedAnswers,
            questions
          })
        })

        const resData = await response.json()

        if (!response.ok) {
          throw new Error(resData.error || 'Failed to submit assessment')
        }

        // Save results to localStorage
        localStorage.setItem('pathai_assessment_results', JSON.stringify(resData))
        
        // Go to results
        router.push('/results')
      } catch (err: any) {
        setError(err.message || 'Something went wrong during grading')
        setLoading(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <LoadingSpinner message="Grading and preparing assessment..." />
      </div>
    )
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center text-center gap-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center w-full max-w-sm">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-500 mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className="font-bold text-lg text-red-500 mb-1">Error</p>
          <p className="text-sm text-red-600">{error || 'Could not load questions.'}</p>
        </div>
        <button
          onClick={fetchQuestions}
          className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
        >
          Retry
        </button>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const options = [
    { key: 0, text: currentQuestion.option_a, letter: 'a' },
    { key: 1, text: currentQuestion.option_b, letter: 'b' },
    { key: 2, text: currentQuestion.option_c, letter: 'c' },
    { key: 3, text: currentQuestion.option_d, letter: 'd' }
  ]

  const correctLetter = currentQuestion.correct_option.toLowerCase()

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-4 py-5">
        
        {/* Progress header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4 text-xs font-bold tracking-widest uppercase text-slate-400">
            <span>{skill} Test</span>
            <span>Question {currentIndex + 1} of {questions.length}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
            <div 
              className="bg-gradient-to-r from-teal-400 to-teal-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
          <h2 className="text-base font-bold text-slate-900 leading-relaxed">
            {currentQuestion.question_text}
          </h2>
        </div>

        {/* Option Buttons */}
        <div className="space-y-3">
          {options.map((opt, i) => {
            const isSelected = selectedOption === i
            const isCorrect = opt.letter === correctLetter
            
            let btnClasses = "w-full flex items-center justify-between gap-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-teal-300 rounded-2xl px-5 py-4 text-left transition-all duration-150 group"
            let badgeClasses = "w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-black text-slate-500 flex-shrink-0 group-hover:bg-teal-50 group-hover:border-teal-200 group-hover:text-teal-600 transition-colors"
            let textClasses = "text-sm font-semibold text-slate-700 group-hover:text-slate-900"
            let icon = null

            if (submitted) {
              if (isCorrect) {
                btnClasses += " !border-emerald-500 !bg-emerald-50"
                badgeClasses += " !bg-emerald-500 !border-emerald-500 !text-white"
                textClasses += " !text-emerald-800"
                icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              } else if (isSelected && !isCorrect) {
                btnClasses += " !border-red-400 !bg-red-50"
                badgeClasses += " !bg-red-500 !border-red-500 !text-white"
                textClasses += " !text-red-800"
                icon = <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              } else {
                btnClasses += " opacity-60 pointer-events-none"
                badgeClasses += " opacity-60"
                textClasses += " opacity-60"
              }
            } else if (isSelected) {
              btnClasses += " !border-teal-500 !bg-teal-50"
              badgeClasses += " !bg-teal-500 !border-teal-500 !text-white"
              textClasses += " !text-teal-800"
            }

            return (
              <div key={opt.key} className="flex gap-2 items-center w-full">
                <button
                  type="button"
                  disabled={submitted}
                  onClick={() => setSelectedOption(i)}
                  className={btnClasses}
                >
                  <div className="flex items-center gap-3">
                    <span className={badgeClasses}>{opt.letter.toUpperCase()}</span>
                    <span className={textClasses}>{opt.text}</span>
                  </div>
                  {icon}
                </button>

                {/* Voice button */}
                {recognition && !submitted && (
                  <button
                    type="button"
                    onClick={() => startVoiceListening(i)}
                    className={`ml-auto w-8 h-8 rounded-xl border flex items-center justify-center transition-all flex-shrink-0 ${
                      listeningOption === i
                        ? 'bg-red-500 text-white animate-pulse border-red-500'
                        : 'border-slate-200 text-slate-400 hover:text-teal-500 hover:border-teal-300 hover:bg-teal-50'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Listening Banner */}
        {listeningOption !== null && (
          <div className="mt-4 bg-teal-50 text-teal-700 px-4 py-2 rounded-xl text-center text-xs font-bold animate-pulse border border-teal-200 flex items-center justify-center gap-1.5">
            <Mic className="w-3.5 h-3.5" />
            <span>Listening... Say &quot;A&quot;, &quot;B&quot;, &quot;C&quot;, or &quot;D&quot;</span>
          </div>
        )}

        {/* Explanation block */}
        {submitted && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mt-4 text-sm text-blue-800 leading-relaxed">
            <p className="font-bold mb-1 text-blue-900">Explanation:</p>
            <p>{currentQuestion.explanation || 'No additional explanation available.'}</p>
          </div>
        )}

        {/* Action buttons at bottom */}
        <div className="pt-8">
          {!submitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className={`w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-bold py-4 rounded-2xl text-sm transition-all duration-150 active:scale-95 shadow-md shadow-teal-100 mt-5 ${
                selectedOption === null ? 'opacity-40 cursor-not-allowed active:scale-100' : ''
              }`}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl text-sm transition-all duration-150 active:scale-95 mt-3"
            >
              {currentIndex + 1 < questions.length ? 'Next Question' : 'View Results'}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

export default function AssessmentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <LoadingSpinner message="Loading assessment..." />
      </div>
    }>
      <AssessmentContent />
    </Suspense>
  )
}
