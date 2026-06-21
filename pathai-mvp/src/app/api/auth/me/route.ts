import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value

    if (!sessionToken) {
      return NextResponse.json({ user: null })
    }

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, name, trade, state, district, language, email, created_at')
      .eq('session_token', sessionToken)
      .maybeSingle()

    if (error || !user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user })
  } catch (error: any) {
    return NextResponse.json({ user: null })
  }
}
