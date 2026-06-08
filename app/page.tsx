'use client'
import Link from 'next/link'
import Image from 'next/image'
import { LoginButton } from '@/components/auth/LoginButton'
import { AudioToggle } from '@/components/ui/AudioToggle'
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher'
import { useT } from '@/lib/i18n-client'

export default function Home() {
  const { m } = useT()
  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-2xl flex justify-end items-center mb-2 gap-2">
        <LocaleSwitcher />
        <AudioToggle bgmKey="main" />
        <Link href="/ranking" className="text-sm text-[#A0785A] hover:text-[#6B4C2A] font-semibold">{m.home.ranking}</Link>
        <LoginButton />
      </div>
      <div className="text-center mb-10">
        <div className="relative w-32 h-32 mx-auto mb-4 bounce-soft">
          <Image src="/cats/pino_danbi.png" alt="피노&단비" fill className="object-contain drop-shadow-lg" priority />
        </div>
        <h1 className="text-4xl font-black text-[#6B4C2A] tracking-tight">{m.meta.title}</h1>
        <p className="text-[#A0785A] mt-2 text-lg">{m.home.tagline}</p>
      </div>
      <div className="w-full max-w-2xl flex flex-col gap-4">
        <Link href="/cards" className="group">
          <div className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-lg border border-[#FFD4A8]/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-center">
            <div className="text-6xl mb-4">🃏</div>
            <h2 className="text-2xl font-bold text-[#6B4C2A] mb-2">{m.home.cardGame.title}</h2>
            <p className="text-[#A0785A] text-sm leading-relaxed">{m.home.cardGame.desc}<br />{m.home.cardGame.subDesc}</p>
            <div className="mt-5 inline-block bg-[#FFB7C5] text-white font-bold px-6 py-2.5 rounded-full group-hover:bg-[#FF8FA8] transition-colors">{m.home.cardGame.cta}</div>
          </div>
        </Link>
        {process.env.VERCEL_ENV !== 'production' && (
          <Link href="/find" className="group">
            <div className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-lg border border-[#FFD4A8]/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-[#6B4C2A] mb-2">{m.home.findGame.title}</h2>
              <p className="text-[#A0785A] text-sm leading-relaxed">{m.home.findGame.desc}<br />{m.home.findGame.subDesc}</p>
              <div className="mt-5 inline-block bg-[#FFD166] text-[#6B4C2A] font-bold px-6 py-2.5 rounded-full group-hover:bg-[#FFC233] transition-colors">{m.home.findGame.cta}</div>
            </div>
          </Link>
        )}
      </div>
      <p className="mt-6 text-[#C0A88A] text-sm">{m.home.footer.replace('revely.company', '')} <a href="https://revely.company" className="underline">revely.company</a></p>
    </main>
  )
}
