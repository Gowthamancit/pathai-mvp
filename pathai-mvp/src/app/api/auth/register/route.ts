import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { hashPassword, generateSessionToken, validateEmail, normalizeEmail } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, trade, state, district, language, qualification, experience_years, consent_given } = body

    if (!email || !password || !name || !trade || !state || !district || !consent_given) {
      return NextResponse.json(
        { error: 'Missing required fields or consent not given' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Enter a valid email address' },
        { status: 400 }
      )
    }

    const normalizedEmail = normalizeEmail(email)

    // Check if duplicate
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (existingUser) {
      return NextResponse.json(
        { error: 'This email is already registered. Please login.' },
        { status: 400 }
      )
    }

    const passwordHash = hashPassword(password)
    const sessionToken = generateSessionToken()

    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert({
        email: normalizedEmail,
        password_hash: passwordHash,
        session_token: sessionToken,
        name: name.trim(),
        trade,
        state,
        district,
        language: language || 'en',
        qualification: qualification || 'ITI',
        experience_years: experience_years || 0,
        consent_given: true
      })
      .select('id, name, trade, state, district, language, email, created_at')
      .single()

    if (error) throw error

    // Create response and set cookie
    const response = NextResponse.json({ user: newUser }, { status: 201 })
    
    // Set session cookie
    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })

    return response
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    )
  }
}
