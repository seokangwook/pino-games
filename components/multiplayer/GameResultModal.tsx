'use client'
import { formatTime } from '@/lib/supabase'

interface GameResultModalProps {
  result: 'victory' | 'defeat'
  myMatched: number
  opMatched: number
  totalPairs: number
  elapsed: number
  opElapsed?: number
  onRematch: () => void
  onHome: () => void
}

export function GameResultModal({
  result, myMatched, opMatched, totalPairs, elapsed, opElapsed, onRematch, onHome,
}: GameResultModalProps) {
  const isVictory = result === 'victory'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className={`w-full max-w-sm rounded-3xl shadow-2xl px-8 py-10 text-center flex flex-col items-center gap-4
        ${isVictory ? 'bg-gradient-to-b from-yellow-50 to-orange-50 border-4 border-yellow-300'
                    : 'bg-gradient-to-b from-pink-50 to-rose-50 border-4 border-rose-300'}`}>

        <div className="text-7xl leading-none">
          {isVictory ? '🎉' : '😿'}
        </div>

        <h1 className={`text-4xl font-black tracking-tight leading-none
          ${isVictory ? 'text-yellow-600' : 'text-rose-500'}`}>
          {isVictory ? '승리!' : 'GAME OVER'}
        </h1>

        <p className="text-sm text-[#A0785A] font-medium -mt-1">
          {isVictory
            ? '빠른 손이 빠른 냥을 이긴다냥! 🐾'
            : '아쉽다냥... 다음엔 더 빨리 매칭해보세요!'}
        </p>

        <div className="w-full bg-white/70 rounded-2xl px-5 py-4 flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#A0785A] font-semibold">내 매칭</span>
            <span className="font-black text-[#6B4C2A]">{myMatched}/{totalPairs}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#A0785A] font-semibold">소요 시간</span>
            <span className="font-black text-[#6B4C2A]">{formatTime(elapsed)}</span>
          </div>
          <hr className="border-[#FFD4A8]/60 my-1" />
          <div className="flex justify-between">
            <span className="text-[#A0785A] font-semibold">상대방 매칭</span>
            <span className="font-black text-[#6B4C2A]">{opMatched}/{totalPairs}</span>
          </div>
          {opElapsed != null && (
            <div className="flex justify-between">
              <span className="text-[#A0785A] font-semibold">상대방 클리어</span>
              <span className="font-black text-[#6B4C2A]">{formatTime(opElapsed)}</span>
            </div>
          )}
        </div>

        <div className="w-full flex flex-col gap-2 mt-1">
          <button
            onClick={onRematch}
            className={`w-full py-3 rounded-2xl font-black text-white text-base transition-opacity hover:opacity-90 active:scale-95
              ${isVictory ? 'bg-yellow-400' : 'bg-[#FFB7C5]'}`}>
            다시 도전하기
          </button>
          <button
            onClick={onHome}
            className="w-full py-3 rounded-2xl font-bold text-[#A0785A] text-base bg-white/70 border border-[#FFD4A8] transition-opacity hover:opacity-80 active:scale-95">
            홈으로
          </button>
        </div>
      </div>
    </div>
  )
}
