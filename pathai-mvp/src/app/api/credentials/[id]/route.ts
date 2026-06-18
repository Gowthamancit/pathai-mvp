import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const { data: credential, error } = await supabaseAdmin
    .from('credentials')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (error || !credential) {
    return NextResponse.json(
      { 
        status: 'NOT_FOUND',
        message: 'This credential does not exist or has been revoked.'
      },
      { status: 404 }
    )
  }

  if (!credential.is_valid) {
    return NextResponse.json({
      status: 'INVALID',
      message: 'This credential has been revoked.'
    })
  }

  return NextResponse.json({
    status: 'VERIFIED',
    credential: {
      id: credential.id,
      holder_name: credential.user_name,
      skill: credential.skill,
      trade: credential.trade,
      score_percent: credential.score_percent,
      proficiency_level: credential.proficiency_level,
      issued_at: credential.issued_at,
      issued_by: 'PathAI — SahAI for Shiksha 2026'
    }
  })
}
