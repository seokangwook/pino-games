'use client'
import { create } from 'zustand'
import { createClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'
import type { UserRole } from '@/lib/nickname'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yiduavoxineujidorcbx.supabase.co'
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpZHVhdm94aW5ldWppZG9yY2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NDE4MzAsImV4cCI6MjA5MjExNzgzMH0.lPhnp5DZD_6y0BcSaj_lQhHSVE4kbyuQn7OhngJp71U'
export const supabase = createClient(SB_URL, SB_KEY)

interface AuthStore {
  user: User | null; nickname: string | null; role: UserRole
  needsNickname: boolean; loading: boolean
  init: () => Promise<void>; signInWithGoogle: () => Promise<void>; signOut: () => Promise<void>
  saveNickname: (nick: string) => Promise<string | null>
}

async function fetchProfile(userId: string): Promise<{ nickname: string | null; role: UserRole }> {
  const { data } = await supabase.from('profiles').select('nickname, role').eq('id', userId).single()
  return { nickname: data?.nickname ?? null, role: (data?.role as UserRole) ?? 'user' }
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null, nickname: null, role: 'user', needsNickname: false, loading: true,

  init: async () => {
    const { data } = await supabase.auth.getUser()
    if (data.user) {
      const { nickname, role } = await fetchProfile(data.user.id)
      set({ user: data.user, nickname, role, needsNickname: !nickname, loading: false })
    } else {
      set({ loading: false })
    }
    supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        const { nickname, role } = await fetchProfile(session.user.id)
        set({ user: session.user, nickname, role, needsNickname: !nickname })
      } else {
        set({ user: null, nickname: null, role: 'user', needsNickname: false })
      }
    })
  },

  signInWithGoogle: async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/auth/callback' } })
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, nickname: null, role: 'user', needsNickname: false })
  },

  saveNickname: async (nick) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return '로그인 필요'
    const { error } = await supabase.from('profiles').upsert({ id: user.id, user_id: user.id, nickname: nick }, { onConflict: 'id' })
    if (error) return error.code === '23505' ? '이미 사용 중인 닉네임입니다' : (error.message || '저장 실패')
    set({ nickname: nick, needsNickname: false })
    return null
  },
}))

export async function saveScore(params: { gameType: 'cards'; gridSize?: string; moves: number; timeMs: number }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('game_scores').insert({ user_id: user.id, game_type: params.gameType, grid_size: params.gridSize ?? null, moves: params.moves, time_ms: params.timeMs })
}

export async function fetchRanking(gridSize?: string) {
  let q = supabase.from('game_scores').select('user_id, moves, time_ms, created_at').eq('game_type', 'cards').order('time_ms', { ascending: true }).limit(20)
  if (gridSize) q = q.eq('grid_size', gridSize)
  const { data: scores } = await q
  if (!scores?.length) return []
  const ids = [...new Set(scores.map(s => s.user_id))]
  const { data: profiles } = await supabase.from('profiles').select('id, nickname').in('id', ids)
  const nickMap = new Map((profiles ?? []).map(p => [p.id, p.nickname]))
  return scores.map(s => ({ ...s, nickname: nickMap.get(s.user_id) ?? null }))
}
