import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yiduavoxineujidorcbx.supabase.co'
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpZHVhdm94aW5ldWppZG9yY2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NDE4MzAsImV4cCI6MjA5MjExNzgzMH0.lPhnp5DZD_6y0BcSaj_lQhHSVE4kbyuQn7OhngJp71U'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'bad request' }, { status: 400 })

  const { userId, gameType, gridSize, moves, timeMs } = body
  if (!userId || !gameType || moves == null || timeMs == null) {
    return NextResponse.json({ error: 'missing params' }, { status: 400 })
  }

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? SB_ANON
  const supabase = createClient(SB_URL, key, { auth: { persistSession: false } })

  const { error } = await supabase.from('game_scores').insert({
    user_id: userId,
    game_type: gameType,
    grid_size: gridSize ?? null,
    moves,
    time_ms: timeMs,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function GET(req: NextRequest) {
  const gridSize = req.nextUrl.searchParams.get('gridSize') || undefined

  // Service role key bypasses RLS — required to read other users' nicknames
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? SB_ANON
  const supabase = createClient(SB_URL, key, { auth: { persistSession: false } })

  let q = supabase
    .from('game_scores')
    .select('user_id, moves, time_ms, created_at')
    .eq('game_type', 'cards')
    .order('time_ms', { ascending: true })
    .limit(20)
  if (gridSize) q = q.eq('grid_size', gridSize)

  const { data: scores } = await q
  if (!scores?.length) return NextResponse.json([])

  const ids = [...new Set(scores.map((s: { user_id: string }) => s.user_id))]
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, nickname')
    .in('id', ids)

  const nickMap = new Map(
    (profiles ?? []).map((p: { id: string; nickname: string | null }) => [p.id, p.nickname])
  )

  return NextResponse.json(
    scores.map((s: { user_id: string; moves: number; time_ms: number; created_at: string }) => ({
      ...s,
      nickname: nickMap.get(s.user_id) ?? null,
    }))
  )
}
