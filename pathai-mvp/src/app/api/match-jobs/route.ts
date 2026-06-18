import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { callGeminiJSON } from '@/lib/gemini'
import { JobMatch } from '@/lib/types'
import { PROMPTS } from '@/lib/prompts'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id } = body

    // Fetch user profile
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Fetch all jobs matching user's trade (exact + adjacent trades)
    const { data: jobs, error: jobsError } = await supabaseAdmin
      .from('jobs')
      .select('*')
      .eq('trade', user.trade)
      .eq('is_active', true)
      .limit(10)

    if (jobsError) throw jobsError

    if (!jobs || jobs.length === 0) {
      // Fallback: get any 5 jobs if no trade match
      const { data: fallbackJobs } = await supabaseAdmin
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .limit(5)
      
      return NextResponse.json({ 
        matches: [],
        message: 'No jobs found for your trade in our database yet.'
      })
    }

    // Use Gemini to calculate match scores
    const prompt = PROMPTS.jobMatching(
      {
        name: user.name,
        trade: user.trade,
        qualification: user.qualification,
        experience_years: user.experience_years,
        district: user.district,
        state: user.state
      },
      jobs.map(job => ({
        title: job.title,
        employer: job.employer,
        district: job.district,
        state: job.state,
        required_skills: job.required_skills,
        salary_min: job.salary_min,
        salary_max: job.salary_max
      }))
    )

    const geminiResult = await callGeminiJSON<{
      matches: Array<{
        job_index: number
        match_percent: number
        matched_skills: string[]
        gap_skills: string[]
        readiness_percent: number
      }>
    }>(prompt)

    // Combine Gemini results with job data
    const jobMatches: JobMatch[] = geminiResult.matches
      .filter(m => m.job_index < jobs.length)
      .map(m => ({
        job: jobs[m.job_index],
        match_percent: Math.min(100, Math.max(0, m.match_percent)),
        matched_skills: m.matched_skills || [],
        gap_skills: m.gap_skills || [],
        readiness_percent: Math.min(100, Math.max(0, m.readiness_percent))
      }))
      .sort((a, b) => b.match_percent - a.match_percent)
      .slice(0, 3) // Return top 3

    return NextResponse.json({ matches: jobMatches })

  } catch (error: any) {
    console.error('Match jobs error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to match jobs' },
      { status: 500 }
    )
  }
}
