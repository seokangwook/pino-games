import type { Metadata } from 'next'
import { Suspense } from 'react'
import JoinFlow from './JoinFlow'

const GAME_ORIGIN = 'https://pino-games.revely.company'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>
}): Promise<Metadata> {
  const { code } = await searchParams
  const url = code
    ? `${GAME_ORIGIN}/cards/multi/join?code=${code}`
    : `${GAME_ORIGIN}`
  return {
    title: code ? `${code} 방 입장 | 피노 게임` : '방 입장 | 피노 게임',
    description: code
      ? `방 코드 ${code}로 카드 뒤집기 대결 입장하기`
      : '초대 링크로 카드 뒤집기 대결 입장',
    openGraph: {
      title: code ? `🐾 피노 게임 — ${code} 방 입장` : '🐾 피노 게임',
      description: '링크 클릭하면 바로 카드 뒤집기 대결에 입장돼!',
      url,
      siteName: '피노 게임',
    },
  }
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
