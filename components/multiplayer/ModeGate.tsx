'use client'
import { useState } from 'react'
import { useRoomStore, GameMode } from '@/lib/store/roomStore'
import { RoomLobby } from './RoomLobby'
import { useT } from '@/lib/i18n-client'

interface ModeGateProps {
  gameType: GameMode
  singleContent: React.ReactNode
  multiContent: React.ReactNode
  initialCode?: string
}

export function ModeGate({ gameType, singleContent, multiContent, initialCode }: ModeGateProps) {
  const [mode, setMode] = useState<'single' | 'multi' | null>(initialCode ? 'multi' : null)
  const { status } = useRoomStore()
  const { m } = useT()

  if (status === 'playing') return <>{multiContent}</>
  if (mode === 'multi') {
    return (
      <div className="min-h-screen flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-2xl mb-6 flex items-center gap-3">
          <button onClick={() => { useRoomStore.getState().leaveRoom(); setMode(null) }} className="text-[#A0785A] text-2xl">←</button>
          <h1 className="text-2xl font-black text-[#6B4C2A]">{m.card.multiHeader}</h1>
        </div>
        <RoomLobby gameType={gameType} onStart={() => {}} initialJoinCode={initialCode} />
      </div>
    )
  }
  if (mode === 'single') return <>{singleContent}</>
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center mb-10">
        <div className="text-6xl mb-3">🃏</div>
        <h1 className="text-3xl font-black text-[#6B4C2A]">{m.mode.title}</h1>
        <p className="text-[#A0785A] mt-2">{m.mode.subtitle}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        <button onClick={() => setMode('single')} className="bg-white/80 backdrop-blur rounded-3xl p-8 text-center border border-[#FFD4A8]/50 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="text-4xl mb-3">👤</div>
          <h2 className="text-xl font-bold text-[#6B4C2A]">{m.mode.single}</h2>
          <p className="text-sm text-[#A0785A] mt-1">{m.mode.singleDesc}</p>
        </button>
        <button onClick={() => setMode('multi')} className="bg-white/80 backdrop-blur rounded-3xl p-8 text-center border border-[#FFD4A8]/50 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="text-4xl mb-3">👥</div>
          <h2 className="text-xl font-bold text-[#6B4C2A]">{m.mode.multi}</h2>
          <p className="text-sm text-[#A0785A] mt-1">{m.mode.multiDesc}</p>
        </button>
      </div>
      <button onClick={() => window.history.back()} className="mt-8 text-[#A0785A] underline text-sm">{m.mode.back}</button>
    </div>
  )
}
