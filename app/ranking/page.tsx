'use client'
import { useState } from 'react'
import { RankingBoard } from '@/components/ranking/RankingBoard'
import { LoginButton } from '@/components/auth/LoginButton'
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher'
import { useT } from '@/lib/i18n-client'
import Link from 'next/link'

type Tab = 'cards-4x4' | 'cards-4x6' | 'cards-6x6'

export default function RankingPage() {
  const { m } = useT()
  const [tab, setTab] = useState<Tab>('cards-4x4')
  const gridSize = tab.replace('cards-', '')

  const TABS = [
    { key: 'cards-4x4', label: m.ranking.tab4x4 },
    { key: 'cards-4x6', label: m.ranking.tab4x6 },
    { key: 'cards-6x6', label: m.ranking.tab6x6 },
  ] as const

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-lg flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-[#A0785A] text-2xl">←</Link>
          <h1 className="text-2xl font-black text-[#6B4C2A]">{m.ranking.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <LoginButton />
        </div>
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
      <p className="mt-6 text-[#C0A88A] text-xs text-center">{m.ranking.loginHint}</p>
    </div>
  )
}
