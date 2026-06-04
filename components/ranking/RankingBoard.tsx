'use client'
import { useEffect, useState } from 'react'
import { fetchRanking } from '@/lib/store/authStore'
import { formatTime } from '@/lib/supabase'

type Row = { user_id: string; moves: number; time_ms: number; nickname?: string | null }

export function RankingBoard({ gameType, gridSize }: { gameType: 'cards' | 'mahjong'; gridSize?: string }) {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetchRanking(gameType, gridSize).then(d => { setRows(d as Row[]); setLoading(false) })
  }, [gameType, gridSize])

  if (loading) return <div className="text-center text-[#A0785A] py-8">불러오는 중...</div>
  if (!rows.length) return <div className="text-center text-[#A0785A] py-8"><p className="text-4xl mb-2">🏆</p><p>첫 번째 기록을 남겨보세요!</p></div>

  return (
    <table className="w-full text-sm">
      <thead><tr className="text-[#A0785A] text-xs border-b border-[#FFD4A8]/50">
        <th className="py-2 text-left w-8">순위</th><th className="py-2 text-left">플레이어</th>
        <th className="py-2 text-right">시간</th><th className="py-2 text-right">이동</th>
      </tr></thead>
      <tbody>{rows.map((r, i) => (
        <tr key={i} className={`border-b border-[#FFD4A8]/30 ${i < 3 ? 'font-bold' : ''}`}>
          <td className="py-2">{i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}</td>
          <td className="py-2 text-[#6B4C2A] truncate max-w-[140px]">{r.nickname || r.user_id.slice(0,8)+'...'}</td>
          <td className="py-2 text-right text-[#6B4C2A]">{formatTime(r.time_ms)}</td>
          <td className="py-2 text-right text-[#A0785A]">{r.moves}번</td>
        </tr>
      ))}</tbody>
    </table>
  )
}
