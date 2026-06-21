'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Award, Share2, ExternalLink } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import QRCode from 'react-qr-code'
import QRCodeLib from 'qrcode'
import { Document, Page, Text, View, StyleSheet, Image, PDFDownloadLink } from '@react-pdf/renderer'

// Create styles for PDF
const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#FFFFFF',
  },
  border: {
    borderWidth: 6,
    borderColor: '#0D1B2A',
    borderRadius: 8,
    padding: 30,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 15,
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    width: 24,
    height: 24,
    backgroundColor: '#0D1B2A',
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  brandName: {
    fontSize: 12,
    color: '#0D1B2A',
    fontWeight: 'bold',
  },
  subBrand: {
    fontSize: 8,
    color: '#64748B',
  },
  verifiedBadge: {
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#ECFDF5',
  },
  verifiedText: {
    fontSize: 7,
    color: '#059669',
    fontWeight: 'bold',
  },
  body: {
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0D1B2A',
    marginBottom: 15,
    letterSpacing: 1.5,
  },
  recipientLabel: {
    fontSize: 8,
    color: '#64748B',
    marginBottom: 5,
    letterSpacing: 1,
  },
  recipientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D1B2A',
    marginBottom: 15,
    textDecoration: 'underline',
  },
  skillLabel: {
    fontSize: 8,
    color: '#64748B',
    marginBottom: 5,
    letterSpacing: 1,
  },
  skillName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D1B2A',
  },
  tradeName: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  footerText: {
    fontSize: 8,
    color: '#475569',
  },
  qrContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  qrImage: {
    width: 70,
    height: 70,
    marginBottom: 4,
  },
  qrLabel: {
    fontSize: 6,
    color: '#64748B',
  }
})

interface CredentialDocProps {
  cred: any
  qrCodeDataUrl: string
}

// PDF Document component
const CredentialDocument = ({ cred, qrCodeDataUrl }: CredentialDocProps) => {
  const issuedDate = new Date(cred.issued_at).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={pdfStyles.page}>
        <View style={pdfStyles.border}>
          
          {/* Header */}
          <View style={pdfStyles.header}>
            <View style={pdfStyles.logoContainer}>
              <View style={pdfStyles.logoBox}>
                <Text style={pdfStyles.logoText}>P</Text>
              </View>
              <View>
                <Text style={pdfStyles.brandName}>PathAI</Text>
                <Text style={pdfStyles.subBrand}>Vernacular AI Career Navigator</Text>
              </View>
            </View>
            <View style={pdfStyles.verifiedBadge}>
              <Text style={pdfStyles.verifiedText}>✓ AI VERIFIED CREDENTIAL</Text>
            </View>
          </View>

          {/* Certificate Main Text */}
          <View style={pdfStyles.body}>
            <Text style={pdfStyles.title}>CERTIFICATE OF SKILL COMPETENCY</Text>
            
            <Text style={pdfStyles.recipientLabel}>THIS IS PROUDLY PRESENTED TO</Text>
            <Text style={pdfStyles.recipientName}>{cred.user_name || 'Learner'}</Text>
            
            <Text style={pdfStyles.skillLabel}>FOR SUCCESSFULLY CERTIFYING COMPETENCY IN</Text>
            <Text style={pdfStyles.skillName}>{cred.skill.toUpperCase()}</Text>
            <Text style={pdfStyles.tradeName}>{cred.trade} Trade</Text>
          </View>

          {/* Footer containing details and QR */}
          <View style={pdfStyles.footer}>
            <View style={pdfStyles.footerLeft}>
              <Text style={pdfStyles.footerText}>Proficiency Level: {cred.proficiency_level}</Text>
              <Text style={pdfStyles.footerText}>Assessment Score: {cred.score_percent}%</Text>
              <Text style={pdfStyles.footerText}>Issued On: {issuedDate}</Text>
              <Text style={pdfStyles.footerText}>Verification ID: {cred.id}</Text>
              <Text style={pdfStyles.footerText}>Issuer: PathAI — SahAI for Shiksha 2026</Text>
            </View>

            {/* QR Code section */}
            {qrCodeDataUrl && (
              <View style={pdfStyles.qrContainer}>
                <Image src={qrCodeDataUrl} style={pdfStyles.qrImage} />
                <Text style={pdfStyles.qrLabel}>Scan to Verify Authenticity</Text>
              </View>
            )}
          </View>

        </View>
      </Page>
    </Document>
  )
}

export default function CredentialsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [credentials, setCredentials] = useState<any[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedQR, setExpandedQR] = useState<string | null>(null)
  const [error, setError] = useState<boolean>(false)
  
  const [qrDataUrls, setQrDataUrls] = useState<Record<string, string>>({})
  const [isMounted, setIsMounted] = useState(false)

  const fetchCredentials = async () => {
    setLoading(true)
    setError(false)
    const userId = localStorage.getItem('pathai_user_id')
    if (!userId) {
      router.push('/auth/login')
      return
    }

    try {
      const { data, error } = await supabase
        .from('credentials')
        .select('*')
        .eq('user_id', userId)
        .order('issued_at', { ascending: false })

      if (error) throw error
      setCredentials(data || [])
    } catch (err) {
      console.error('Error fetching credentials:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setIsMounted(true)
    fetchCredentials()
  }, [router])

  useEffect(() => {
    const generateQRs = async () => {
      const urls: Record<string, string> = {}
      for (const credential of credentials) {
        try {
          const verifyUrl = `${window.location.origin}/verify/${credential.id}`
          const dataUrl = await QRCodeLib.toDataURL(verifyUrl, {
            margin: 1,
            width: 200,
            color: {
              dark: '#0D1B2A',
              light: '#FFFFFF'
            }
          })
          urls[credential.id] = dataUrl
        } catch (err) {
          console.error('Error generating QR code base64:', err)
        }
      }
      setQrDataUrls(urls)
    }

    if (credentials.length > 0) {
      generateQRs()
    }
  }, [credentials])

  const handleShare = (id: string, verificationUrl: string) => {
    navigator.clipboard.writeText(verificationUrl)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <LoadingSpinner message="Loading your credentials..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-500 font-medium mb-4">
          Failed to load credentials
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-teal-600 underline text-sm animate-pulse"
        >
          Try again
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
            My Certificates
          </h1>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Your earned skills and digital credentials
          </p>
        </div>

        {credentials.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No credentials yet
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Complete an assessment to earn your first verified credential
            </p>
            <a
              href="/jobs"
              className="inline-block bg-teal-600 text-white font-semibold text-sm rounded-xl px-5 py-3 transition-all duration-150 active:scale-95 shadow-sm shadow-teal-200"
            >
              Find Jobs & Start Assessment
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {credentials.map(credential => {
              const dateStr = new Date(credential.issued_at).toLocaleDateString()
              const verifyUrl = `${window.location.origin}/verify/${credential.id}`
              
              // Badge style mapping
              let badgeStyle = 'text-xs font-bold px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700'
              if (credential.proficiency_level === 'Advanced') {
                badgeStyle = 'text-xs font-bold px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700'
              } else if (credential.proficiency_level === 'Proficient') {
                badgeStyle = 'text-xs font-bold px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700'
              } else if (credential.proficiency_level === 'Developing') {
                badgeStyle = 'text-xs font-bold px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700'
              }

              return (
                <div 
                  key={credential.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900 tracking-tight capitalize">
                        {credential.skill}
                      </h3>
                      <p className="text-sm text-teal-600 font-semibold mt-0.5">
                        {credential.trade} Trade
                      </p>
                    </div>
                    <span className={badgeStyle}>
                      {credential.proficiency_level}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm mt-3 pt-3 border-t border-slate-100">
                    <span className="font-bold text-slate-700">Score: <span className="text-teal-600 font-black">{credential.score_percent}%</span></span>
                    <span className="text-slate-400 text-xs">Issued: {dateStr}</span>
                  </div>

                  {/* Three action buttons row */}
                  <div className="flex gap-2 mt-4">
                    {/* Verify button */}
                    <a 
                      href={verifyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 border border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 font-semibold py-2.5 rounded-xl text-xs transition-all"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Verify</span>
                    </a>

                    {/* Share Link button */}
                    <button
                      onClick={() => handleShare(credential.id, verifyUrl)}
                      className="flex-1 flex items-center justify-center gap-1.5 border border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 font-semibold py-2.5 rounded-xl text-xs transition-all"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>{copiedId === credential.id ? 'Copied!' : 'Share Link'}</span>
                    </button>

                    {/* Download PDF button */}
                    {isMounted && qrDataUrls[credential.id] && (
                      <PDFDownloadLink
                        document={<CredentialDocument cred={credential} qrCodeDataUrl={qrDataUrls[credential.id]} />}
                        fileName={`certificate-${credential.skill.replace(/\s+/g, '-')}.pdf`}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-all active:scale-95"
                      >
                        {({ loading }) => (loading ? 'Preparing...' : 'Download PDF')}
                      </PDFDownloadLink>
                    )}
                  </div>

                  {/* QR Code Section */}
                  {(() => {
                    const isExpanded = expandedQR === credential.id
                    
                    return (
                      <div className="mt-4 border-t border-slate-100 pt-4">
                        
                        {/* Show QR Code toggle button */}
                        <button
                          onClick={() => setExpandedQR(isExpanded ? null : credential.id)}
                          className="w-full flex items-center justify-between mt-4 pt-4 border-t border-slate-100 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <span>📱</span>
                            <span>Show QR Code for Verification</span>
                          </span>
                          <span className="text-lg">
                            {isExpanded ? '▲' : '▼'}
                          </span>
                        </button>

                        {/* QR code expanded view */}
                        {isExpanded && (
                          <div className="mt-4 flex flex-col items-center gap-4">
                            
                            {/* QR code */}
                            <div className="bg-white p-4 rounded-2xl shadow-md border-2 border-teal-100">
                              <QRCode
                                value={verifyUrl}
                                size={180}
                                bgColor="#FFFFFF"
                                fgColor="#0D1B2A"
                                level="M"
                              />
                            </div>
                            
                            {/* Instruction */}
                            <p className="text-xs text-slate-500 text-center px-4">
                              Scan this QR code to verify the authenticity of this credential
                            </p>
                            
                            {/* Verify URL display */}
                            <div className="w-full bg-slate-50 rounded-xl p-3">
                              <p className="text-xs text-slate-400 mb-1 font-semibold uppercase tracking-widest">
                                Verification URL
                              </p>
                              <p className="text-xs font-mono text-slate-600 break-all">
                                {verifyUrl}
                              </p>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-2 w-full">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(verifyUrl)
                                  alert('Verification link copied!')
                                }}
                                className="flex-1 border-2 border-teal-500 text-teal-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-teal-50 transition-colors"
                              >
                                Copy Link
                              </button>
                              
                              <a
                                href={verifyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 bg-teal-600 text-white font-semibold py-2.5 rounded-xl text-sm text-center hover:bg-teal-700 transition-colors"
                              >
                                Open & Verify
                              </a>
                            </div>

                          </div>
                        )}

                      </div>
                    )
                  })()}
                </div>
              )
            })}
          </div>
        )}

        {/* Back to Dashboard button */}
        <button
          onClick={() => router.push('/dashboard')}
          className="w-full mt-6 border border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-600 font-semibold py-3.5 rounded-2xl text-sm transition-all"
        >
          Back to Dashboard
        </button>

      </div>
    </div>
  )
}
