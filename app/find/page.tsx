import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { FindGame } from './FindGame'

export const metadata: Metadata = {
  title: '숨은 피노 찾기 🐱',
  description: '한국 전통 시장에 숨어 있는 피노 고양이 5마리를 찾아라!',
  keywords: '피노,고양이,숨은그림찾기,게임,한국시장',
  openGraph: {
    title: '숨은 피노 찾기 🐱',
    description: '5마리 고양이를 찾아라! 타임어택 숨은그림찾기',
    type: 'website',
    url: 'https://pino-games.revely.company/find',
  },
}

export default function FindPage() {
  if (process.env.VERCEL_ENV === 'production') {
    redirect('/')
  }
  return <FindGame />
}
