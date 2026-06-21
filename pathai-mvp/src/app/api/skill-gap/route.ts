import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { callGeminiJSON } from '@/lib/gemini'
import { GapAnalysis } from '@/lib/types'
import { PROMPTS } from '@/lib/prompts'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, job_id } = body

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single()

    const { data: job } = await supabaseAdmin
      .from('jobs')
      .select('*')
      .eq('id', job_id)
      .single()

    if (!user || !job) {
      return NextResponse.json(
        { error: 'User or job not found' }, 
        { status: 404 }
      )
    }

    // Check if assessment questions exist for this trade/skills
    const { data: availableQuestions } = await supabaseAdmin
      .from('questions')
      .select('skill')
      .eq('trade', user.trade)

    const skillsWithQuestions = [
      ...new Set(availableQuestions?.map((q: any) => q.skill as string) || [])
    ] as string[]

    const prompt = PROMPTS.skillGapAnalysis(
      {
        trade: user.trade,
        qualification: user.qualification,
        experience_years: user.experience_years
      },
      {
        title: job.title,
        required_skills: job.required_skills
      },
      skillsWithQuestions
    )

    const gapAnalysis = await callGeminiJSON<GapAnalysis>(prompt)

    return NextResponse.json({ 
      gap: gapAnalysis,
      user: { name: user.name, trade: user.trade },
      job: { title: job.title, employer: job.employer }
    })

  } catch (error: any) {
    console.error('Skill gap error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to calculate skill gap' },
      { status: 500 }
    )
  }
}
