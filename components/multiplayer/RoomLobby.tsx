'use client'
import { useEffect, useState } from 'react'
import { useRoomStore, GameMode, MultiMode } from '@/lib/store/roomStore'
import { GridSize } from '@/lib/cardLogic'
import { useT } from '@/lib/i18n-client'

const GAME_ORIGIN = 'https://pino-games.revely.company'
const joinUrl = (code: string) => `${GAME_ORIGIN}/cards/multi/join?code=${code}`

interface RoomLobbyProps {
  gameType: GameMode
  onStart: () => void
  initialJoinCode?: string
}

export function RoomLobby({ gameType, onStart, initialJoinCode }: RoomLobbyProps) {
  const { status, roomCode, role, error, createRoom, joinRoom, leaveRoom, clearError } = useRoomStore()
  const { m, t } = useT()
  const [joinCode, setJoinCode] = useState(initialJoinCode?.toUpperCase().slice(0, 6) ?? '')
  const [gridSize, setGridSize] = useState<GridSize>('4x4')
  const [multiMode, setMultiMode] = useState<MultiMode>('concurrent')
  const [joining, setJoining] = useState(false)
  const [tab, setTab] = useState<'create' | 'join'>(initialJoinCode ? 'join' : 'create')
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  useEffect(() => {
    if (initialJoinCode && initialJoinCode.length === 6 && status === 'idle') {
      setJoining(true)
      joinRoom(initialJoinCode.toUpperCase()).then(ok => {
        setJoining(false)
        if (ok) onStart()
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  async function handleShare() {
    const url = joinUrl(roomCode ?? '')
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: m.room.shareTitle, text: t(m.room.shareText, { url }), url })
        return
      } catch { /* fallback */ }
    }
    try { await navigator.clipboard.writeText(url) } catch { /* ignore */ }
    showToast(m.room.linkCopied)
  }

  async function handleCopyCode() {
    try { await navigator.clipboard.writeText(roomCode ?? '') } catch { /* ignore */ }
    showToast(m.room.codeCopied)
  }

  if (status === 'waiting' && role === 'host') {
    return (
      <div className="text-center w-full max-w-2xl mx-auto relative">
        {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#6B4C2A] text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg animate-fade-in">
            ✓ {toast}
          </div>
        )}
        <div className="text-6xl mb-4">🎮</div>
        <h2 className="text-2xl font-bold text-[#6B4C2A] mb-2">{m.room.created}</h2>
        <p className="text-[#A0785A] text-sm mb-6">{m.room.shareHint}</p>
        <button onClick={handleCopyCode}
          className="bg-white/80 rounded-3xl px-8 py-6 shadow-md border border-[#FFD4A8]/50 mb-5 w-full hover:bg-white/95 transition-colors cursor-copy group">
          <p className="text-5xl font-black text-[#6B4C2A] tracking-widest group-hover:text-[#FF8FA8] transition-colors">{roomCode}</p>
          <p className="text-xs text-[#A0785A] mt-2">{m.room.tapCopy}</p>
        </button>
        <div className="flex flex-col gap-3 mb-5">
          <button onClick={handleShare} className="w-full bg-[#FFB7C5] hover:bg-[#FF8FA8] text-white font-black py-4 rounded-2xl text-base transition-colors shadow-sm">
            {m.room.sendInvite}
          </button>
          <button onClick={handleCopyCode} className="w-full bg-white/80 hover:bg-white text-[#6B4C2A] font-bold py-3 rounded-2xl text-sm border border-[#FFD4A8] transition-colors">
            {m.room.copyCode}
          </button>
        </div>
        <div className="flex items-center gap-2 justify-center text-[#A0785A] mb-6">
          <div className="w-4 h-4 border-2 border-[#FFB7C5] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">{m.room.waiting}</span>
        </div>
        <button onClick={leaveRoom} className="text-sm text-[#A0785A] underline">{m.room.cancel}</button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex rounded-2xl overflow-hidden border border-[#FFD4A8]/50 mb-6">
        {(['create', 'join'] as const).map(tb => (
          <button key={tb} onClick={() => setTab(tb)}
            className={`flex-1 py-3 font-bold text-sm transition-colors ${tab === tb ? 'bg-[#FFB7C5] text-white' : 'bg-white/60 text-[#A0785A] hover:bg-white'}`}>
            {tb === 'create' ? m.room.tabCreate : m.room.tabJoin}
          </button>
        ))}
      </div>
      {tab === 'create' ? (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-[#A0785A] mb-2">{m.room.grid}</p>
            <div className="flex gap-2">
              {(['4x4', '4x6', '6x6'] as GridSize[]).map(g => (
                <button key={g} onClick={() => setGridSize(g)}
                  className={`flex-1 py-2 rounded-xl border text-sm font-bold transition-colors ${gridSize === g ? 'border-[#FFB7C5] bg-[#FFF0F4] text-[#8A2040]' : 'border-[#FFD4A8] bg-white/70 text-[#6B4C2A]'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#A0785A] mb-2">{m.room.mode}</p>
            <div className="flex gap-2">
              {([['concurrent', m.room.modeConcurrent], ['turn', m.room.modeTurn]] as [MultiMode, string][]).map(([mv, label]) => (
                <button key={mv} onClick={() => setMultiMode(mv)}
                  className={`flex-1 py-2 rounded-xl border text-sm font-bold transition-colors ${multiMode === mv ? 'border-[#B7D4FF] bg-[#F0F6FF] text-[#1A4080]' : 'border-[#FFD4A8] bg-white/70 text-[#6B4C2A]'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleCreate} className="w-full bg-[#FFB7C5] hover:bg-[#FF8FA8] text-white font-bold py-4 rounded-2xl transition-colors">
            {m.room.createBtn}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <input type="text" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
            placeholder={m.room.codePlaceholder}
            className="w-full text-center text-3xl font-black tracking-widest bg-white/80 border-2 border-[#FFD4A8] rounded-2xl py-4 text-[#6B4C2A] placeholder-[#D0B090] focus:outline-none focus:border-[#FFB7C5]" />
          <button onClick={handleJoin} disabled={joinCode.length !== 6 || joining}
            className="w-full bg-[#B7D4FF] hover:bg-[#8AB8FF] text-[#1A4080] font-bold py-4 rounded-2xl transition-colors disabled:opacity-50">
            {joining ? m.room.joining : m.room.joinBtn}
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
