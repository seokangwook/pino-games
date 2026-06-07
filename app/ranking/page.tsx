'use client'
import { useState } from 'react'
import { RankingBoard } from '@/components/ranking/RankingBoard'
import { LoginButton } from '@/components/auth/LoginButton'
import { AdSlot } from '@/components/ads/AdSlot'
import Link from 'next/link'

type Tab = 'cards-4x4' | 'cards-4x6' | 'cards-6x6'
const TABS = [{ key: 'cards-4x4', label: '카드 4×4' }, { key: 'cards-4x6', label: '카드 4×6' }, { key: 'cards-6x6', label: '카드 6×6' }] as const

export default function RankingPage() {
  const [tab, setTab] = useState<Tab>('cards-4x4')
  const gridSize = tab.replace('cards-', '')
  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-lg flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-[#A0785A] text-2xl">←</Link>
          <h1 className="text-2xl font-black text-[#6B4C2A]">랭킹 🏆</h1>
        </div>
        <LoginButton />
      </div>
      <div className="w-full max-w-lg grid grid-cols-3 gap-1 mb-6 bg-white/60 backdrop-blur rounded-2xl p-1 border border-[#FFD4A8]/50">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key as Tab)}
            className={`py-2 rounded-xl text-xs font-bold transition-colors ${tab === t.key ? 'bg-[#FFB7C5] text-white' : 'text-[#A0785A] hover:text-[#6B4C2A]'}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="w-full max-w-lg bg-white/80 backdrop-blur rounded-3xl p-6 shadow-md border border-[#FFD4A8]/50">
        <RankingBoard gridSize={gridSize} />
      </div>
      <div className="w-full max-w-lg mt-6">
        <AdSlot slot="6394256326" format="auto" />
      </div>
      <p className="mt-4 text-[#C0A88A] text-xs text-center">기록은 Google 로그인 후 자동 저장됩니다</p>
    </div>
  )
}
