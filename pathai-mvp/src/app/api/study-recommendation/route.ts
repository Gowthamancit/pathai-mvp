import { NextRequest, NextResponse } from 'next/server'
import { callGeminiJSON } from '@/lib/gemini'
import { PROMPTS } from '@/lib/prompts'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { trade, skill, severity } = body

    if (!trade || !skill) {
      return NextResponse.json(
        { error: 'trade and skill are required' },
        { status: 400 }
      )
    }

    const recommendation = await callGeminiJSON<{
      what_to_study: string
      why_it_matters: string
      quick_tip: string
      estimated_study_time: string
      free_resources: string[]
      study_hint_hindi: string
    }>(
      PROMPTS.studyRecommendation(
        trade,
        skill,
        severity || 0.5
      )
    )

    return NextResponse.json({ recommendation })

  } catch (error: any) {
    console.error('Study recommendation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate recommendation' },
      { status: 500 }
    )
  }
}
