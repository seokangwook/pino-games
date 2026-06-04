'use client'
import { useState } from 'react'
import { useAuthStore } from '@/lib/store/authStore'

export function NicknameModal() {
  const { needsNickname, saveNickname } = useAuthStore()
  const [nick, setNick] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!needsNickname) return null

  async function handleSave() {
    const t = nick.trim()
    if (t.length < 2 || t.length > 10) { setError('2~10자로 입력해주세요'); return }
    if (!/^[가-힣a-zA-Z0-9_]+$/.test(t)) { setError('한글·영문·숫자·_ 만 가능합니다'); return }
    setLoading(true)
    const err = await saveNickname(t)
    setLoading(false)
    if (err) setError(err)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center">
        <div className="text-5xl mb-4">🐱</div>
        <h2 className="text-2xl font-black text-[#6B4C2A] mb-2">닉네임 설정</h2>
        <p className="text-[#A0785A] text-sm mb-6">랭킹에 표시될 이름을 정해주세요</p>
        <input type="text" value={nick} onChange={e => { setNick(e.target.value); setError(null) }}
          placeholder="2~10자 (한글·영문·숫자·_)" maxLength={10}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          className="w-full border-2 border-[#FFD4A8] rounded-2xl px-4 py-3 text-center text-lg font-bold text-[#6B4C2A] focus:outline-none focus:border-[#FFB7C5] mb-3"
          autoFocus />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button onClick={handleSave} disabled={loading || nick.trim().length < 2}
          className="w-full bg-[#FFB7C5] hover:bg-[#FF8FA8] text-white font-bold py-3 rounded-2xl transition-colors disabled:opacity-50 shadow-md">
          {loading ? '저장 중...' : '저장하기 🐾'}
        </button>
        <p className="text-xs text-[#C0A88A] mt-3">피노 게임 전체에서 사용됩니다</p>
      </div>
    </div>
  )
}
