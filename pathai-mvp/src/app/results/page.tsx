'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Award, Share2, Download, ArrowLeft, RefreshCw } from 'lucide-react'
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer'

// React-PDF styles
const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#F8FAFC',
    fontFamily: 'Helvetica',
  },
  container: {
    border: '4px solid #0F172A',
    padding: 30,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #F1F5F9',
    paddingBottom: 15,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 10,
    color: '#64748B',
  },
  body: {
    alignItems: 'center',
    marginVertical: 40,
  },
  certTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 20,
    textAlign: 'center',
  },
  presented: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
  },
  holder: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D9488',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#334155',
    lineHeight: 1.6,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  badge: {
    backgroundColor: '#0D9488',
    color: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    borderTop: '1px solid #F1F5F9',
    paddingTop: 15,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#94A3B8',
    textAlign: 'center',
  }
})

// React-PDF Document Component
const CredentialPDF = ({ name, skill, trade, score, level, date, url }: any) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.container}>
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.logo}>PathAI</Text>
          <Text style={pdfStyles.subtitle}>SahAI for Shiksha 2026</Text>
        </View>
        <View style={pdfStyles.body}>
          <Text style={pdfStyles.certTitle}>SKILL CERTIFICATE</Text>
          <Text style={pdfStyles.presented}>This certificate is proudly presented to</Text>
          <Text style={pdfStyles.holder}>{name}</Text>
          <Text style={pdfStyles.detailText}>
            for demonstrating {level} proficiency in the skill of "{skill}" ({trade} trade) 
            with a score of {score}% on the PathAI Assessment.
          </Text>
          <Text style={pdfStyles.badge}>AI VERIFIED ✓</Text>
        </View>
        <View style={pdfStyles.footer}>
          <Text style={[pdfStyles.footerText, { marginBottom: 4 }]}>
            Verification Link: {url}
          </Text>
          <Text style={pdfStyles.footerText}>
            PathAI Career Navigator Platform · Secure digital credential
          </Text>
        </View>
      </View>
    </Page>
  </Document>
)

export default function ResultsPage() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const resultsStr = localStorage.getItem('pathai_assessment_results')
    if (resultsStr) {
      setData(JSON.parse(resultsStr))
    } else {
      router.push('/dashboard')
    }
  }, [router])

  if (!data) return null

  const { passed, score_percent, correct, total, results, assessment, credential, ai_feedback } = data

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const verificationUrl = credential ? `${appUrl}/verify/${credential.id}` : ''

  const handleCopyLink = () => {
    if (!verificationUrl) return
    navigator.clipboard.writeText(verificationUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTryAgain = () => {
    router.push(`/assessment?skill=${encodeURIComponent(assessment.skill)}&trade=${encodeURIComponent(assessment.trade)}`)
  }

  return (
    <div className="flex-1 bg-surface flex flex-col p-6 max-w-2xl mx-auto w-full">
      
      {passed ? (
        // PASS STATE
        <div className="flex-grow flex flex-col gap-6 items-center w-full">
          
          <div className="text-center mt-4">
            <h1 className="text-4xl font-bold text-success tracking-tight">
              बधाई हो! 🎉
            </h1>
            <p className="text-sm font-semibold text-ink-muted mt-1 uppercase tracking-wider">
              You Passed the Assessment!
            </p>
          </div>

          <div className="text-center my-2">
            <span className="text-6xl font-black text-warning">{score_percent}%</span>
            <p className="text-xs text-ink-muted font-bold mt-1">SCORE ACHIEVED</p>
          </div>

          {/* AI Feedback Section */}
          {ai_feedback && (
            <div className="w-full bg-surface-card border border-surface-border rounded-3xl p-6 shadow-sm flex flex-col gap-4 hover:shadow-md transition-all duration-200">
              <div>
                <span className="text-[10px] font-bold text-brand-600 bg-brand-50 border border-brand-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  AI FEEDBACK / एआई सुझाव
                </span>
                <h3 className="text-base font-bold text-ink mt-2">
                  Your Performance Analysis / आपका प्रदर्शन विश्लेषण
                </h3>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-bold text-brand-900 leading-relaxed bg-brand-50/30 p-3.5 rounded-xl border border-brand-100/50">
                  {ai_feedback.overall_feedback}
                </p>
                {ai_feedback.feedback_hindi && (
                  <p className="text-xs text-ink-secondary italic leading-relaxed p-3 bg-white/60 border border-surface-border rounded-xl">
                    {ai_feedback.feedback_hindi}
                  </p>
                )}
              </div>

              {ai_feedback.strong_points && ai_feedback.strong_points.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Strengths:</span>
                  <ul className="list-disc pl-5 text-xs text-success font-semibold flex flex-col gap-1">
                    {ai_feedback.strong_points.map((pt: string, idx: number) => (
                      <li key={idx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {ai_feedback.improvement_areas && ai_feedback.improvement_areas.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Focus on:</span>
                  <ul className="list-disc pl-5 text-xs text-warning font-semibold flex flex-col gap-1">
                    {ai_feedback.improvement_areas.map((pt: string, idx: number) => (
                      <li key={idx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {ai_feedback.encouragement && (
                <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 text-xs font-semibold text-brand-850 text-center leading-relaxed">
                  {ai_feedback.encouragement}
                </div>
              )}

              {ai_feedback.next_steps && (
                <div className="text-xs font-semibold text-ink flex items-start gap-1">
                  <span className="text-brand-600 font-bold">→</span>
                  <span>{ai_feedback.next_steps}</span>
                </div>
              )}
            </div>
          )}

          {/* Certificate Mockup Card */}
          <div className="w-full bg-[#0D1B2A] text-white rounded-3xl p-6 border-4 border-brand-400 shadow-xl relative overflow-hidden flex flex-col gap-6">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-800 pb-4">
              <span className="text-lg font-black tracking-tight text-brand-400">PathAI</span>
              <span className="text-[10px] font-black uppercase text-brand-400 bg-brand-950/80 px-2 py-0.5 rounded shadow-sm border border-brand-800">
                AI Verified ✓
              </span>
            </div>

            {/* Core details */}
            <div className="text-center py-2 flex flex-col gap-2">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Skill Certificate
              </span>
              <span className="text-xl font-bold text-white leading-snug">
                {credential?.user_name}
              </span>
              <span className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
                has proven proficiency in <span className="font-bold text-brand-300">"{credential?.skill}"</span> ({credential?.trade} trade) at an <span className="font-bold text-brand-300">{credential?.proficiency_level}</span> level.
              </span>
            </div>

            {/* Verification Footer */}
            <div className="flex flex-col gap-1 border-t border-gray-800 pt-4 text-[9px] text-gray-500 text-center font-medium">
              <span>GENUINE VERIFIABLE CREDENTIAL</span>
              <span className="truncate max-w-[280px] mx-auto text-brand-400 font-bold select-all">
                {verificationUrl}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="w-full flex flex-col gap-3 mt-4">
            
            {/* Share link button */}
            <button
              onClick={handleCopyLink}
              className="w-full py-4 bg-brand-400 hover:bg-brand-500 text-white font-semibold rounded-2xl text-lg flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
            >
              <Share2 className="w-5 h-5" />
              <span>{copied ? 'Copied Link!' : 'Share Certificate'}</span>
            </button>

            {/* Download PDF link */}
            {isClient && credential && (
              <PDFDownloadLink
                document={
                  <CredentialPDF
                    name={credential.user_name}
                    skill={credential.skill}
                    trade={credential.trade}
                    score={credential.score_percent}
                    level={credential.proficiency_level}
                    date={new Date(credential.issued_at).toLocaleDateString()}
                    url={verificationUrl}
                  />
                }
                fileName={`pathai-certificate-${credential.id.slice(0,8)}.pdf`}
                className="w-full py-4 bg-brand-900 hover:bg-brand-950 text-white font-semibold rounded-2xl text-lg flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 text-center"
              >
                {({ loading }) => (
                  <>
                    <Download className="w-5 h-5" />
                    <span>{loading ? 'Generating...' : 'Download PDF'}</span>
                  </>
                )}
              </PDFDownloadLink>
            )}

            {/* Back to Dashboard */}
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-4 bg-surface-muted hover:bg-brand-55/40 text-brand-600 font-semibold rounded-2xl text-lg transition-all duration-200 active:scale-95 border border-surface-border hover:border-brand-300"
            >
              Back to Dashboard
            </button>
          </div>

        </div>
      ) : (
        // FAIL STATE
        <div className="flex-grow flex flex-col gap-6 items-center w-full">
          
          <div className="text-center mt-4">
            <XCircle className="w-16 h-16 text-danger mx-auto mb-2 animate-bounce" />
            <h1 className="text-3xl font-bold tracking-tight text-ink">
              Keep Going! 💪
            </h1>
            <p className="text-sm font-semibold text-ink-secondary mt-1">
              You scored {score_percent}%
            </p>
            <div className="mt-2.5 inline-block">
              <span className="text-xs text-danger font-bold bg-danger-light border border-danger-border px-3.5 py-1.5 rounded-full">
                You need 60% to pass and earn a certificate.
              </span>
            </div>
          </div>

          {/* AI Feedback Section */}
          {ai_feedback && (
            <div className="w-full bg-surface-card border border-surface-border rounded-3xl p-6 shadow-sm flex flex-col gap-4 hover:shadow-md transition-all duration-200">
              <div>
                <span className="text-[10px] font-bold text-brand-600 bg-brand-50 border border-brand-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  AI FEEDBACK / एआई सुझाव
                </span>
                <h3 className="text-base font-bold text-ink mt-2">
                  Your Performance Analysis / आपका प्रदर्शन विश्लेषण
                </h3>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-bold text-brand-900 leading-relaxed bg-brand-50/30 p-3.5 rounded-xl border border-brand-100/50">
                  {ai_feedback.overall_feedback}
                </p>
                {ai_feedback.feedback_hindi && (
                  <p className="text-xs text-ink-secondary italic leading-relaxed p-3 bg-white/60 border border-surface-border rounded-xl">
                    {ai_feedback.feedback_hindi}
                  </p>
                )}
              </div>

              {ai_feedback.strong_points && ai_feedback.strong_points.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Strengths:</span>
                  <ul className="list-disc pl-5 text-xs text-success font-semibold flex flex-col gap-1">
                    {ai_feedback.strong_points.map((pt: string, idx: number) => (
                      <li key={idx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {ai_feedback.improvement_areas && ai_feedback.improvement_areas.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Focus on:</span>
                  <ul className="list-disc pl-5 text-xs text-warning font-semibold flex flex-col gap-1">
                    {ai_feedback.improvement_areas.map((pt: string, idx: number) => (
                      <li key={idx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {ai_feedback.encouragement && (
                <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 text-xs font-semibold text-brand-850 text-center leading-relaxed">
                  {ai_feedback.encouragement}
                </div>
              )}

              {ai_feedback.next_steps && (
                <div className="text-xs font-semibold text-ink flex items-start gap-1">
                  <span className="text-brand-600 font-bold">→</span>
                  <span>{ai_feedback.next_steps}</span>
                </div>
              )}
            </div>
          )}

          {/* Question Review */}
          <div className="w-full flex flex-col gap-4 mt-2">
            <h3 className="text-xs font-bold text-ink-muted uppercase tracking-wider">Question Review</h3>
            {results.map((res: any, idx: number) => (
              <div 
                key={idx}
                className={`p-5 rounded-2xl border ${
                  res.is_correct 
                    ? 'bg-success-light/35 border-success-border' 
                    : 'bg-danger-light/35 border-danger-border'
                } flex flex-col gap-2.5 hover:shadow-sm transition-all duration-200`}
              >
                <div className="flex justify-between items-start gap-3">
                  <span className="text-xs font-bold text-ink leading-snug">
                    {idx + 1}. {res.question}
                  </span>
                  {res.is_correct ? (
                    <span className="text-[10px] font-bold uppercase text-success bg-white px-2.5 py-0.5 rounded-full border border-success-border shadow-sm">Correct</span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase text-danger bg-white px-2.5 py-0.5 rounded-full border border-danger-border shadow-sm">Incorrect</span>
                  )}
                </div>
                
                <div className="text-xs text-ink-secondary">
                  <p>Your Answer: <span className="font-bold uppercase text-ink">{res.user_answer}</span></p>
                  <p>Correct Answer: <span className="font-bold uppercase text-success">{res.correct_answer}</span></p>
                </div>
                
                {res.explanation && (
                  <p className="text-[10px] text-ink-muted leading-relaxed border-t border-surface-border pt-2 italic">
                    {res.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="w-full flex flex-col gap-3 mt-4">
            <button
              onClick={handleTryAgain}
              className="w-full py-4 bg-brand-400 hover:bg-brand-500 text-white font-semibold rounded-2xl text-lg flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
            >
              <RefreshCw className="w-5 h-5 animate-spin-slow" />
              <span>Try Again</span>
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-4 bg-surface-muted hover:bg-brand-55/40 text-brand-600 font-semibold rounded-2xl text-lg transition-all duration-200 active:scale-95 border border-surface-border hover:border-brand-300"
            >
              Back to Dashboard
            </button>
          </div>

        </div>
      )}

    </div>
  )
}
