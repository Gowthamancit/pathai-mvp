import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const trade = searchParams.get('trade')
  const skill = searchParams.get('skill')
  const language = searchParams.get('language') || 'en'
  const limit = parseInt(searchParams.get('limit') || '5')

  if (!trade || !skill) {
    return NextResponse.json(
      { error: 'trade and skill parameters required' },
      { status: 400 }
    )
  }

  const { data: questions, error } = await supabaseAdmin
    .from('questions')
    .select('*')
    .eq('trade', trade)
    .eq('skill', skill)
    .order('difficulty', { ascending: true })
    .limit(limit)

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }

  if (!questions || questions.length === 0) {
    return NextResponse.json(
      { error: `No questions found for ${trade} - ${skill}` },
      { status: 404 }
    )
  }

  // Shuffle questions for variety
  const shuffled = questions.sort(() => Math.random() - 0.5)

  return NextResponse.json({ 
    questions: shuffled,
    total: shuffled.length
  })
}
