'use client'
import { create } from 'zustand'
import { createClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yiduavoxineujidorcbx.supabase.co'
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpZHVhdm94aW5ldWppZG9yY2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NDE4MzAsImV4cCI6MjA5MjExNzgzMH0.lPhnp5DZD_6y0BcSaj_lQhHSVE4kbyuQn7OhngJp71U'
export const supabase = createClient(SB_URL, SB_KEY)

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
    const { data } = await supabase.auth.getUser()
    set({ user: data.user, loading: false })
    supabase.auth.onAuthStateChange((_, session) => { set({ user: session?.user ?? null }) })
  },
  signInWithGoogle: async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/auth/callback' }
    })
  },
  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },
}))

export async function saveScore(params: { gameType: 'cards' | 'mahjong'; gridSize?: string; moves: number; timeMs: number }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('game_scores').insert({ user_id: user.id, game_type: params.gameType, grid_size: params.gridSize ?? null, moves: params.moves, time_ms: params.timeMs })
}

export async function fetchRanking(gameType: 'cards' | 'mahjong', gridSize?: string) {
  let q = supabase.from('game_scores').select('user_id, moves, time_ms, created_at').eq('game_type', gameType).order('time_ms', { ascending: true }).limit(20)
  if (gridSize) q = q.eq('grid_size', gridSize)
  const { data } = await q
  return data ?? []
}
