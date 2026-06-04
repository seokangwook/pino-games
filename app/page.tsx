import Link from 'next/link'
import Image from 'next/image'
import { AdSlot } from '@/components/ads/AdSlot'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-10">
      <div className="text-center mb-10">
        <div className="relative w-32 h-32 mx-auto mb-4 bounce-soft">
          <Image src="/cats/pino_danbi.png" alt="피노&단비" fill className="object-contain drop-shadow-lg" priority />
        </div>
        <h1 className="text-4xl font-black text-[#6B4C2A] tracking-tight">피노 게임</h1>
        <p className="text-[#A0785A] mt-2 text-lg">고양이들과 함께 놀아요 🐾</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        <Link href="/cards" className="group">
          <div className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-lg border border-[#FFD4A8]/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-center">
            <div className="text-6xl mb-4">🃏</div>
            <h2 className="text-2xl font-bold text-[#6B4C2A] mb-2">카드 뒤집기</h2>
            <p className="text-[#A0785A] text-sm leading-relaxed">같은 고양이 카드 2장을 찾아요<br />4×4 / 4×6 / 6×6 그리드</p>
            <div className="mt-5 inline-block bg-[#FFB7C5] text-white font-bold px-6 py-2.5 rounded-full group-hover:bg-[#FF8FA8] transition-colors">시작하기 →</div>
          </div>
        </Link>
        <Link href="/mahjong" className="group">
          <div className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-lg border border-[#FFD4A8]/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-center">
            <div className="text-6xl mb-4">🀄</div>
            <h2 className="text-2xl font-bold text-[#6B4C2A] mb-2">마작 솔리테어</h2>
            <p className="text-[#A0785A] text-sm leading-relaxed">쌓인 타일에서 같은 고양이 짝을<br />힌트·다시 섞기 지원</p>
            <div className="mt-5 inline-block bg-[#B7D4FF] text-[#1A4080] font-bold px-6 py-2.5 rounded-full group-hover:bg-[#8AB8FF] transition-colors">시작하기 →</div>
          </div>
        </Link>
      </div>
      <div className="w-full max-w-2xl mt-10">
        <AdSlot slot="6394256326" format="horizontal" />
      </div>
      <p className="mt-6 text-[#C0A88A] text-sm">© 우당탕탕 공방 · <a href="https://revely.company" className="underline">revely.company</a></p>
    </main>
  )
}
