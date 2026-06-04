'use client'
import { useRoomStore } from '@/lib/store/roomStore'
import { formatTime } from '@/lib/supabase'

interface OpponentStatusProps {
  totalPairs: number
}

export function OpponentStatus({ totalPairs }: OpponentStatusProps) {
  const { boardState, role } = useRoomStore()
  const opKey = role === 'host' ? 'guestProgress' : 'hostProgress'
  const op = (boardState[opKey] as { matched?: number; moves?: number; clearTime?: number | null }) ?? {}
  const matched = op.matched ?? 0
  const moves = op.moves ?? 0
  const cleared = op.clearTime != null
  return (
    <div className={`rounded-2xl px-4 py-3 text-center border ${cleared ? 'bg-green-50 border-green-200' : 'bg-white/60 border-[#FFD4A8]/50'}`}>
      <p className="text-xs font-semibold text-[#A0785A] mb-1">상대방</p>
      {cleared ? (
        <p className="text-sm font-bold text-green-600">클리어! {op.moves}번 · {formatTime(op.clearTime!)}</p>
      ) : (
        <p className="text-lg font-black text-[#6B4C2A]">{matched}/{totalPairs}<span className="text-xs font-normal text-[#A0785A] ml-2">{moves}번</span></p>
      )}
    </div>
  )
}
