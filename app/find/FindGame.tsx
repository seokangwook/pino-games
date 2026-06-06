'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'

const TARGETS = [
  { id: 'pino',  img: '/cats/pino_danbi.png', x: 18, y: 62, r: 6.5, label: '피노&단비', emoji: '🟠' },
  { id: 'noir',  img: '/cats/noir.png',        x: 72, y: 60, r: 5.5, label: '노아',      emoji: '⚫' },
  { id: 'luna',  img: '/cats/luna.png',        x: 42, y: 46, r: 5.5, label: '루나',      emoji: '🌙' },
  { id: 'lucky', img: '/cats/lucky.png',       x: 85, y: 70, r: 5.5, label: '럭키',      emoji: '🍀' },
  { id: 'siam',  img: '/cats/siam.png',        x: 55, y: 75, r: 5.5, label: '시암',      emoji: '🔮' },
]

function formatTime(ms: number) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}`
}

export function FindGame() {
  const [found, setFound]       = useState<Set<string>>(new Set())
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsed, setElapsed]   = useState(0)
  const [finished, setFinished] = useState(false)
  const [miss, setMiss]         = useState<{ x: number; y: number } | null>(null)
  const [hit, setHit]           = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef     = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (startTime && !finished) {
      timerRef.current = setInterval(() => setElapsed(Date.now() - startTime), 100)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [startTime, finished])

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (finished) return
    const rect = containerRef.current!.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * 100
    const py = ((e.clientY - rect.top)  / rect.height) * 100

    if (!startTime) setStartTime(Date.now())

    let gotHit = false
    for (const t of TARGETS) {
      if (found.has(t.id)) continue
      const dx = px - t.x, dy = py - t.y
      if (Math.sqrt(dx * dx + dy * dy) <= t.r) {
        const next = new Set(found)
        next.add(t.id)
        setFound(next)
        setHit(t.id)
        setTimeout(() => setHit(null), 800)
        gotHit = true
        if (next.size === TARGETS.length) {
          setFinished(true)
          if (timerRef.current) clearInterval(timerRef.current)
        }
        break
      }
    }
    if (!gotHit) {
      setMiss({ x: px, y: py })
      setTimeout(() => setMiss(null), 500)
    }
  }, [found, startTime, finished])

  const reset = () => {
    setFound(new Set())
    setStartTime(null)
    setElapsed(0)
    setFinished(false)
    setMiss(null)
    setHit(null)
  }

  const share = () => {
    const text = `${formatTime(elapsed)} 만에 5마리 모두 찾았어요! 도전해봐 → https://pino-games.revely.company/find`
    if (navigator.share) {
      navigator.share({ title: '숨은 피노 찾기', text })
    } else {
      navigator.clipboard.writeText(text).then(() => alert('클립보드에 복사됐어요!'))
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#FFF8F0] px-2 py-4">
      {/* 헤더 */}
      <div className="w-full max-w-3xl flex items-center justify-between mb-3 px-2">
        <a href="/" className="text-sm text-[#A0785A] hover:text-[#6B4C2A] font-semibold">← 홈</a>
        <div className="text-center">
          <h1 className="text-xl font-black text-[#6B4C2A]">숨은 피노 찾기</h1>
          <p className="text-xs text-[#A0785A]">5마리 고양이를 모두 찾아라!</p>
        </div>
        <div className="font-mono font-bold text-[#6B4C2A] text-lg min-w-[56px] text-right">
          {formatTime(elapsed)}
        </div>
      </div>

      {/* 진행도 뱃지 */}
      <div className="flex flex-wrap gap-1.5 mb-3 justify-center">
        {TARGETS.map(t => (
          <span
            key={t.id}
            className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-all duration-300 ${
              found.has(t.id)
                ? 'bg-[#FFB7C5] text-white scale-110 shadow-sm'
                : 'bg-white/60 text-[#A0785A]'
            }`}
          >
            {t.emoji} {t.label}
          </span>
        ))}
      </div>

      {/* 게임 캔버스 */}
      <div
        ref={containerRef}
        onClick={handleClick}
        className="relative w-full max-w-3xl cursor-crosshair overflow-hidden rounded-2xl shadow-xl border border-[#FFD4A8]/40"
        style={{ aspectRatio: '16/10' }}
      >
        <MarketBackground />

        {/* 고양이들 */}
        {TARGETS.map(t => (
          <div
            key={t.id}
            className="absolute transition-all duration-300 pointer-events-none"
            style={{
              left: `${t.x}%`,
              top:  `${t.y}%`,
              transform: 'translate(-50%, -50%)',
              width: '8%',
              opacity: found.has(t.id) ? 1 : 0.22,
              filter: hit === t.id
                ? 'drop-shadow(0 0 14px #FFD166) brightness(1.3)'
                : found.has(t.id)
                ? 'drop-shadow(0 0 8px #FFB7C5)'
                : 'none',
              zIndex: found.has(t.id) ? 20 : 10,
            }}
          >
            <Image
              src={t.img}
              alt={t.label}
              width={80}
              height={80}
              className="w-full h-auto select-none"
              draggable={false}
            />
            {found.has(t.id) && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#FFB7C5] text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap animate-bounce">
                {t.label} 발견!
              </div>
            )}
          </div>
        ))}

        {/* 찾음 마커 링 */}
        {TARGETS.filter(t => found.has(t.id)).map(t => (
          <div
            key={`ring-${t.id}`}
            className="absolute pointer-events-none"
            style={{
              left: `${t.x}%`,
              top:  `${t.y}%`,
              transform: 'translate(-50%, -50%)',
              width: `${t.r * 2.4}%`,
              aspectRatio: '1',
              border: '2.5px solid #FFD166',
              borderRadius: '50%',
              boxShadow: '0 0 0 2px #FFB7C5',
              zIndex: 25,
            }}
          />
        ))}

        {/* 미스 클릭 이펙트 */}
        {miss && (
          <div
            className="absolute pointer-events-none z-30"
            style={{ left: `${miss.x}%`, top: `${miss.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="w-8 h-8 border-2 border-red-400 rounded-full opacity-70 animate-ping" />
          </div>
        )}

        {/* 발견 수 오버레이 (우하단) */}
        <div className="absolute bottom-2 right-3 bg-black/30 text-white text-sm font-bold px-3 py-1 rounded-full z-20">
          {found.size} / 5
        </div>
      </div>

      <p className="text-xs text-[#C0A88A] mt-2">고양이들이 배경에 숨어있어요. 잘 찾아보세요 🐾</p>

      {/* 결과 모달 */}
      {finished && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full shadow-2xl">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-2xl font-black text-[#6B4C2A] mb-1">모두 찾았어요!</h2>
            <p className="text-4xl font-mono font-bold text-[#FFB7C5] mb-1">{formatTime(elapsed)}</p>
            <p className="text-[#A0785A] text-sm mb-6">{formatTime(elapsed)} 만에 5마리 모두 발견!</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={share}
                className="bg-[#FFB7C5] text-white font-bold px-5 py-2.5 rounded-full hover:bg-[#FF8FA8] transition-colors"
              >
                공유하기 📤
              </button>
              <button
                onClick={reset}
                className="bg-[#FFD166] text-[#6B4C2A] font-bold px-5 py-2.5 rounded-full hover:bg-[#FFC233] transition-colors"
              >
                다시 도전 🔄
              </button>
              <a href="/" className="bg-white border border-[#FFD4A8] text-[#A0785A] font-bold px-5 py-2.5 rounded-full hover:bg-[#FFF0E0] transition-colors">
                홈으로 🏠
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MarketBackground() {
  return (
    <svg
      viewBox="0 0 1600 1000"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#87CEEB" />
          <stop offset="100%" stopColor="#C9E9F5" />
        </linearGradient>
        <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A08040" />
          <stop offset="100%" stopColor="#6B4F2A" />
        </linearGradient>
      </defs>

      {/* 하늘 */}
      <rect width="1600" height="1000" fill="url(#skyGrad)" />

      {/* 구름들 */}
      <g opacity="0.85">
        <ellipse cx="200" cy="100" rx="80" ry="40" fill="white" />
        <ellipse cx="255" cy="88"  rx="62" ry="35" fill="white" />
        <ellipse cx="145" cy="108" rx="52" ry="30" fill="white" />
        <ellipse cx="820" cy="78"  rx="90" ry="45" fill="white" />
        <ellipse cx="880" cy="68"  rx="70" ry="40" fill="white" />
        <ellipse cx="758" cy="90"  rx="62" ry="35" fill="white" />
        <ellipse cx="1410" cy="118" rx="72" ry="38" fill="white" />
        <ellipse cx="1472" cy="106" rx="55" ry="30" fill="white" />
      </g>

      {/* 땅 */}
      <rect x="0" y="720" width="1600" height="280" fill="url(#groundGrad)" />
      <rect x="0" y="716" width="1600" height="8" fill="#8B6914" opacity="0.6" />

      {/* 도로 */}
      <rect x="0" y="748" width="1600" height="130" fill="#7A7A7A" opacity="0.55" />
      {[0,140,280,420,560,700,840,980,1120,1260,1400].map(x => (
        <rect key={x} x={x} y="810" width="100" height="5" fill="white" opacity="0.45" />
      ))}

      {/* ── 건물들 ── */}

      {/* 건물1: 왼쪽 한옥 */}
      <rect x="30"  y="395" width="225" height="335" fill="#E8D5A3" />
      <rect x="18"  y="373" width="249" height="28"  fill="#C44" />
      <polygon points="18,373 142,288 267,373" fill="#B33" />
      <rect x="65"  y="498" width="62"  height="82"  fill="#8B6914" />
      <rect x="148" y="498" width="62"  height="82"  fill="#8B6914" />
      <rect x="74"  y="428" width="42"  height="52"  fill="#87CEEB" opacity="0.7" />
      <rect x="155" y="428" width="42"  height="52"  fill="#87CEEB" opacity="0.7" />
      <rect x="48"  y="456" width="165" height="30"  fill="#C44" rx="4" />
      <text x="130" y="477" fontSize="19" fill="white" textAnchor="middle" fontWeight="bold">자갈치 시장</text>

      {/* 건물2: 파란 지붕 */}
      <rect x="280" y="445" width="205" height="285" fill="#F5E6C8" />
      <rect x="268" y="424" width="229" height="27"  fill="#4A90D9" />
      <polygon points="268,424 382,345 497,424" fill="#3A7BC8" />
      <rect x="312" y="526" width="58"  height="72"  fill="#8B6914" />
      <rect x="388" y="526" width="58"  height="72"  fill="#8B6914" />
      <rect x="322" y="465" width="42"  height="46"  fill="#87CEEB" opacity="0.7" />
      <rect x="396" y="465" width="42"  height="46"  fill="#87CEEB" opacity="0.7" />
      <rect x="288" y="490" width="185" height="28"  fill="#E74C3C" rx="4" />
      <text x="380" y="510" fontSize="17" fill="white" textAnchor="middle" fontWeight="bold">피노 분식</text>

      {/* 건물3: 중앙 초록 지붕 (가장 큰) */}
      <rect x="510" y="372" width="265" height="358" fill="#ECD9B0" />
      <rect x="498" y="350" width="289" height="28"  fill="#27AE60" />
      <polygon points="498,350 642,262 786,350" fill="#219A52" />
      <rect x="545" y="524" width="72"  height="92"  fill="#7D5A35" />
      <rect x="658" y="524" width="72"  height="92"  fill="#7D5A35" />
      <rect x="555" y="452" width="52"  height="58"  fill="#87CEEB" opacity="0.7" />
      <rect x="668" y="452" width="52"  height="58"  fill="#87CEEB" opacity="0.7" />
      <rect x="520" y="484" width="235" height="30"  fill="#8E44AD" rx="4" />
      <text x="637" y="505" fontSize="18" fill="white" textAnchor="middle" fontWeight="bold">고양이 잡화점</text>

      {/* 건물4: 주황 지붕 */}
      <rect x="815" y="418" width="215" height="312" fill="#F0E0C0" />
      <rect x="803" y="397" width="239" height="27"  fill="#E67E22" />
      <polygon points="803,397 920,314 1037,397" fill="#D35400" />
      <rect x="845" y="518" width="62"  height="76"  fill="#7D5A35" />
      <rect x="928" y="518" width="62"  height="76"  fill="#7D5A35" />
      <rect x="852" y="455" width="46"  height="52"  fill="#87CEEB" opacity="0.7" />
      <rect x="935" y="455" width="46"  height="52"  fill="#87CEEB" opacity="0.7" />
      <rect x="820" y="480" width="200" height="28"  fill="#2C3E50" rx="4" />
      <text x="920" y="500" fontSize="16" fill="white" textAnchor="middle" fontWeight="bold">노점 포장마차</text>

      {/* 건물5: 빨간 지붕 */}
      <rect x="1065" y="438" width="242" height="292" fill="#E8D5A3" />
      <rect x="1053" y="416" width="266" height="28"  fill="#C0392B" />
      <polygon points="1053,416 1184,332 1315,416" fill="#A93226" />
      <rect x="1095" y="528" width="66"  height="82"  fill="#7D5A35" />
      <rect x="1182" y="528" width="66"  height="82"  fill="#7D5A35" />
      <rect x="1103" y="466" width="48"  height="52"  fill="#87CEEB" opacity="0.7" />
      <rect x="1188" y="466" width="48"  height="52"  fill="#87CEEB" opacity="0.7" />
      <rect x="1070" y="490" width="220" height="28"  fill="#16A085" rx="4" />
      <text x="1180" y="510" fontSize="16" fill="white" textAnchor="middle" fontWeight="bold">전통 수산물</text>

      {/* 건물6: 오른쪽 끝 보라 지붕 */}
      <rect x="1345" y="458" width="235" height="272" fill="#F5E6C8" />
      <rect x="1333" y="436" width="259" height="28"  fill="#8E44AD" />
      <polygon points="1333,436 1462,350 1591,436" fill="#7D3C98" />
      <rect x="1378" y="538" width="62"  height="76"  fill="#7D5A35" />
      <rect x="1462" y="538" width="62"  height="76"  fill="#7D5A35" />
      <rect x="1385" y="475" width="46"  height="52"  fill="#87CEEB" opacity="0.7" />
      <rect x="1470" y="475" width="46"  height="52"  fill="#87CEEB" opacity="0.7" />
      <rect x="1348" y="498" width="210" height="28"  fill="#2980B9" rx="4" />
      <text x="1453" y="518" fontSize="16" fill="white" textAnchor="middle" fontWeight="bold">피노 카페</text>

      {/* 노점들 */}
      <rect x="95"  y="676" width="125" height="58" fill="#F39C12" opacity="0.9" rx="5" />
      <text x="158" y="711" fontSize="14" fill="white" textAnchor="middle" fontWeight="bold">어묵 떡볶이</text>

      <rect x="402" y="672" width="115" height="56" fill="#E74C3C" opacity="0.9" rx="5" />
      <text x="460" y="706" fontSize="14" fill="white" textAnchor="middle" fontWeight="bold">순대 국밥</text>

      <rect x="682" y="676" width="122" height="56" fill="#27AE60" opacity="0.9" rx="5" />
      <text x="743" y="710" fontSize="14" fill="white" textAnchor="middle" fontWeight="bold">생선 구이</text>

      <rect x="1005" y="672" width="132" height="56" fill="#8E44AD" opacity="0.9" rx="5" />
      <text x="1071" y="706" fontSize="14" fill="white" textAnchor="middle" fontWeight="bold">전통 곱창</text>

      <rect x="1255" y="676" width="115" height="54" fill="#2980B9" opacity="0.9" rx="5" />
      <text x="1313" y="708" fontSize="13" fill="white" textAnchor="middle" fontWeight="bold">아이스크림</text>

      {/* 나무 1 (건물3 왼쪽) */}
      <rect x="494" y="596" width="16" height="128" fill="#7D5A35" />
      <circle cx="502" cy="576" r="58" fill="#27AE60" opacity="0.82" />
      <circle cx="472" cy="598" r="42" fill="#2ECC71" opacity="0.72" />
      <circle cx="534" cy="592" r="44" fill="#229954" opacity="0.78" />

      {/* 나무 2 (건물5 왼쪽) */}
      <rect x="1050" y="606" width="14" height="118" fill="#7D5A35" />
      <circle cx="1057" cy="586" r="52" fill="#27AE60" opacity="0.82" />
      <circle cx="1028" cy="607" r="38" fill="#2ECC71" opacity="0.72" />
      <circle cx="1088" cy="601" r="42" fill="#229954" opacity="0.78" />

      {/* 등불 */}
      {[155, 378, 632, 908, 1168, 1430].map((x, i) => (
        <g key={i}>
          <line x1={x} y1="340" x2={x} y2="440" stroke="#7D5A35" strokeWidth="4" />
          <ellipse cx={x} cy="338" rx="16" ry="26" fill="#FFD166" opacity="0.92" />
          <ellipse cx={x} cy="338" rx="8"  ry="14" fill="white"   opacity="0.6"  />
        </g>
      ))}

      {/* 사람 실루엣 */}
      {[195, 452, 708, 962, 1215, 1460].map((x, i) => (
        <g key={i} opacity="0.45">
          <circle cx={x} cy="752" r="10" fill="#333" />
          <rect x={x-8} y="762" width="16" height="28" fill="#444" rx="3" />
        </g>
      ))}
    </svg>
  )
}
