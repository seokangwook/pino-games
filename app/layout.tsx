import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { AuthProvider } from '@/components/auth/AuthProvider'

const ADSENSE_PUB = 'ca-pub-4128588337803742'

export const metadata: Metadata = {
  title: '피노 게임 🐱',
  description: '피노 고양이와 함께 하는 카드 뒤집기',
  keywords: '피노,고양이,게임,카드',
  openGraph: {
    title: '피노 게임 🐱',
    description: '피노 고양이와 함께 하는 카드 뒤집기',
    type: 'website',
    url: 'https://pino-games.revely.company',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <Script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUB}`}
          crossOrigin="anonymous" strategy="lazyOnload" />
      </head>
      <body className="antialiased"><AuthProvider>{children}</AuthProvider></body>
    </html>
  )
}
