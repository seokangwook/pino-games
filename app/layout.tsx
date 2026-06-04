import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '피노 미니게임 🐱',
  description: '피노 고양이와 함께 하는 카드 뒤집기 & 마작 솔리테어',
  keywords: '피노,고양이,게임,카드,마작,솔리테어',
  openGraph: {
    title: '피노 미니게임 🐱',
    description: '피노 고양이와 함께 하는 카드 뒤집기 & 마작 솔리테어',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  )
}
