'use client'
import { useState } from 'react'
import { useRoomStore, GameMode } from '@/lib/store/roomStore'
import { RoomLobby } from './RoomLobby'

interface ModeGateProps {
  gameType: GameMode
  singleContent: React.ReactNode
  multiContent: React.ReactNode
}

export function ModeGate({ gameType, singleContent, multiContent }: ModeGateProps) {
  const [mode, setMode] = useState<'single' | 'multi' | null>(null)
  const { status } = useRoomStore()
  if (mode === 'multi' && status === 'playing') return <>{multiContent}</>
  if (mode === 'multi') {
    return (
      <div className="min-h-screen flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-2xl mb-6 flex items-center gap-3">
          <button onClick={() => { useRoomStore.getState().leaveRoom(); setMode(null) }} className="text-[#A0785A] text-2xl">←</button>
          <h1 className="text-2xl font-black text-[#6B4C2A]">{gameType === 'cards' ? '카드 뒤집기' : '마작 솔리테어'} · 멀티</h1>
        </div>
        <RoomLobby gameType={gameType} onStart={() => {}} />
      </div>
    )
  }
  if (mode === 'single') return <>{singleContent}</>
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center mb-10">
        <div className="text-6xl mb-3">{gameType === 'cards' ? '🃏' : '🀄'}</div>
        <h1 className="text-3xl font-black text-[#6B4C2A]">{gameType === 'cards' ? '카드 뒤집기' : '마작 솔리테어'}</h1>
        <p className="text-[#A0785A] mt-2">모드를 선택하세요</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        <button onClick={() => setMode('single')} className="bg-white/80 backdrop-blur rounded-3xl p-8 text-center border border-[#FFD4A8]/50 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="text-4xl mb-3">👤</div>
          <h2 className="text-xl font-bold text-[#6B4C2A]">싱글 플레이</h2>
          <p className="text-sm text-[#A0785A] mt-1">혼자서 기록 도전</p>
        </button>
        <button onClick={() => setMode('multi')} className="bg-white/80 backdrop-blur rounded-3xl p-8 text-center border border-[#FFD4A8]/50 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="text-4xl mb-3">👥</div>
          <h2 className="text-xl font-bold text-[#6B4C2A]">1:1 멀티</h2>
          <p className="text-sm text-[#A0785A] mt-1">친구와 실시간 대결</p>
        </button>
      </div>
      <button onClick={() => window.history.back()} className="mt-8 text-[#A0785A] underline text-sm">← 메인으로</button>
    </div>
  )
}
