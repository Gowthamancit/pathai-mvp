import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { callGeminiJSON } from '@/lib/gemini'
import { PROMPTS } from '@/lib/prompts'

function getProficiencyLevel(score: number): string {
  if (score >= 85) return 'Advanced'
  if (score >= 70) return 'Proficient'
  if (score >= 60) return 'Developing'
  return 'Beginner'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, skill, trade, answers, questions } = body

    if (!user_id || !skill || !trade || !answers || !questions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate score
    let correct = 0
    const results = questions.map((q: any, index: number) => {
      const isCorrect = answers[index]?.toLowerCase() === q.correct_option.toLowerCase()
      if (isCorrect) correct++
      return {
        question: q.question_text,
        user_answer: answers[index],
        correct_answer: q.correct_option,
        is_correct: isCorrect,
        explanation: q.explanation
      }
    })

    const scorePercent = Math.round((correct / questions.length) * 100)
    const passed = scorePercent >= 60

    // Generate AI feedback
    let aiFeedback = null
    try {
      aiFeedback = await callGeminiJSON<{
        overall_feedback: string
        strong_points: string[]
        improvement_areas: string[]
        encouragement: string
        next_steps: string
        feedback_hindi: string
      }>(
        PROMPTS.assessmentFeedback(
          trade,
          skill,
          scorePercent,
          correct,
          questions.length,
          passed,
          results.map((r: any) => ({
            question: r.question,
            is_correct: r.is_correct,
            explanation: r.explanation
          }))
        )
      )
    } catch (feedbackError) {
      // Feedback is non-critical — do not fail the whole assessment
      // if Gemini fails here. Log and continue.
      console.error('AI feedback generation failed:', feedbackError)
      aiFeedback = {
        overall_feedback: passed 
          ? `Great work! You scored ${scorePercent}% on ${skill}.`
          : `You scored ${scorePercent}%. Review the explanations and try again.`,
        strong_points: [],
        improvement_areas: [],
        encouragement: `Keep working towards your ${trade} career goal!`,
        next_steps: passed 
          ? 'Move on to the next skill assessment.'
          : 'Review the incorrect answers and their explanations carefully.',
        feedback_hindi: passed
          ? `बहुत अच्छे! आपने ${scorePercent}% अंक प्राप्त किए।`
          : `आपने ${scorePercent}% अंक प्राप्त किए। दोबारा कोशिश करें।`
      }
    }

    // Save assessment
    const { data: assessment, error: assessError } = await supabaseAdmin
      .from('assessments')
      .insert({
        user_id,
        skill,
        trade,
        score_percent: scorePercent,
        passed,
        questions_attempted: questions.length,
        questions_correct: correct
      })
      .select()
      .single()

    if (assessError) throw assessError

    let credential = null

    // Issue credential if passed
    if (passed) {
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('name')
        .eq('id', user_id)
        .single()

      const { data: cred, error: credError } = await supabaseAdmin
        .from('credentials')
        .insert({
          user_id,
          user_name: user?.name || 'Learner',
          skill,
          trade,
          score_percent: scorePercent,
          proficiency_level: getProficiencyLevel(scorePercent),
          assessment_id: assessment.id
        })
        .select()
        .single()

      if (!credError) credential = cred
    }

    return NextResponse.json({
      assessment,
      credential,
      score_percent: scorePercent,
      passed,
      correct,
      total: questions.length,
      results,
      ai_feedback: aiFeedback
    })

  } catch (error: any) {
    console.error('Assessment error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save assessment' },
      { status: 500 }
    )
  }
}
