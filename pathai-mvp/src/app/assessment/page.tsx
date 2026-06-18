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
      <div className="flex-1 bg-surface flex items-center justify-center p-6">
        <LoadingSpinner message="Grading and preparing assessment..." />
      </div>
    )
  }

  if (error || questions.length === 0) {
    return (
      <div className="flex-1 bg-surface p-6 flex flex-col items-center justify-center text-center gap-4">
        <div className="bg-danger-light border border-danger-border rounded-2xl p-6 text-center w-full max-w-sm">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-danger mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className="font-bold text-lg text-danger mb-1">Error</p>
          <p className="text-sm text-red-600">{error || 'Could not load questions.'}</p>
        </div>
        <button
          onClick={fetchQuestions}
          className="px-6 py-2.5 bg-brand-400 hover:bg-brand-500 text-white font-semibold rounded-xl text-sm shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
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
    <div className="flex-1 bg-surface flex flex-col p-6 max-w-2xl mx-auto w-full">
      
      {/* Progress header */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-xs font-bold text-ink-muted uppercase tracking-widest mb-2">
          <span>{skill} Test</span>
          <span>Question {currentIndex + 1} of {questions.length}</span>
        </div>
        <div className="w-full bg-surface-muted h-2 rounded-full overflow-hidden border border-surface-border">
          <div 
            className="bg-brand-400 h-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Text */}
      <div className="bg-surface-card border border-surface-border p-6 rounded-2xl shadow-sm mb-6">
        <h2 className="text-base font-bold text-ink leading-snug">
          {currentQuestion.question_text}
        </h2>
      </div>

      {/* Option Buttons */}
      <div className="flex flex-col gap-3">
        {options.map((opt, i) => {
          const isSelected = selectedOption === i
          const isCorrect = opt.letter === correctLetter
          
          let cardStyle = 'border-surface-border bg-white text-ink hover:border-brand-300'
          let icon = null

          if (submitted) {
            if (isCorrect) {
              cardStyle = 'border-success bg-success-light text-success'
              icon = <CheckCircle2 className="w-5 h-5 text-success" />
            } else if (isSelected && !isCorrect) {
              cardStyle = 'border-danger bg-danger-light text-danger'
              icon = <XCircle className="w-5 h-5 text-danger" />
            } else {
              cardStyle = 'border-surface-border bg-surface-muted text-ink-muted opacity-60'
            }
          } else if (isSelected) {
            cardStyle = 'border-brand-400 bg-brand-50/50 text-ink shadow-sm'
          }

          return (
            <div key={opt.key} className="flex gap-2 items-center w-full">
              <button
                type="button"
                disabled={submitted}
                onClick={() => setSelectedOption(i)}
                className={`flex-1 py-4 px-5 rounded-2xl border text-left font-bold text-sm transition-all duration-200 flex justify-between items-center ${cardStyle}`}
              >
                <div className="flex items-start gap-3">
                  <span className="uppercase text-ink-muted font-black mr-1">{opt.letter}.</span>
                  <span>{opt.text}</span>
                </div>
                {icon}
              </button>

              {/* Voice button */}
              {recognition && !submitted && (
                <button
                  type="button"
                  onClick={() => startVoiceListening(i)}
                  className={`p-4 rounded-2xl border flex items-center justify-center transition-all duration-200 active:scale-95 ${
                    listeningOption === i
                      ? 'bg-danger text-white animate-pulse border-danger'
                      : 'bg-white text-brand-600 border-surface-border hover:bg-brand-50 hover:border-brand-300'
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
        <div className="mt-4 bg-brand-50 text-brand-700 px-4 py-2 rounded-xl text-center text-xs font-bold animate-pulse border border-brand-100 flex items-center justify-center gap-1.5">
          <Mic className="w-3.5 h-3.5" />
          <span>Listening... Say &quot;A&quot;, &quot;B&quot;, &quot;C&quot;, or &quot;D&quot;</span>
        </div>
      )}

      {/* Explanation block */}
      {submitted && (
        <div className="mt-6 bg-brand-50 border border-brand-100 rounded-2xl p-5 text-xs text-brand-800 leading-relaxed shadow-sm">
          <p className="font-bold mb-1 text-brand-900">Explanation:</p>
          <p>{currentQuestion.explanation || 'No additional explanation available.'}</p>
        </div>
      )}

      {/* Action buttons at bottom */}
      <div className="mt-auto pt-8">
        {!submitted ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedOption === null}
            className="w-full py-4 bg-brand-900 hover:bg-brand-950 text-white disabled:opacity-40 font-semibold rounded-2xl text-lg transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="w-full py-4 bg-brand-400 hover:bg-brand-500 text-white font-semibold rounded-2xl text-lg transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
          >
            {currentIndex + 1 < questions.length ? 'Next Question' : 'View Results'}
          </button>
        )}
      </div>

    </div>
  )
}

export default function AssessmentPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 bg-surface flex items-center justify-center p-6">
        <LoadingSpinner message="Loading assessment..." />
      </div>
    }>
      <AssessmentContent />
    </Suspense>
  )
}
