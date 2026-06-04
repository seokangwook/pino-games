'use client'
import { useState, useEffect } from 'react'
import { useAuthStore, supabase } from '@/lib/store/authStore'
import { validateNickname } from '@/lib/nickname'

export function NicknameModal() {
  const { needsNickname, saveNickname } = useAuthStore()
  const [nick, setNick] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [duplicateError, setDuplicateError] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)
  const [saving, setSaving] = useState(false)
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setDuplicateError(null)
    if (timer) clearTimeout(timer)
    const validErr = nick.trim() ? validateNickname(nick) : null
    setValidationError(validErr)
    if (!validErr && nick.trim().length >= 2) {
      setChecking(true)
      const t = setTimeout(async () => {
        const { data: dup } = await supabase.from('profiles').select('id').ilike('nickname', nick.trim()).limit(1)
        const isDup = (dup?.length ?? 0) > 0
        setDuplicateError(isDup ? '이미 사용 중인 닉네임입니다' : null)
        setChecking(false)
      }, 300)
      setTimer(t)
    } else { setChecking(false) }
  }, [nick])

  if (!needsNickname) return null

  const error = validationError || duplicateError
  const canSave = !error && !checking && nick.trim().length >= 2

  async function handleSave() {
    if (!canSave) return
    const finalErr = validateNickname(nick.trim())
    if (finalErr) { setValidationError(finalErr); return }
    setSaving(true)
    const err = await saveNickname(nick.trim())
    setSaving(false)
    if (err) setDuplicateError(err)
  }

  const statusIcon = checking ? '⏳' : error ? '❌' : nick.trim().length >= 2 ? '✅' : ''

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center">
        <div className="text-5xl mb-4">🐱</div>
        <h2 className="text-2xl font-black text-[#6B4C2A] mb-1">닉네임 설정</h2>
        <p className="text-[#A0785A] text-sm mb-6">
          랭킹에 표시될 이름을 정해주세요<br />
          <span className="text-xs text-[#C0A88A]">한글·영문·숫자 2~10자 · 중복/욕설/사칭 X</span>
        </p>
        <div className="relative mb-2">
          <input type="text" value={nick}
            onChange={e => setNick(e.target.value.slice(0, 10))}
            placeholder="닉네임 입력 (2~10자)"
            onKeyDown={e => e.key === 'Enter' && canSave && handleSave()}
            className={`w-full border-2 rounded-2xl px-4 py-3 text-center text-lg font-bold text-[#6B4C2A] focus:outline-none transition-colors pr-10 ${error ? 'border-red-400 bg-red-50' : nick.trim().length >= 2 && !checking ? 'border-green-400 bg-green-50' : 'border-[#FFD4A8] focus:border-[#FFB7C5]'}`}
            autoFocus />
          {nick.length > 0 && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base">{statusIcon}</span>}
        </div>
        <div className="flex justify-between items-center text-xs mb-3 px-1">
          <span className={`${error ? 'text-red-500' : 'text-[#A0785A]'}`}>{error || (checking ? '중복 확인 중...' : '')}</span>
          <span className="text-[#C0A88A]">{nick.length}/10</span>
        </div>
        <button onClick={handleSave} disabled={!canSave || saving}
          className={`w-full font-bold py-3 rounded-2xl transition-all shadow-md ${canSave && !saving ? 'bg-[#FFB7C5] hover:bg-[#FF8FA8] text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
          {saving ? '저장 중...' : '저장하기 🐾'}
        </button>
        <p className="text-xs text-[#C0A88A] mt-3">운명연구소·나어때·피노 게임 전체에서 사용됩니다</p>
      </div>
    </div>
  )
}
