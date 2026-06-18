import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
          {children}
        </div>
      </body>
    </html>
  )
}
