import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value

    if (sessionToken) {
      // Clear token in database
      await supabaseAdmin
        .from('users')
        .update({ session_token: null })
        .eq('session_token', sessionToken)
    }

    const response = NextResponse.json({ success: true })

    // Clear session cookie
    response.cookies.delete('session_token')

    return response
  } catch (error: any) {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
