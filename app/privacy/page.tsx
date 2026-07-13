import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '개인정보처리방침 · Privacy Policy — Pino Games | Revely',
  description:
    'Pino Games(pino-games.revely.company) 개인정보처리방침. 한국 개인정보 보호법(PIPA)과 EU GDPR 준수, 익명 사용 데이터·계정 정보 처리 원칙.',
  alternates: { canonical: 'https://pino-games.revely.company/privacy' },
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto text-[#3a2b1a] leading-relaxed">
        <p className="text-xs tracking-widest text-[#A0785A] font-semibold">PRIVACY POLICY</p>
        <h1 className="text-3xl font-black text-[#6B4C2A] mt-2">개인정보처리방침 · Privacy Policy</h1>
        <p className="mt-2 text-sm text-[#A0785A]">
          시행일 / Effective: 2026-05-20 · 최종 갱신 / Last updated: 2026-07-13
        </p>

        <p className="mt-4 text-[15px]">
          레브 (Reve) (이하 "회사")가 운영하는{' '}
          <strong>피노 게임 · Pino Games (pino-games.revely.company)</strong>는 한국 개인정보 보호법
          (PIPA) 및 EU GDPR을 준수합니다. 본 방침은 Pino Games 서비스의 모든 페이지에 적용됩니다.
        </p>

        <H2>1. 수집하는 정보 / Data we collect</H2>
        <p className="text-[15px] mt-2">
          <strong>가. 익명 게임 데이터.</strong> 사용자의 게임 진행 상태(현재 뒤집힌 카드, 점수, 시간
          등)는 서버 저장 없이 브라우저 메모리에서만 처리됩니다. 최고 기록은 랭킹 참여 사용자에
          한해 서버에 저장됩니다.
        </p>
        <p className="text-[15px] mt-2">
          <strong>나. 계정 정보 (선택).</strong> 랭킹 참여를 원할 경우 Google 또는 Kakao 로그인이
          필요합니다. 이때 서비스는 로그인 공급자로부터{' '}
          <strong>표시 이름·프로필 이미지 URL·고유 식별자</strong>만 받고, 이메일 주소는 저장하지
          않습니다.
        </p>
        <p className="text-[15px] mt-2">
          <strong>다. 기술 정보.</strong> IP 주소(어뷰즈 차단 목적으로 일시 확인, 저장 X),
          브라우저·OS·기기 식별자, 광고 식별자(AdSense용), 접속 로그(30일 후 자동 삭제).
        </p>

        <H2>2. 이용 목적 / Purposes of use</H2>
        <ul className="mt-2 list-disc pl-5 text-[15px] space-y-1">
          <li>게임 진행 · 최고 기록 저장 · 랭킹 서비스 제공</li>
          <li>서비스 품질 개선 (익명 집계 통계)</li>
          <li>Google AdSense 광고 personalization</li>
          <li>어뷰즈 · 부정 사용 방지</li>
        </ul>

        <H2>3. 보관 기간 / Data retention</H2>
        <table className="mt-3 w-full text-sm border-collapse">
          <thead>
            <tr>
              <Th>구분</Th>
              <Th>보관 기간</Th>
              <Th>근거</Th>
            </tr>
          </thead>
          <tbody>
            <Tr><Td>진행 중 게임 상태</Td><Td>브라우저 세션 종료 시</Td><Td>사용자 자기 통제</Td></Tr>
            <Tr><Td>랭킹 최고 기록</Td><Td>계정 삭제 시까지</Td><Td>사용자 동의</Td></Tr>
            <Tr><Td>접속 로그</Td><Td>30일</Td><Td>통신비밀보호법</Td></Tr>
          </tbody>
        </table>

        <H2>4. 제3자 제공 및 처리위탁 / Third parties & processors</H2>
        <table className="mt-3 w-full text-sm border-collapse">
          <thead>
            <tr>
              <Th>업체</Th>
              <Th>위탁 업무</Th>
              <Th>위치</Th>
            </tr>
          </thead>
          <tbody>
            <Tr><Td>Google LLC (AdSense)</Td><Td>광고 게재 · 측정</Td><Td>미국</Td></Tr>
            <Tr><Td>Google Analytics</Td><Td>익명 방문 통계</Td><Td>미국</Td></Tr>
            <Tr><Td>Google Sign-In (OAuth)</Td><Td>로그인 · 신원 확인</Td><Td>미국</Td></Tr>
            <Tr><Td>Kakao (OAuth)</Td><Td>로그인 · 신원 확인</Td><Td>대한민국</Td></Tr>
            <Tr><Td>Supabase Inc.</Td><Td>계정 · 랭킹 데이터베이스</Td><Td>대한민국 · 미국</Td></Tr>
            <Tr><Td>Vercel Inc.</Td><Td>호스팅 · CDN</Td><Td>글로벌 엣지</Td></Tr>
          </tbody>
        </table>
        <p className="mt-3 text-[15px]">
          위 업체 중 일부는 미국 등 한국 외 지역에서 데이터를 처리합니다. 회사는 GDPR 표준계약조항
          (SCC) 및 한국 개인정보 보호법 제28조의8에 따라 안전조치를 확인하고 데이터를 이전합니다.
        </p>

        <H2>5. 사용자 권리 / Your rights</H2>
        <p className="text-[15px] mt-2">
          사용자는 열람권 · 정정·삭제권 · 처리정지권 · 이의제기권 · 데이터 이동권 · 동의 철회권을
          언제든 행사할 수 있습니다. 요청은{' '}
          <a className="underline text-[#7c3aed]" href="mailto:support@revely.company">support@revely.company</a>{' '}
          으로 보내 주세요. 영업일 기준 3일 안에 처리합니다.
        </p>

        <H2>6. 쿠키 및 광고 / Cookies & advertising</H2>
        <p className="text-[15px] mt-2">
          본 사이트는 언어 설정·로그인 세션·분석·광고 목적으로 쿠키를 사용합니다. 사용자는 브라우저
          설정에서 쿠키를 비활성화할 수 있으며, 그 경우 로그인 유지·개인화 광고에 영향이 있을 수
          있습니다.
        </p>
        <p className="text-[15px] mt-2">
          <strong>Google AdSense 공지.</strong> 본 사이트는 Google AdSense를 통해 광고를 게재할 수
          있습니다. Google을 비롯한 제3자 공급업체는 쿠키(DART 쿠키 포함)를 사용해 사용자의 방문
          이력에 기반해 광고를 게재합니다. 사용자는{' '}
          <a className="underline text-[#7c3aed]" href="https://adssettings.google.com" target="_blank" rel="noopener">Google 광고 설정</a>{' '}
          ·{' '}
          <a className="underline text-[#7c3aed]" href="https://youronlinechoices.eu" target="_blank" rel="noopener">EU: youronlinechoices.eu</a>{' '}
          ·{' '}
          <a className="underline text-[#7c3aed]" href="https://aboutads.info" target="_blank" rel="noopener">US: aboutads.info</a>{' '}
          에서 맞춤 광고를 opt-out 할 수 있습니다.
        </p>

        <H2>7. 회사 정보 / Company information</H2>
        <div className="mt-3 rounded-lg border border-orange-100 bg-orange-50/50 p-4 text-sm">
          <p><strong>상호:</strong> 레브 (Reve)</p>
          <p><strong>대표자 · 개인정보 책임자:</strong> 서강욱</p>
          <p><strong>사업자등록번호:</strong> 677-07-02132</p>
          <p><strong>주소:</strong> 경기도 파주시 미래로 562, 905동 1402호</p>
          <p><strong>이메일:</strong> support@revely.company</p>
        </div>

        <H2>8. 변경 고지 / Notice of changes</H2>
        <p className="text-[15px] mt-2">
          회사는 본 방침을 변경할 경우 변경 사항을 본 페이지에 게시하고, 중요한 변경에는 시행 30일
          전부터 별도 안내를 제공합니다. Revely 통합 정책은{' '}
          <a className="underline text-[#7c3aed]" href="https://revely.company/privacy">revely.company/privacy</a>도
          함께 참고해 주세요.
        </p>

        <footer className="mt-10 pt-6 border-t border-orange-100 text-center text-sm text-[#A0785A]">
          <Link className="underline" href="/">홈</Link> ·{' '}
          <Link className="underline" href="/about">About</Link> ·{' '}
          <Link className="underline" href="/terms">Terms</Link> ·{' '}
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
function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left font-semibold px-3 py-2 border border-orange-100 bg-orange-50/50">{children}</th>
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2 border border-orange-100">{children}</td>
}
function Tr({ children }: { children: React.ReactNode }) {
  return <tr>{children}</tr>
}
