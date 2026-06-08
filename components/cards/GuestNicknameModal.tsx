'use client'
import { useState, useEffect } from 'react'
import { validateNickname } from '@/lib/nickname'
import { supabase } from '@/lib/store/authStore'
import { useT } from '@/lib/i18n-client'

interface Props {
  onConfirm: (nickname: string) => void
  onSkip: () => void
}

export function GuestNicknameModal({ onConfirm, onSkip }: Props) {
  const { m } = useT()
  const [nick, setNick] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [duplicateError, setDuplicateError] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)
  const [saving, setSaving] = useState(false)
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setDuplicateError(null)
    if (timer) clearTimeout(timer)
    const validErr = nick.trim() ? validateNickname(nick, 'user') : null
    setValidationError(validErr)
    if (!validErr && nick.trim().length >= 2) {
      setChecking(true)
      const t = setTimeout(async () => {
        const { data: dup } = await supabase.from('profiles').select('id').ilike('nickname', nick.trim()).limit(1)
        setDuplicateError((dup?.length ?? 0) > 0 ? m.auth.duplicate : null)
        setChecking(false)
      }, 300)
      setTimer(t)
    } else { setChecking(false) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nick])

  const error = validationError || duplicateError
  const canSave = !error && !checking && nick.trim().length >= 2

  async function handleSave() {
    if (!canSave) return
    const finalErr = validateNickname(nick.trim(), 'user')
    if (finalErr) { setValidationError(finalErr); return }
    setSaving(true)
    onConfirm(nick.trim())
  }

  const statusIcon = checking ? '⏳' : error ? '❌' : nick.trim().length >= 2 ? '✅' : ''

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center">
        <div className="text-5xl mb-2">🏆</div>
        <h2 className="text-xl font-black text-[#6B4C2A] mb-1">{m.guestNickname.title}</h2>
        <p className="text-[#A0785A] text-sm mb-5">
          {m.guestNickname.subtitle}
          <br /><span className="text-xs text-[#C0A88A]">{m.guestNickname.hint}</span>
        </p>
        <div className="relative mb-2">
          <input
            type="text"
            value={nick}
            onChange={e => setNick(e.target.value.slice(0, 10))}
            placeholder={m.guestNickname.placeholder}
            onKeyDown={e => e.key === 'Enter' && canSave && handleSave()}
            className={`w-full border-2 rounded-2xl px-4 py-3 text-center text-lg font-bold text-[#6B4C2A] focus:outline-none transition-colors pr-10 ${error ? 'border-red-400 bg-red-50' : nick.trim().length >= 2 && !checking ? 'border-green-400 bg-green-50' : 'border-[#FFD4A8] focus:border-[#FFB7C5]'}`}
            autoFocus
          />
          {nick.length > 0 && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base">{statusIcon}</span>
          )}
        </div>
        <div className="flex justify-between items-center text-xs mb-4 px-1">
          <span className={error ? 'text-red-500' : 'text-[#A0785A]'}>
            {error || (checking ? m.auth.nicknameChecking : '')}
          </span>
          <span className="text-[#C0A88A]">{nick.length}/10</span>
        </div>
        <button
          onClick={handleSave}
          disabled={!canSave || saving}
          className={`w-full font-bold py-3 rounded-2xl transition-all shadow-md mb-2 ${canSave && !saving ? 'bg-[#FFB7C5] hover:bg-[#FF8FA8] text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
        >
          {saving ? '저장 중...' : m.guestNickname.save}
        </button>
        <p className="text-xs text-[#C0A88A] mb-3">{m.guestNickname.persist}</p>
        <button onClick={onSkip} className="text-xs text-[#C0A88A] underline">
          {m.guestNickname.skip}
        </button>
      </div>
    </div>
  )
}
