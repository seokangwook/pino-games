'use client'
import { useEffect, useState } from 'react'
import { useMahjongStore } from '@/lib/store/mahjongStore'
import { MahjongBoard } from './MahjongBoard'
import { formatTime } from '@/lib/supabase'
import { saveScore } from '@/lib/store/authStore'
import { AudioToggle } from '@/components/ui/AudioToggle'
import { useAudio } from '@/lib/audio/useAudio'
import Link from 'next/link'

export function MahjongGame() {
  const { status, moves, tiles, startTime, endTime, startGame, resetGame, showHint, reshuffle } = useMahjongStore()
  const [elapsed, setElapsed] = useState(0)
  const [scoreSaved, setScoreSaved] = useState(false)
  useAudio(status === 'playing' ? 'mahjong' : 'main')

  useEffect(() => {
    if (status !== 'playing' || !startTime) return
    const id = setInterval(() => setElapsed(Date.now() - startTime), 500)
    return () => clearInterval(id)
  }, [status, startTime])

  useEffect(() => {
    if (status === 'won' && !scoreSaved && startTime && endTime) {
      setScoreSaved(true)
      saveScore({ gameType: 'mahjong', moves, timeMs: endTime - startTime })
    }
  }, [status, scoreSaved, startTime, endTime, moves])

  useEffect(() => { if (status === 'playing') setScoreSaved(false) }, [status])

  const remaining = tiles.filter(t => !t.isMatched).length
  const total = tiles.length

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-2xl flex items-center mb-6 gap-3">
        <Link href="/" className="text-[#A0785A] hover:text-[#6B4C2A] transition-colors text-2xl">←</Link>
        <h1 className="text-2xl font-black text-[#6B4C2A]">마작 솔리테어 🀄</h1>
        <div className="ml-auto"><AudioToggle bgmKey={status === 'playing' ? 'mahjong' : 'main'} /></div>
      </div>

      {status === 'idle' ? (
        <div className="text-center max-w-sm mt-8">
          <div className="text-7xl mb-6 bounce-soft">🀄</div>
          <h2 className="text-2xl font-bold text-[#6B4C2A] mb-3">마작 솔리테어</h2>
          <p className="text-[#A0785A] text-sm leading-relaxed mb-8">쌓인 타일에서 같은 고양이 한 쌍을 찾아 제거하세요.<br />양옆이 막힌 타일은 선택할 수 없어요.</p>
          <button onClick={startGame} className="w-full bg-[#B7D4FF] hover:bg-[#8AB8FF] text-[#1A4080] font-bold text-lg py-4 rounded-2xl transition-colors shadow-md">게임 시작 🐱</button>
        </div>
      ) : status === 'won' ? (
        <div className="text-center mt-8">
          <div className="text-8xl mb-4 bounce-soft">🎊</div>
          <h2 className="text-3xl font-black text-[#6B4C2A] mb-2">완전 클리어!</h2>
          <p className="text-[#A0785A] mb-2">{moves}번 이동 · {formatTime(endTime && startTime ? endTime - startTime : 0)}</p>
          <p className="text-xs text-green-600 mb-6">✓ 기록 저장됨 (로그인 시)</p>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <button onClick={startGame} className="bg-[#B7D4FF] hover:bg-[#8AB8FF] text-[#1A4080] font-bold py-4 rounded-2xl transition-colors">다시 하기</button>
            <a href="/ranking" className="block bg-white/70 hover:bg-white border border-[#FFD4A8] text-[#6B4C2A] font-bold py-4 rounded-2xl transition-colors text-center">🏆 랭킹 보기</a>
            <button onClick={resetGame} className="text-[#A0785A] underline text-sm">메뉴로</button>
          </div>
        </div>
      ) : status === 'stuck' ? (
        <div className="text-center mt-8">
          <div className="text-6xl mb-4">😿</div>
          <h2 className="text-xl font-bold text-[#6B4C2A] mb-2">막혔어요!</h2>
          <p className="text-[#A0785A] text-sm mb-6">더 이상 매칭 가능한 쌍이 없습니다.</p>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <button onClick={reshuffle} className="bg-[#7BC9A0] hover:bg-[#5BA880] text-white font-bold py-3 rounded-2xl">다시 섞기 🔀</button>
            <button onClick={startGame} className="bg-[#B7D4FF] hover:bg-[#8AB8FF] text-[#1A4080] font-bold py-3 rounded-2xl">새 게임</button>
          </div>
        </div>
      ) : (
        <>
          <div className="w-full max-w-2xl flex items-center justify-between mb-4 bg-white/70 backdrop-blur rounded-2xl px-5 py-3 shadow-sm border border-[#FFD4A8]/50">
            <div className="text-center"><p className="text-xs text-[#A0785A] font-semibold uppercase tracking-wide">이동</p><p className="text-2xl font-black text-[#6B4C2A]">{moves}</p></div>
            <div className="text-center"><p className="text-xs text-[#A0785A] font-semibold uppercase tracking-wide">남은 타일</p><p className="text-2xl font-black text-[#6B4C2A]">{remaining}/{total}</p></div>
            <div className="text-center"><p className="text-xs text-[#A0785A] font-semibold uppercase tracking-wide">시간</p><p className="text-2xl font-black text-[#6B4C2A]">{formatTime(elapsed)}</p></div>
          </div>
          <div className="w-full max-w-2xl bg-white/60 backdrop-blur rounded-3xl p-3 shadow-md border border-[#FFD4A8]/40"><MahjongBoard /></div>
          <div className="flex gap-3 mt-5">
            <button onClick={showHint} className="bg-[#7BC9A0] hover:bg-[#5BA880] text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm text-sm">힌트 💡</button>
            <button onClick={reshuffle} className="bg-[#B7D4FF] hover:bg-[#8AB8FF] text-[#1A4080] font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm text-sm">다시 섞기 🔀</button>
            <button onClick={resetGame} className="bg-white/70 hover:bg-white border border-[#FFD4A8] text-[#6B4C2A] font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm text-sm">메뉴로</button>
          </div>
        </>
      )}
    </div>
  )
}
