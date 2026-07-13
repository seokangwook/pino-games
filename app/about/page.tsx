import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '피노 게임 소개 · About — Pino Games | Revely',
  description:
    'Pino Games는 피노 고양이와 함께하는 무료 미니 게임 모음입니다. 카드 뒤집기·마작 솔리테어·기억력 훈련 게임을 제공합니다.',
  alternates: { canonical: 'https://pino-games.revely.company/about' },
  robots: { index: true, follow: true },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto text-[#3a2b1a] leading-relaxed">
        <p className="text-xs tracking-widest text-[#A0785A] font-semibold">ABOUT</p>
        <h1 className="text-3xl md:text-4xl font-black text-[#6B4C2A] mt-2">
          피노 게임 · Pino Games
        </h1>
        <p className="mt-2 text-lg text-[#A0785A]">
          귀여운 고양이와 함께하는 무료 미니 게임 모음
        </p>

        <h2 className="text-xl font-bold mt-10 pb-2 border-b-2 border-orange-100 text-[#6B4C2A]">
          1. 어떤 게임인가요?
        </h2>
        <p className="mt-3 text-[15px]">
          Pino Games는 <strong>귀여운 고양이 캐릭터 피노와 단비</strong>가 등장하는 무료 미니 게임
          모음집입니다. 광고 몇 개만 감수하면 로그인 없이도 언제든 시작할 수 있고, 게임 성과를
          저장하고 다른 사용자와 겨루고 싶다면 Google 또는 Kakao 계정으로 로그인해 랭킹에 참여할 수
          있습니다. 모바일·태블릿·PC 모든 화면에서 반응형으로 동작합니다.
        </p>

        <h2 className="text-xl font-bold mt-8 pb-2 border-b-2 border-orange-100 text-[#6B4C2A]">
          2. 지금 즐길 수 있는 게임
        </h2>
        <div className="mt-4 space-y-4">
          <GameCard
            emoji="🃏"
            title="카드 뒤집기 (Card Flip)"
            body="같은 그림의 고양이 카드 두 장을 찾아 짝을 맞추는 클래식 기억력 게임. 4×4·4×6·6×6 세 가지 그리드를 지원하며, 1:1 실시간 멀티플레이로 친구·랭커와 겨룰 수 있습니다. 카드마다 피노와 친구들의 새로운 표정이 나타나 매 판이 다릅니다."
          />
          <GameCard
            emoji="🀄"
            title="마작 솔리테어 (Mahjong Solitaire) · 준비 중"
            body="고양이 마작패 이미지를 활용한 클래식 마작 솔리테어. 짝이 맞는 패 두 장을 찾아 모든 패를 제거하면 클리어. 3가지 난이도(초급·중급·고급)와 매일 새로 배치되는 데일리 챌린지를 준비 중입니다."
          />
        </div>

        <h2 className="text-xl font-bold mt-8 pb-2 border-b-2 border-orange-100 text-[#6B4C2A]">
          3. 특징 / Features
        </h2>
        <ul className="mt-3 list-disc pl-5 space-y-2 text-[15px]">
          <li>
            <strong>완전 무료.</strong> 게임 자체는 광고 시청 없이 무제한 이용 가능합니다.
          </li>
          <li>
            <strong>다국어 지원.</strong> 한국어·영어·일본어·중국어(간체·번체)·스페인어 등 16개
            언어를 자동 감지합니다.
          </li>
          <li>
            <strong>랭킹 · 배지.</strong> 로그인 시 최고 기록·최다 클리어·연속 승리 배지를 획득할
            수 있습니다.
          </li>
          <li>
            <strong>사운드 · BGM.</strong> 카페 분위기의 힐링 BGM (Revely 소속 pinocafe 채널
            원곡)이 자동 재생되며 언제든 끌 수 있습니다.
          </li>
          <li>
            <strong>기억력 훈련.</strong> 재미로 하는 게임이지만 짝맞추기 규칙상 단기 기억력·주의력
            훈련에 도움이 됩니다. 어르신·아이들과 함께 하기에도 좋습니다.
          </li>
        </ul>

        <h2 className="text-xl font-bold mt-8 pb-2 border-b-2 border-orange-100 text-[#6B4C2A]">
          4. 캐릭터 / Characters
        </h2>
        <p className="mt-3 text-[15px]">
          피노와 단비는 Revely의 마스코트 고양이입니다. 카페 BGM 브랜드{' '}
          <strong>pinocafe</strong>의 YouTube 채널과 이 게임에서 서로 다른 표정·의상으로 등장합니다.
          게임 카드에는 총 20종 이상의 표정 이미지가 준비되어 있으며, 시즌마다 새 이미지가
          추가됩니다.
        </p>

        <h2 className="text-xl font-bold mt-8 pb-2 border-b-2 border-orange-100 text-[#6B4C2A]">
          5. 팀 · 운영자 / Team
        </h2>
        <p className="mt-3 text-[15px]">
          Pino Games는 <strong>레브 (Reve) · revely.team</strong>이 만드는 앱 스튜디오{' '}
          <a className="underline text-[#7c3aed]" href="https://revely.company">
            Revely
          </a>
          가 운영합니다. 한 사람이 기획·프로그래밍·일러스트를 담당하고, BGM은 pinocafe 채널에서
          자체 제작된 원곡을 사용합니다. 새 게임과 이미지는 매주 조금씩 업데이트됩니다.
        </p>

        <h2 className="text-xl font-bold mt-8 pb-2 border-b-2 border-orange-100 text-[#6B4C2A]">
          6. 관련 앱 / Related
        </h2>
        <ul className="mt-3 list-disc pl-5 space-y-1 text-[15px]">
          <li>
            <a className="underline text-[#7c3aed]" href="https://kkumjaru.revely.company">
              꿈자루 · Kkumjaru
            </a>{' '}
            — AI 꿈해몽
          </li>
          <li>
            <a className="underline text-[#7c3aed]" href="https://name.revely.company">
              내 이름 희귀도 · Name Rarity
            </a>
          </li>
          <li>
            <a className="underline text-[#7c3aed]" href="https://memory.revely.company">
              기억마루 · Memory Maru
            </a>{' '}
            — 매일 5분 기억 훈련 (어르신·가족용)
          </li>
          <li>
            <a className="underline text-[#7c3aed]" href="https://moi.revely.company">
              Moi
            </a>{' '}
            — 나만의 시작 페이지
          </li>
        </ul>

        <h2 className="text-xl font-bold mt-8 pb-2 border-b-2 border-orange-100 text-[#6B4C2A]">
          7. 문의 / Contact
        </h2>
        <p className="mt-3 text-[15px]">
          버그 신고, 새 게임 아이디어, 번역 제안은{' '}
          <a className="underline text-[#7c3aed]" href="mailto:support@revely.company">
            support@revely.company
          </a>{' '}
          로 보내 주세요. 영업일 기준 1–3일 안에 답변드립니다.
        </p>

        <h2 className="text-xl font-bold mt-8 pb-2 border-b-2 border-orange-100 text-[#6B4C2A]">
          8. 사업자 정보 / Legal entity
        </h2>
        <div className="mt-3 rounded-lg border border-orange-100 bg-orange-50/50 p-4 text-sm">
          <p><strong>상호:</strong> 레브 (Reve)</p>
          <p><strong>대표자:</strong> 서강욱</p>
          <p><strong>사업자등록번호:</strong> 677-07-02132</p>
          <p><strong>주소:</strong> 경기도 파주시 미래로 562, 905동 1402호</p>
          <p><strong>이메일:</strong> support@revely.company</p>
        </div>

        <footer className="mt-10 pt-6 border-t border-orange-100 text-center text-sm text-[#A0785A]">
          <Link className="underline" href="/">홈</Link> ·{' '}
          <Link className="underline" href="/privacy">Privacy</Link> ·{' '}
          <Link className="underline" href="/terms">Terms</Link> ·{' '}
          <a className="underline" href="https://revely.company">Revely</a>
        </footer>
      </div>
    </main>
  )
}

function GameCard({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-orange-100 bg-white/60 p-5">
      <div className="flex items-start gap-3">
        <div className="text-3xl">{emoji}</div>
        <div>
          <div className="font-bold text-[#6B4C2A]">{title}</div>
          <p className="text-sm text-[#5a4535] mt-1">{body}</p>
        </div>
      </div>
    </div>
  )
}
