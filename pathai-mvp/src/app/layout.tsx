import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { AuthProvider } from '@/context/AuthContext'

const manrope = Manrope({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'PathAI — Vernacular AI Career Navigator',
  description: 'Voice-first AI career guidance for ITI and polytechnic graduates',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${manrope.className} antialiased bg-slate-900 flex justify-center min-h-screen`}>
        <div className="w-full max-w-[430px] min-h-screen bg-white flex flex-col shadow-2xl relative">
          <AuthProvider>
            <Navbar />
            <main className="flex-1 flex flex-col overflow-y-auto">
              {children}
            </main>
          </AuthProvider>
        </div>
      </body>
    </html>
  )
}
