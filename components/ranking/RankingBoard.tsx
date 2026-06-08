'use client'
import { useEffect, useState } from 'react'
import { fetchRanking } from '@/lib/store/authStore'
import { formatTime } from '@/lib/supabase'
import { useT } from '@/lib/i18n-client'

type Row = { user_id: string; moves: number; time_ms: number; nickname?: string | null }

export function RankingBoard({ gridSize }: { gridSize?: string }) {
  const { m } = useT()
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRanking(gridSize).then(d => { setRows(d as Row[]); setLoading(false) })
  }, [gridSize])

  if (loading) return <div className="text-center text-[#A0785A] py-8">{m.ranking.loading}</div>
  if (!rows.length) return (
    <div className="text-center text-[#A0785A] py-8">
      <p className="text-4xl mb-2">🏆</p>
      <p>{m.ranking.empty}</p>
    </div>
  )

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-[#A0785A] text-xs border-b border-[#FFD4A8]/50">
          <th className="py-2 text-left w-8">{m.ranking.colRank}</th>
          <th className="py-2 text-left">{m.ranking.colPlayer}</th>
          <th className="py-2 text-right">{m.ranking.colTime}</th>
          <th className="py-2 text-right">{m.ranking.colMoves}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className={`border-b border-[#FFD4A8]/30 ${i < 3 ? 'font-bold' : ''}`}>
            <td className="py-2">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
            <td className="py-2 text-[#6B4C2A] truncate max-w-[140px]">{r.nickname}</td>
            <td className="py-2 text-right text-[#6B4C2A]">{formatTime(r.time_ms)}</td>
            <td className="py-2 text-right text-[#A0785A]">{r.moves}{m.ranking.movesSuffix}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
