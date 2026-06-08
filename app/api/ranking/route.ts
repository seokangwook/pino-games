import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yiduavoxineujidorcbx.supabase.co'
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpZHVhdm94aW5ldWppZG9yY2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NDE4MzAsImV4cCI6MjA5MjExNzgzMH0.lPhnp5DZD_6y0BcSaj_lQhHSVE4kbyuQn7OhngJp71U'

function isValidNickname(nick: string): boolean {
  return nick.length >= 2 && nick.length <= 10 && /^[가-힣a-zA-Z0-9]+$/.test(nick)
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'bad request' }, { status: 400 })

  const { gameType, gridSize, moves, timeMs, guestNickname } = body
  if (!gameType || moves == null || timeMs == null) {
    return NextResponse.json({ error: 'missing params' }, { status: 400 })
  }

  const token = req.headers.get('authorization')?.replace('Bearer ', '')

  if (token) {
    // 로그인 사용자: JWT 검증 후 저장
    const authClient = createClient(SB_URL, SB_ANON, { auth: { persistSession: false } })
    const { data: { user } } = await authClient.auth.getUser(token)
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const supabase = createClient(SB_URL, SB_ANON, {
      auth: { persistSession: false },
      global: { headers: { Authorization: `Bearer ${token}` } },
    })

    const { error } = await supabase.from('game_scores').insert({
      user_id: user.id,
      game_type: gameType,
      grid_size: gridSize ?? null,
      moves,
      time_ms: timeMs,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  // 비로그인 게스트: guest_nickname으로 저장 (service role key 사용 = RLS bypass)
  if (!guestNickname) return NextResponse.json({ error: 'guest_nickname required' }, { status: 400 })
  if (!isValidNickname(guestNickname)) {
    return NextResponse.json({ error: 'invalid nickname' }, { status: 400 })
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? SB_ANON
  const serviceClient = createClient(SB_URL, serviceKey, { auth: { persistSession: false } })

  const { error } = await serviceClient.from('game_scores').insert({
    user_id: null,
    game_type: gameType,
    grid_size: gridSize ?? null,
    moves,
    time_ms: timeMs,
    guest_nickname: guestNickname,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function GET(req: NextRequest) {
  const gridSize = req.nextUrl.searchParams.get('gridSize') || undefined

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? SB_ANON
  const supabase = createClient(SB_URL, key, { auth: { persistSession: false } })

  let q = supabase
    .from('game_scores')
    .select('user_id, moves, time_ms, created_at, guest_nickname')
    .eq('game_type', 'cards')
    .order('time_ms', { ascending: true })
    .limit(20)
  if (gridSize) q = q.eq('grid_size', gridSize)

  const { data: scores } = await q
  if (!scores?.length) return NextResponse.json([])

  // 로그인 유저 ID만 profiles 조회 (guest는 guest_nickname 직접 사용)
  const authIds = [...new Set(
    scores
      .filter((s: { user_id: string | null; guest_nickname: string | null }) => s.user_id && !s.guest_nickname)
      .map((s: { user_id: string }) => s.user_id)
  )]

  const { data: profiles } = authIds.length
    ? await supabase.from('profiles').select('id, nickname').in('id', authIds)
    : { data: [] }

  const nickMap = new Map(
    (profiles ?? []).map((p: { id: string; nickname: string | null }) => [p.id, p.nickname])
  )

  return NextResponse.json(
    scores
      .map((s: { user_id: string | null; moves: number; time_ms: number; created_at: string; guest_nickname: string | null }) => ({
        ...s,
        nickname: s.guest_nickname || (s.user_id ? nickMap.get(s.user_id) ?? null : null),
      }))
      .filter((s: { nickname: string | null }) => s.nickname !== null)
  )
}
