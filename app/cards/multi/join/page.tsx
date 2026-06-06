'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useRoomStore } from '@/lib/store/roomStore'
import Link from 'next/link'

function JoinFlow() {
  const params = useSearchParams()
  const router = useRouter()
  const code = params.get('code')
  const { joinRoom } = useRoomStore()
  const [failed, setFailed] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!code) { router.replace('/cards'); return }
    joinRoom(code.toUpperCase()).then(ok => {
      if (ok) {
        router.replace('/cards')
      } else {
        const storeError = useRoomStore.getState().error
        setErrorMsg(storeError ?? '방을 찾을 수 없습니다')
        setFailed(true)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (failed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-6 text-center">
        <div className="text-6xl">😿</div>
        <h1 className="text-2xl font-black text-[#6B4C2A]">입장 실패</h1>
        <p className="text-sm text-[#A0785A] max-w-xs leading-relaxed">
          {errorMsg === '방을 찾을 수 없습니다'
            ? '방을 찾을 수 없어요. 호스트에게 초대 링크를 다시 받으세요.'
            : errorMsg}
        </p>
        <Link href="/"
          className="mt-2 bg-[#FFB7C5] hover:bg-[#FF8FA8] text-white font-bold px-7 py-3 rounded-2xl transition-colors">
          홈으로
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="text-6xl bounce-soft">🐾</div>
      <p className="text-lg font-black text-[#6B4C2A]">방에 입장 중...</p>
      <div className="w-6 h-6 border-2 border-[#FFB7C5] border-t-transparent rounded-full animate-spin mt-2" />
    </div>
  )
}

export default function JoinPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-6xl bounce-soft">🐾</div>
        <p className="text-lg font-black text-[#6B4C2A]">방에 입장 중...</p>
      </div>
    }>
      <JoinFlow />
    </Suspense>
  )
}
