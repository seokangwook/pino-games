'use client'
import { create } from 'zustand'
import { createClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
export const supabase = SB_URL && SB_KEY ? createClient(SB_URL, SB_KEY) : null

interface AuthStore {
  user: User | null
  loading: boolean
  init: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null, loading: true,
  init: async () => {
    if (!supabase) { set({ loading: false }); return }
    const { data } = await supabase.auth.getUser()
    set({ user: data.user, loading: false })
    supabase.auth.onAuthStateChange((_, session) => { set({ user: session?.user ?? null }) })
  },
  signInWithGoogle: async () => {
    if (!supabase) return
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/auth/callback' } })
  },
  signOut: async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    set({ user: null })
  },
}))

export async function saveScore(params: { gameType: 'cards' | 'mahjong'; gridSize?: string; moves: number; timeMs: number }) {
  if (!supabase) return
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('game_scores').insert({ user_id: user.id, game_type: params.gameType, grid_size: params.gridSize ?? null, moves: params.moves, time_ms: params.timeMs })
}

export async function fetchRanking(gameType: 'cards' | 'mahjong', gridSize?: string) {
  if (!supabase) return []
  let q = supabase.from('game_scores').select('user_id, moves, time_ms, created_at').eq('game_type', gameType).order('time_ms', { ascending: true }).limit(20)
  if (gridSize) q = q.eq('grid_size', gridSize)
  const { data } = await q
  return data ?? []
}
