'use client'
import { useState } from 'react'
import { useRoomStore, GameMode, MultiMode } from '@/lib/store/roomStore'
import { GridSize } from '@/lib/cardLogic'

interface RoomLobbyProps {
  gameType: GameMode
  onStart: () => void
}

export function RoomLobby({ gameType, onStart }: RoomLobbyProps) {
  const { status, roomCode, role, error, createRoom, joinRoom, leaveRoom, clearError } = useRoomStore()
  const [joinCode, setJoinCode] = useState('')
  const [gridSize, setGridSize] = useState<GridSize>('4x4')
  const [multiMode, setMultiMode] = useState<MultiMode>('concurrent')
  const [joining, setJoining] = useState(false)
  const [tab, setTab] = useState<'create' | 'join'>('create')

  async function handleCreate() {
    await createRoom(gameType, gridSize, multiMode)
  }
  async function handleJoin() {
    if (joinCode.length !== 6) return
    setJoining(true)
    const ok = await joinRoom(joinCode)
    setJoining(false)
    if (ok) onStart()
  }

  if (status === 'waiting' && role === 'host') {
    return (
      <div className="text-center max-w-sm mx-auto">
        <div className="text-6xl mb-4">🎮</div>
        <h2 className="text-2xl font-bold text-[#6B4C2A] mb-2">방 생성됨</h2>
        <p className="text-[#A0785A] text-sm mb-6">친구에게 이 코드를 알려주세요</p>
        <div className="bg-white/80 rounded-3xl px-8 py-6 shadow-md border border-[#FFD4A8]/50 mb-6">
          <p className="text-5xl font-black text-[#6B4C2A] tracking-widest">{roomCode}</p>
          <p className="text-xs text-[#A0785A] mt-2">6자리 방 코드</p>
        </div>
        <div className="flex items-center gap-2 justify-center text-[#A0785A] mb-6">
          <div className="w-4 h-4 border-2 border-[#FFB7C5] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">상대방 기다리는 중...</span>
        </div>
        <button onClick={leaveRoom} className="text-sm text-[#A0785A] underline">취소</button>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto">
      <div className="flex rounded-2xl overflow-hidden border border-[#FFD4A8]/50 mb-6">
        {(['create', 'join'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-3 font-bold text-sm transition-colors ${tab === t ? 'bg-[#FFB7C5] text-white' : 'bg-white/60 text-[#A0785A] hover:bg-white'}`}>
            {t === 'create' ? '방 만들기' : '참가하기'}
          </button>
        ))}
      </div>
      {tab === 'create' ? (
        <div className="space-y-4">
          {gameType === 'cards' && (
            <>
              <div>
                <p className="text-xs font-semibold text-[#A0785A] mb-2">그리드</p>
                <div className="flex gap-2">
                  {(['4x4','4x6','6x6'] as GridSize[]).map(g => (
                    <button key={g} onClick={() => setGridSize(g)}
                      className={`flex-1 py-2 rounded-xl border text-sm font-bold transition-colors ${gridSize === g ? 'border-[#FFB7C5] bg-[#FFF0F4] text-[#8A2040]' : 'border-[#FFD4A8] bg-white/70 text-[#6B4C2A]'}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#A0785A] mb-2">모드</p>
                <div className="flex gap-2">
                  {([['concurrent','동시경쟁'],['turn','턴제']] as [MultiMode,string][]).map(([m,l]) => (
                    <button key={m} onClick={() => setMultiMode(m)}
                      className={`flex-1 py-2 rounded-xl border text-sm font-bold transition-colors ${multiMode === m ? 'border-[#B7D4FF] bg-[#F0F6FF] text-[#1A4080]' : 'border-[#FFD4A8] bg-white/70 text-[#6B4C2A]'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          <button onClick={handleCreate} className="w-full bg-[#FFB7C5] hover:bg-[#FF8FA8] text-white font-bold py-4 rounded-2xl transition-colors">
            방 만들기 🐱
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <input type="text" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase().slice(0,6))}
            placeholder="ABCDEF"
            className="w-full text-center text-3xl font-black tracking-widest bg-white/80 border-2 border-[#FFD4A8] rounded-2xl py-4 text-[#6B4C2A] placeholder-[#D0B090] focus:outline-none focus:border-[#FFB7C5]" />
          <button onClick={handleJoin} disabled={joinCode.length !== 6 || joining}
            className="w-full bg-[#B7D4FF] hover:bg-[#8AB8FF] text-[#1A4080] font-bold py-4 rounded-2xl transition-colors disabled:opacity-50">
            {joining ? '참가 중...' : '참가하기 →'}
          </button>
        </div>
      )}
      {error && (
        <div className="mt-4 bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="ml-2 font-bold">✕</button>
        </div>
      )}
    </div>
  )
}
