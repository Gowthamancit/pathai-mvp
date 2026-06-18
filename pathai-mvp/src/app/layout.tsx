import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

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
      <body className={`${inter.className} bg-slate-900 flex justify-center min-h-screen`}>
        <div className="w-full max-w-[430px] min-h-screen bg-white flex flex-col shadow-2xl relative">
          <Navbar />
          <main className="flex-1 flex flex-col overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
