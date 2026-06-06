'use client'
import { create } from 'zustand'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '../store/authStore'
import { generateRoomCode, getOrCreateUserId } from '../roomUtils'
import { createCardDeck, GridSize } from '../cardLogic'
import { buildBoard } from '../mahjongLayout'

export type GameMode = 'cards' | 'mahjong'
export type RoomStatus = 'idle' | 'waiting' | 'playing' | 'done'
export type MultiMode = 'concurrent' | 'turn'

export interface RoomState {
  roomId: string | null; roomCode: string | null; role: 'host' | 'guest' | null
  userId: string; gameType: GameMode | null; gridSize: GridSize | null
  multiMode: MultiMode; status: RoomStatus; boardState: Record<string, unknown>
  winnerId: string | null; error: string | null; channel: RealtimeChannel | null
  createRoom: (g: GameMode, gs?: GridSize, mm?: MultiMode) => Promise<void>
  joinRoom: (code: string) => Promise<boolean>
  pushUpdate: (patch: Record<string, unknown>) => Promise<void>
  finishRoom: (winnerId: string) => Promise<void>
  subscribeRoom: () => void; leaveRoom: () => void; clearError: () => void
}

export const useRoomStore = create<RoomState>((set, get) => ({
  roomId: null, roomCode: null, role: null,
  userId: typeof window !== 'undefined' ? getOrCreateUserId() : '',
  gameType: null, gridSize: null, multiMode: 'concurrent',
  status: 'idle', boardState: {}, winnerId: null, error: null, channel: null,

  createRoom: async (gameType, gridSize = '4x4', multiMode = 'concurrent') => {
    const { userId } = get()
    const code = generateRoomCode()
    const hostCards = gameType === 'cards' ? createCardDeck(gridSize) : []
    const mahjongTiles = gameType === 'mahjong' ? buildBoard() : []
    const initialBoard = { hostCards, guestCards: [], hostProgress: { matched: 0, moves: 0, clearTime: null }, guestProgress: { matched: 0, moves: 0, clearTime: null }, mahjongTiles, mahjongTurn: 'host', multiMode, gridSize }
    const { data, error } = await supabase.from('game_rooms').insert({ room_code: code, host_id: userId, game_type: gameType, grid_size: gridSize, status: 'waiting', board_state: initialBoard }).select().single()
    if (error || !data) return set({ error: error?.message ?? '방 생성 실패' })
    set({ roomId: data.id, roomCode: code, role: 'host', gameType, gridSize, multiMode, status: 'waiting', boardState: initialBoard, error: null })
    get().subscribeRoom()
  },

  joinRoom: async (code) => {
    const { userId } = get()
    const { data: room, error } = await supabase.from('game_rooms').select('*').eq('room_code', code.toUpperCase()).eq('status', 'waiting').single()
    if (error || !room) { set({ error: '방을 찾을 수 없습니다' }); return false }
    const boardState = room.board_state as Record<string, unknown>
    const gridSize = (boardState.gridSize ?? '4x4') as GridSize
    const guestCards = room.game_type === 'cards' ? createCardDeck(gridSize) : []
    const newBoard = { ...boardState, guestCards }
    const { error: upErr } = await supabase.from('game_rooms').update({ guest_id: userId, status: 'playing', board_state: newBoard }).eq('id', room.id)
    if (upErr) { set({ error: upErr.message }); return false }
    set({ roomId: room.id, roomCode: code.toUpperCase(), role: 'guest', gameType: room.game_type as GameMode, gridSize, multiMode: (boardState.multiMode as MultiMode) ?? 'concurrent', status: 'playing', boardState: newBoard, error: null })
    get().subscribeRoom()
    return true
  },

  pushUpdate: async (patch) => {
    const { roomId, boardState } = get()
    if (!roomId) return
    const newBoard = { ...boardState, ...patch }
    set({ boardState: newBoard })
    await supabase.from('game_rooms').update({ board_state: newBoard }).eq('id', roomId)
  },

  finishRoom: async (winnerId) => {
    const { roomId } = get()
    if (!roomId) return
    await supabase.from('game_rooms').update({ status: 'done', winner_id: winnerId }).eq('id', roomId)
    set({ status: 'done', winnerId })
  },

  subscribeRoom: () => {
    const { roomId, channel: existing } = get()
    if (!roomId) return
    if (existing) existing.unsubscribe()
    const ch = supabase.channel('room:' + roomId)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_rooms', filter: 'id=eq.' + roomId }, (payload) => {
        const row = payload.new as Record<string, unknown>
        set({ status: row.status as RoomStatus, boardState: (row.board_state as Record<string, unknown>) ?? {}, winnerId: (row.winner_id as string) ?? null })
      }).subscribe()
    set({ channel: ch })
  },

  leaveRoom: () => {
    const { channel } = get()
    if (channel) channel.unsubscribe()
    set({ roomId: null, roomCode: null, role: null, gameType: null, gridSize: null, status: 'idle', boardState: {}, winnerId: null, error: null, channel: null })
  },

  clearError: () => set({ error: null }),
}))
