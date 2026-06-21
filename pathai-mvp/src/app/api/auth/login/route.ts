import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyPassword, generateSessionToken, validateEmail, normalizeEmail } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
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

    // Find user
    const { data: user, error: findError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (findError || !user) {
      return NextResponse.json(
        { error: 'Email not registered. Please sign up first.' },
        { status: 404 }
      )
    }

    const passwordMatches = verifyPassword(password, user.password_hash)
    if (!passwordMatches) {
      return NextResponse.json(
        { error: 'Incorrect password. Please try again.' },
        { status: 401 }
      )
    }

    // Generate session token and save
    const sessionToken = generateSessionToken()
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ session_token: sessionToken })
      .eq('id', user.id)

    if (updateError) throw updateError

    // Prepare response user object (hide password hash)
    const userResponse = {
      id: user.id,
      name: user.name,
      trade: user.trade,
      state: user.state,
      district: user.district,
      language: user.language,
      email: user.email,
      created_at: user.created_at
    }

    const response = NextResponse.json({ user: userResponse })

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
      { error: error.message || 'Login failed' },
      { status: 500 }
    )
  }
}
