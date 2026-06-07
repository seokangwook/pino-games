'use client'
import { useEffect, useState } from 'react'
import { useCardStore } from '@/lib/store/cardStore'
import { GridSize } from '@/lib/cardLogic'
import { CardBoard } from './CardBoard'
import { formatTime } from '@/lib/supabase'
import { saveScore } from '@/lib/store/authStore'
import { AudioToggle } from '@/components/ui/AudioToggle'
import { useAudio } from '@/lib/audio/useAudio'
import Link from 'next/link'
import { InterstitialAd } from '@/components/InterstitialAd'
import { AdSlot } from '@/components/ads/AdSlot'

const GRID_OPTIONS: { value: GridSize; label: string; desc: string }[] = [
  { value: '4x4', label: '4×4', desc: '쉬움 · 16장' },
  { value: '4x6', label: '4×6', desc: '보통 · 24장' },
  { value: '6x6', label: '6×6', desc: '어려움 · 36장' },
]

export function CardGame() {
  const { status, gridSize, moves, matchedCount, startTime, endTime, setGridSize, startGame, resetGame } = useCardStore()
  const [elapsed, setElapsed] = useState(0)
  const [scoreSaved, setScoreSaved] = useState(false)
  const [showAdGate, setShowAdGate] = useState(false)
  useAudio(status === 'playing' ? 'cards' : status === 'won' ? null : 'main')

  useEffect(() => {
    if (status !== 'playing' || !startTime) return
    const id = setInterval(() => setElapsed(Date.now() - startTime), 500)
    return () => clearInterval(id)
  }, [status, startTime])

  // Save score when game is won
  useEffect(() => {
    if (status === 'won' && !scoreSaved && startTime && endTime) {
      setScoreSaved(true)
      saveScore({
        gameType: 'cards',
        gridSize,
        moves,
        timeMs: endTime - startTime,
      })
    }
  }, [status, scoreSaved, startTime, endTime, gridSize, moves])

  // Reset score saved flag when new game starts
  useEffect(() => {
    if (status === 'playing') setScoreSaved(false)
  }, [status])

  const totalPairs = gridSize === '4x4' ? 8 : gridSize === '4x6' ? 12 : 18

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-2xl flex items-center mb-6 gap-3">
        <Link href="/" className="text-[#A0785A] hover:text-[#6B4C2A] transition-colors text-2xl">←</Link>
        <h1 className="text-2xl font-black text-[#6B4C2A]">카드 뒤집기 🃏</h1>
        <div className="ml-auto"><AudioToggle bgmKey={status === 'playing' ? 'cards' : 'main'} /></div>
      </div>

      {status === 'idle' ? (
        <div className="w-full max-w-sm">
          <p className="text-[#A0785A] font-semibold mb-4 text-center">난이도 선택</p>
          <div className="flex flex-col gap-3">
            {GRID_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => setGridSize(opt.value)}
                className={`rounded-2xl px-6 py-4 text-left border-2 transition-all font-medium ${gridSize === opt.value ? 'border-[#FFB7C5] bg-[#FFF0F4] text-[#8A2040]' : 'border-[#FFD4A8] bg-white/70 text-[#6B4C2A] hover:border-[#FFB7C5]'}`}>
                <span className="font-bold text-lg">{opt.label}</span>
                <span className="ml-3 text-sm opacity-70">{opt.desc}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setShowAdGate(true)} className="w-full mt-6 bg-[#FFB7C5] hover:bg-[#FF8FA8] text-white font-bold text-lg py-4 rounded-2xl transition-colors shadow-md">
            게임 시작 🐱
          </button>
          {showAdGate && (
            <InterstitialAd onSkip={() => { setShowAdGate(false); startGame(); }} />
          )}
        </div>
      ) : status === 'won' ? (
        <ResultScreen moves={moves} elapsed={endTime && startTime ? endTime - startTime : 0} onReplay={startGame} onMenu={resetGame} />
      ) : (
        <>
          <div className="w-full max-w-2xl flex items-center justify-between mb-5 bg-white/70 backdrop-blur rounded-2xl px-5 py-3 shadow-sm border border-[#FFD4A8]/50">
            <div className="text-center"><p className="text-xs text-[#A0785A] font-semibold uppercase tracking-wide">이동</p><p className="text-2xl font-black text-[#6B4C2A]">{moves}</p></div>
            <div className="text-center"><p className="text-xs text-[#A0785A] font-semibold uppercase tracking-wide">매칭</p><p className="text-2xl font-black text-[#6B4C2A]">{matchedCount}/{totalPairs}</p></div>
            <div className="text-center"><p className="text-xs text-[#A0785A] font-semibold uppercase tracking-wide">시간</p><p className="text-2xl font-black text-[#6B4C2A]">{formatTime(elapsed)}</p></div>
          </div>
          <CardBoard />
          <button onClick={resetGame} className="mt-6 text-[#A0785A] hover:text-[#6B4C2A] font-medium underline text-sm">처음으로</button>
        </>
      )}
    </div>
  )
}

function ResultScreen({ moves, elapsed, onReplay, onMenu }: { moves: number; elapsed: number; onReplay: () => void; onMenu: () => void }) {
  return (
    <div className="text-center mt-8 w-full max-w-xs mx-auto">
      <div className="text-8xl mb-4 bounce-soft">🎉</div>
      <h2 className="text-3xl font-black text-[#6B4C2A] mb-2">클리어!</h2>
      <p className="text-[#A0785A] mb-2">{moves}번 만에 · {formatTime(elapsed)}</p>
      <p className="text-xs text-green-600 mb-6">✓ 기록 저장됨 (로그인 시)</p>
      <div className="flex flex-col gap-3">
        <button onClick={onReplay} className="bg-[#FFB7C5] hover:bg-[#FF8FA8] text-white font-bold py-4 rounded-2xl transition-colors">다시 하기</button>
        <a href="/ranking" className="block bg-white/70 hover:bg-white border border-[#FFD4A8] text-[#6B4C2A] font-bold py-4 rounded-2xl transition-colors text-center">🏆 랭킹 보기</a>
        <button onClick={onMenu} className="text-[#A0785A] underline text-sm">메뉴로</button>
      </div>
      <div className="mt-6">
        <AdSlot slot="6394256326" format="auto" />
      </div>
    </div>
  )
}
