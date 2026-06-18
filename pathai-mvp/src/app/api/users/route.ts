import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, trade, state, district, language, 
            qualification, experience_years, consent_given } = body

    if (!name || !trade || !state || !district || !consent_given) {
      return NextResponse.json(
        { error: 'Missing required fields or consent not given' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        name: name.trim(),
        trade,
        state,
        district,
        language: language || 'en',
        qualification: qualification || 'ITI',
        experience_years: experience_years || 0,
        consent_given: true
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ user: data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('id')

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ user: data })
}
