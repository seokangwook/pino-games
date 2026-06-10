import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { InAppBrowserGuard } from '@/components/auth/InAppBrowserGuard'
import { I18nProvider } from '@/lib/i18n-client'
import koMessages from '@/messages/ko.json'

const ADSENSE_PUB = 'ca-pub-4128588337803742'

const SITE_URL = 'https://pino-games.revely.company'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: '피노 게임 — 귀여운 고양이 카드 맞추기 미니게임 · Pino Games',
  description:
    '피노 고양이와 함께하는 무료 카드 매칭 게임. 기억력 훈련 + 마작 솔리테어. 로그인하면 랭킹 도전! 모바일·PC 모두 즐길 수 있어요.',
  keywords: [
    '피노 게임',
    '카드 뒤집기',
    '기억력 게임',
    '미니게임',
    '고양이 게임',
    '마작 솔리테어',
    '무료 게임',
    'pino games',
    'memory card game',
    'cat game',
    'revely',
  ],
  applicationName: 'Pino Games',
  authors: [{ name: 'REVELY', url: 'https://revely.company' }],
  openGraph: {
    title: '피노 게임 — 고양이 카드 맞추기',
    description: '피노 고양이와 함께하는 무료 카드 매칭 게임. 기억력 훈련 + 랭킹 도전!',
    type: 'website',
    url: SITE_URL,
    siteName: 'Pino Games',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: '피노 게임 — 고양이 카드 맞추기',
    description: '피노 고양이와 함께하는 무료 카드 매칭 게임. 기억력 훈련 + 랭킹 도전!',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "피노 게임 (Pino Games)",
              description: "피노 고양이와 함께하는 무료 카드 매칭 게임. 기억력 훈련 + 마작 솔리테어 + 랭킹 도전.",
              url: SITE_URL,
              applicationCategory: "Game",
              genre: "Casual",
              operatingSystem: "Web",
              inLanguage: "ko",
              offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
              publisher: { "@type": "Organization", name: "REVELY", url: "https://revely.company" },
            }),
          }}
        />
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUB}`}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body className="antialiased">
        <I18nProvider initialMessages={koMessages as Parameters<typeof I18nProvider>[0]['initialMessages']}>
          <InAppBrowserGuard>
            <AuthProvider>{children}</AuthProvider>
          </InAppBrowserGuard>
        </I18nProvider>
      </body>
    </html>
  )
}
