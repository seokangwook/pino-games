'use client'
import { useEffect, useState } from 'react'
import { useCardStore } from '@/lib/store/cardStore'
import { GridSize } from '@/lib/cardLogic'
import { CardBoard } from './CardBoard'
import { formatTime } from '@/lib/supabase'
import { saveScore, useAuthStore } from '@/lib/store/authStore'
import { AudioToggle } from '@/components/ui/AudioToggle'
import { useAudio } from '@/lib/audio/useAudio'
import { useT } from '@/lib/i18n-client'
import { GuestNicknameModal } from './GuestNicknameModal'
import Link from 'next/link'
import { AdSlot } from '@/components/ads/AdSlot'

export function CardGame() {
  const { status, gridSize, moves, matchedCount, startTime, endTime, setGridSize, startGame, resetGame } = useCardStore()
  const { user } = useAuthStore()
  const { m, t } = useT()
  const [elapsed, setElapsed] = useState(0)
  const [scoreSaved, setScoreSaved] = useState(false)
  const [showRankCheck, setShowRankCheck] = useState(false)
  const [showGuestNicknameModal, setShowGuestNicknameModal] = useState(false)
  const [savedGuestNick, setSavedGuestNick] = useState<string | null>(null)
  useAudio(status === 'playing' ? 'cards' : status === 'won' ? null : 'main')

  const GRID_OPTIONS: { value: GridSize; label: string; desc: string }[] = [
    { value: '4x4', label: '4×4', desc: m.card.easy },
    { value: '4x6', label: '4×6', desc: m.card.medium },
    { value: '6x6', label: '6×6', desc: m.card.hard },
  ]

  useEffect(() => {
    if (useCardStore.getState().status !== 'idle') resetGame()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (status !== 'playing' || !startTime) return
    const id = setInterval(() => setElapsed(Date.now() - startTime), 500)
    return () => clearInterval(id)
  }, [status, startTime])

  useEffect(() => {
    if (status === 'won' && !scoreSaved && startTime && endTime) {
      setScoreSaved(true)
      if (user) {
        saveScore({ gameType: 'cards', gridSize, moves, timeMs: endTime - startTime })
      } else {
        const storedNick = typeof window !== 'undefined' ? localStorage.getItem('pino_guest_nickname') : null
        if (storedNick) {
          setSavedGuestNick(storedNick)
          saveScore({ gameType: 'cards', gridSize, moves, timeMs: endTime - startTime, guestNickname: storedNick })
        } else {
          setShowGuestNicknameModal(true)
        }
      }
    }
  }, [status, scoreSaved, startTime, endTime, gridSize, moves, user])

  useEffect(() => {
    if (status === 'playing') { setScoreSaved(false); setSavedGuestNick(null) }
  }, [status])

  useEffect(() => {
    if (status === 'won') setShowRankCheck(true)
    else setShowRankCheck(false)
  }, [status])

  const totalPairs = gridSize === '4x4' ? 8 : gridSize === '4x6' ? 12 : 18

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-2xl flex items-center mb-6 gap-3">
        <Link href="/" className="text-[#A0785A] hover:text-[#6B4C2A] transition-colors text-2xl">←</Link>
        <h1 className="text-2xl font-black text-[#6B4C2A]">{m.card.title}</h1>
        <div className="ml-auto"><AudioToggle bgmKey={status === 'playing' ? 'cards' : 'main'} /></div>
      </div>

      {showGuestNicknameModal && (
        <GuestNicknameModal
          onConfirm={(nick) => {
            localStorage.setItem('pino_guest_nickname', nick)
            setSavedGuestNick(nick)
            setShowGuestNicknameModal(false)
            if (startTime && endTime) {
              saveScore({ gameType: 'cards', gridSize, moves, timeMs: endTime - startTime, guestNickname: nick })
            }
          }}
          onSkip={() => setShowGuestNicknameModal(false)}
        />
      )}

      {status === 'idle' ? (
        <div className="w-full max-w-sm">
          <p className="text-[#A0785A] font-semibold mb-4 text-center">{m.card.difficulty}</p>
          <div className="flex flex-col gap-3">
            {GRID_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => setGridSize(opt.value)}
                className={`rounded-2xl px-6 py-4 text-left border-2 transition-all font-medium ${gridSize === opt.value ? 'border-[#FFB7C5] bg-[#FFF0F4] text-[#8A2040]' : 'border-[#FFD4A8] bg-white/70 text-[#6B4C2A] hover:border-[#FFB7C5]'}`}>
                <span className="font-bold text-lg">{opt.label}</span>
                <span className="ml-3 text-sm opacity-70">{opt.desc}</span>
              </button>
            ))}
          </div>
          <button onClick={startGame} className="w-full mt-6 bg-[#FFB7C5] hover:bg-[#FF8FA8] text-white font-bold text-lg py-4 rounded-2xl transition-colors shadow-md">
            {m.card.startGame}
          </button>
        </div>
      ) : status === 'won' && !showRankCheck ? (
        <ResultScreen moves={moves} elapsed={endTime && startTime ? endTime - startTime : 0} onReplay={startGame} onMenu={resetGame} isLoggedIn={!!user} guestNick={savedGuestNick} />
      ) : status === 'won' && showRankCheck ? (
        <>
          <RankCheckModal onDone={() => setShowRankCheck(false)} rankCheck={m.card.rankCheck} rankResult={m.card.rankResult} />
          <ResultScreen moves={moves} elapsed={endTime && startTime ? endTime - startTime : 0} onReplay={startGame} onMenu={resetGame} isLoggedIn={!!user} guestNick={savedGuestNick} />
        </>
      ) : (
        <>
          <div className="w-full max-w-2xl flex items-center justify-between mb-5 bg-white/70 backdrop-blur rounded-2xl px-5 py-3 shadow-sm border border-[#FFD4A8]/50">
            <div className="text-center"><p className="text-xs text-[#A0785A] font-semibold uppercase tracking-wide">{m.card.moves}</p><p className="text-2xl font-black text-[#6B4C2A]">{moves}</p></div>
            <div className="text-center"><p className="text-xs text-[#A0785A] font-semibold uppercase tracking-wide">{m.card.matched}</p><p className="text-2xl font-black text-[#6B4C2A]">{matchedCount}/{totalPairs}</p></div>
            <div className="text-center"><p className="text-xs text-[#A0785A] font-semibold uppercase tracking-wide">{m.card.time}</p><p className="text-2xl font-black text-[#6B4C2A]">{formatTime(elapsed)}</p></div>
          </div>
          <CardBoard />
          <button onClick={resetGame} className="mt-6 text-[#A0785A] hover:text-[#6B4C2A] font-medium underline text-sm">{m.card.restart}</button>
        </>
      )}
    </div>
  )
}

function RankCheckModal({ onDone, rankCheck, rankResult }: { onDone: () => void; rankCheck: string; rankResult: string }) {
  const [remaining, setRemaining] = useState(5)

  useEffect(() => {
    const t = setTimeout(onDone, 5000)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (remaining <= 0) return
    const t = setTimeout(() => setRemaining(r => r - 1), 1000)
    return () => clearTimeout(t)
  }, [remaining])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-center gap-2 px-4 py-3 border-b border-gray-100">
          <span>🏆</span>
          <span className="text-sm font-semibold text-[#6B4C2A]">{rankCheck}</span>
          <div className="w-4 h-4 border-2 border-[#FFB7C5] border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="p-2 min-h-[280px] flex items-center justify-center">
          <AdSlot slot="6394256326" format="auto" className="w-full" />
        </div>
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span>{rankResult}</span>
            <span className="font-mono font-bold text-gray-600">{remaining}s</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className="bg-[#FFB7C5] h-1.5 rounded-full transition-all duration-1000" style={{ width: `${(remaining / 5) * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ResultScreen({ moves, elapsed, onReplay, onMenu, isLoggedIn, guestNick }: { moves: number; elapsed: number; onReplay: () => void; onMenu: () => void; isLoggedIn: boolean; guestNick?: string | null }) {
  const { m, t } = useT()
  return (
    <div className="text-center mt-8 w-full max-w-xs mx-auto">
      <div className="text-8xl mb-4 bounce-soft">🎉</div>
      <h2 className="text-3xl font-black text-[#6B4C2A] mb-2">{m.result.clear}</h2>
      <p className="text-[#A0785A] mb-2">{t(m.result.stat, { moves, time: formatTime(elapsed) })}</p>
      {isLoggedIn || guestNick
        ? <p className="text-xs text-green-600 mb-6">{guestNick ? `🏆 ${guestNick}${m.result.guestSaved}` : m.result.saved}</p>
        : <p className="text-xs text-[#A0785A] mb-6">{m.result.loginPrompt}</p>
      }
      <div className="flex flex-col gap-3">
        <button onClick={onReplay} className="bg-[#FFB7C5] hover:bg-[#FF8FA8] text-white font-bold py-4 rounded-2xl transition-colors">{m.result.replay}</button>
        <a href="/ranking" className="block bg-white/70 hover:bg-white border border-[#FFD4A8] text-[#6B4C2A] font-bold py-4 rounded-2xl transition-colors text-center">{m.result.viewRanking}</a>
        <button onClick={onMenu} className="text-[#A0785A] underline text-sm">{m.result.menu}</button>
      </div>
    </div>
  )
}
