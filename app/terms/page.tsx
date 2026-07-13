import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '이용약관 · Terms of Service — Pino Games | Revely',
  description:
    'Pino Games 이용약관. 서비스 정의·사용 자격·무료·광고·랭킹·금지 행위·책임 한계·분쟁 해결 조항.',
  alternates: { canonical: 'https://pino-games.revely.company/terms' },
  robots: { index: true, follow: true },
}

export default function TermsPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto text-[#3a2b1a] leading-relaxed">
        <p className="text-xs tracking-widest text-[#A0785A] font-semibold">TERMS OF SERVICE</p>
        <h1 className="text-3xl font-black text-[#6B4C2A] mt-2">이용약관 · Terms of Service</h1>
        <p className="mt-2 text-sm text-[#A0785A]">
          시행일 / Effective: 2026-05-20 · 최종 갱신 / Last updated: 2026-07-13
        </p>

        <p className="mt-4 text-[15px]">
          본 약관은 레브 (Reve) (이하 "회사")가 운영하는{' '}
          <strong>피노 게임 · Pino Games (pino-games.revely.company)</strong> 서비스의 이용 조건을
          규정합니다. 서비스를 이용함으로써 사용자는 본 약관에 동의한 것으로 간주됩니다.
        </p>

        <H2>1. 서비스 정의 / Service definition</H2>
        <p className="mt-2 text-[15px]">
          Pino Games는 웹 브라우저에서 즉시 실행되는 무료 미니 게임 모음입니다. 현재 카드 뒤집기
          게임을 제공하고 있으며, 마작 솔리테어 등 신규 게임이 지속적으로 추가됩니다. 모든 결과는
          엔터테인먼트 목적이며 상금·현금 보상을 제공하지 않습니다.
        </p>

        <H2>2. 사용 자격 / Eligibility</H2>
        <ul className="mt-2 list-disc pl-5 text-[15px] space-y-1">
          <li>만 14세 이상이어야 본 서비스를 이용할 수 있습니다.</li>
          <li>일부 지역에서는 현지법에 따라 더 높은 연령 제한이 적용될 수 있습니다.</li>
          <li>랭킹 참여를 위한 계정 로그인은 Google · Kakao OAuth로 제한됩니다.</li>
        </ul>

        <H2>3. 무료 · 광고 지원 / Free & ad-supported</H2>
        <p className="mt-2 text-[15px]">
          모든 게임은 완전 무료입니다. 서비스는 Google AdSense 광고 수익으로 운영됩니다. 광고는
          홈·게임 종료 화면에만 배치하며, 진행 중인 게임 플레이를 방해하지 않습니다. 향후 프리미엄
          기능(광고 제거·전용 스킨 등)이 추가될 수 있으며, 이 경우 도입 시점에 별도 공지합니다.
        </p>

        <H2>4. 랭킹 · 부정 사용 방지 / Rankings & anti-cheat</H2>
        <p className="mt-2 text-[15px]">
          랭킹은 로그인 사용자만 참여할 수 있으며, 클라이언트 조작(개발자 도구·매크로·봇)으로
          기록을 만든 것으로 판단될 경우 랭킹 기록이 취소되고 계정이 랭킹에서 영구 배제될 수
          있습니다. 정상적인 플레이 결과가 부정 사용으로 오분류된 경우{' '}
          <a className="underline text-[#7c3aed]" href="mailto:support@revely.company">support@revely.company</a>로
          이의 신청할 수 있습니다.
        </p>

        <H2>5. 금지 행위 / Prohibited conduct</H2>
        <ul className="mt-2 list-disc pl-5 text-[15px] space-y-1">
          <li>봇·크롤러·매크로·자동화 도구를 이용한 게임 플레이 또는 랭킹 기록</li>
          <li>광고 차단 우회를 위한 비정상적 접근</li>
          <li>리버스 엔지니어링·API 무단 사용·서버 부하 유발</li>
          <li>타인 계정 도용·명예 훼손·성적 이미지 프로필 설정</li>
          <li>저작권·상표권 등 회사 또는 제3자 권리 침해</li>
        </ul>

        <H2>6. 지적 재산권 / Intellectual property</H2>
        <p className="mt-2 text-[15px]">
          피노·단비 캐릭터 일러스트, 카드 이미지, BGM(pinocafe 원곡), UI 디자인은 모두 레브 (Reve)의
          저작물입니다. 개인 SNS 게시 등 비상업적 공유는 자유롭게 하실 수 있으나, 상업적 재배포·2차
          가공은 회사의 사전 서면 동의가 필요합니다.
        </p>

        <H2>7. 책임 한계 / Limitation of liability</H2>
        <p className="mt-2 text-[15px]">
          모든 게임은 오락 목적입니다. 회사는 게임 플레이로 인한 신체적·정신적 피로, 시간 소모에
          대해 책임을 지지 않습니다. 천재지변, 통신 장애, 외부 서비스(OAuth·CDN) 장애로 인한 서비스
          중단·오류에 대해서도 책임을 지지 않습니다. 회사의 손해배상 한도는 사용자가 지난 6개월
          동안 회사에 지급한 금액을 초과하지 않습니다.
        </p>

        <H2>8. 분쟁 해결 / Dispute resolution</H2>
        <p className="mt-2 text-[15px]">
          본 약관은 대한민국 법을 준거법으로 합니다. 분쟁은 우선 협의로 해결하며, 합의가
          이루어지지 않을 경우 민사소송법상 관할 법원에 소를 제기할 수 있습니다. 한국 소비자는
          서울중앙지방법원을 1심 전속 관할로 합니다 (소비자 거주지 관할권을 침해하지 않는 범위 내).
        </p>

        <H2>9. 약관 변경 / Changes to Terms</H2>
        <p className="mt-2 text-[15px]">
          회사는 본 약관을 변경할 수 있으며, 변경 사항은 시행 7일 전 (불리한 변경의 경우 30일 전)
          본 페이지에 공지합니다. 사용자가 변경 시행일 이후에도 서비스를 계속 이용하는 경우 변경
          약관에 동의한 것으로 간주됩니다.
        </p>

        <H2>10. 사업자 정보 / Business info</H2>
        <div className="mt-3 rounded-lg border border-orange-100 bg-orange-50/50 p-4 text-sm">
          <p><strong>상호:</strong> 레브 (Reve)</p>
          <p><strong>대표자:</strong> 서강욱</p>
          <p><strong>사업자등록번호:</strong> 677-07-02132</p>
          <p><strong>주소:</strong> 경기도 파주시 미래로 562, 905동 1402호</p>
          <p><strong>이메일:</strong> support@revely.company</p>
        </div>

        <p className="mt-6 text-[15px]">
          본 약관과 함께 <Link className="underline text-[#7c3aed]" href="/privacy">개인정보처리방침</Link>이
          함께 적용됩니다.
        </p>

        <footer className="mt-10 pt-6 border-t border-orange-100 text-center text-sm text-[#A0785A]">
          <Link className="underline" href="/">홈</Link> ·{' '}
          <Link className="underline" href="/about">About</Link> ·{' '}
          <Link className="underline" href="/privacy">Privacy</Link> ·{' '}
          <a className="underline" href="https://revely.company">Revely</a>
        </footer>
      </div>
    </main>
  )
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-bold mt-6 pb-1 border-b border-orange-100 text-[#6B4C2A]">
      {children}
    </h2>
  )
}
