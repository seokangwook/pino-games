'use client'
import { useState } from 'react'
import { LOCALE_LABELS, LOCALES } from '@/lib/i18n'
import { useT } from '@/lib/i18n-client'

export function LocaleSwitcher() {
  const { locale, setLocale, m } = useT()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-xs text-[#A0785A] hover:text-[#6B4C2A] font-semibold px-2 py-1 rounded-lg hover:bg-[#FFF0F4] transition-colors"
        aria-label={m.locale.label}
      >
        🌐 <span className="hidden sm:inline">{LOCALE_LABELS[locale]}</span>
        <span className="sm:hidden">{locale.toUpperCase().slice(0, 2)}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-2xl shadow-xl border border-[#FFD4A8]/50 py-2 min-w-[160px] max-h-72 overflow-y-auto">
            {LOCALES.map(l => (
              <button
                key={l}
                onClick={() => { setLocale(l); setOpen(false) }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-[#FFF8F0] ${locale === l ? 'text-[#FF8FA8] font-bold' : 'text-[#6B4C2A]'}`}
              >
                {LOCALE_LABELS[l]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
