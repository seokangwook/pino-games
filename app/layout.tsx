import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { InAppBrowserGuard } from '@/components/auth/InAppBrowserGuard'
import { I18nProvider } from '@/lib/i18n-client'
import koMessages from '@/messages/ko.json'

const ADSENSE_PUB = 'ca-pub-4128588337803742'

export const metadata: Metadata = {
  title: 'Pino Games 🐱',
  description: 'Memory card matching game with Pino the cat',
  keywords: 'pino,cat,game,card,memory',
  openGraph: {
    title: 'Pino Games 🐱',
    description: 'Memory card matching game with Pino the cat',
    type: 'website',
    url: 'https://pino-games.revely.company',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
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
