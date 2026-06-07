'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const CATS = [
  { id: 'pino',  img: '/cats/pino_danbi.png', label: '피노&단비', emoji: '🟠' },
  { id: 'noir',  img: '/cats/noir.png',        label: '노아',      emoji: '⚫' },
  { id: 'luna',  img: '/cats/luna.png',        label: '루나',      emoji: '🌙' },
  { id: 'lucky', img: '/cats/lucky.png',       label: '럭키',      emoji: '🍀' },
  { id: 'siam',  img: '/cats/siam.png',        label: '시암',      emoji: '🔮' },
]

// 각 스테이지별 배경 이미지 + 고양이 위치 (x, y = %, r = 반지름 %)
const STAGES = [
  {
    id: 'stage1',
    title: '전통 시장',
    subtitle: '한국 전통 시장',
    bg: '/find/stage1.svg',
    emoji: '🏪',
    targets: [
      { catIdx: 0, x: 12, y: 72, r: 5.5 },
      { catIdx: 1, x: 88, y: 55, r: 5   },
      { catIdx: 2, x: 38, y: 40, r: 5   },
      { catIdx: 3, x: 62, y: 78, r: 5   },
      { catIdx: 4, x: 52, y: 58, r: 5   },
    ],
  },
  {
    id: 'stage2',
    title: '분식 골목',
    subtitle: '분주한 떡볶이 거리',
    bg: '/find/stage2.svg',
    emoji: '🍢',
    targets: [
      { catIdx: 0, x: 8,  y: 55, r: 5.5 },
      { catIdx: 1, x: 75, y: 68, r: 5   },
      { catIdx: 2, x: 44, y: 35, r: 5   },
      { catIdx: 3, x: 22, y: 80, r: 5   },
      { catIdx: 4, x: 90, y: 42, r: 5   },
    ],
  },
  {
    id: 'stage3',
    title: '경복궁',
    subtitle: '조선 왕궁 뒤뜰',
    bg: '/find/stage3.svg',
    emoji: '🏯',
    targets: [
      { catIdx: 0, x: 18, y: 65, r: 5.5 },
      { catIdx: 1, x: 82, y: 48, r: 5   },
      { catIdx: 2, x: 48, y: 30, r: 5   },
      { catIdx: 3, x: 35, y: 75, r: 5   },
      { catIdx: 4, x: 65, y: 60, r: 5   },
    ],
  },
  {
    id: 'stage4',
    title: '제주 해녀마을',
    subtitle: '파란 바다 돌담길',
    bg: '/find/stage4.svg',
    emoji: '🌊',
    targets: [
      { catIdx: 0, x: 22, y: 70, r: 5.5 },
      { catIdx: 1, x: 78, y: 55, r: 5   },
      { catIdx: 2, x: 42, y: 42, r: 5   },
      { catIdx: 3, x: 58, y: 80, r: 5   },
      { catIdx: 4, x: 10, y: 38, r: 5   },
    ],
  },
  {
    id: 'stage5',
    title: '가을 산사',
    subtitle: '단풍 물든 사찰',
    bg: '/find/stage5.svg',
    emoji: '🍁',
    targets: [
      { catIdx: 0, x: 15, y: 68, r: 5.5 },
      { catIdx: 1, x: 85, y: 52, r: 5   },
      { catIdx: 2, x: 50, y: 38, r: 5   },
      { catIdx: 3, x: 30, y: 78, r: 5   },
      { catIdx: 4, x: 70, y: 62, r: 5   },
    ],
  },
]

function formatTime(ms: number) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}`
}

// 스테이지 선택 화면
function StageSelect({ onSelect }: { onSelect: (idx: number) => void }) {
  return (
    <div className="flex flex-col items-center min-h-screen bg-[#FFF8F0] px-4 py-6">
      <div className="w-full max-w-3xl mb-6">
        <a href="/" className="text-sm text-[#A0785A] hover:text-[#6B4C2A] font-semibold">← 홈</a>
        <h1 className="text-2xl font-black text-[#6B4C2A] mt-2">숨은 피노 찾기</h1>
        <p className="text-sm text-[#A0785A]">스테이지를 선택하세요 — 각 장소에 고양이 5마리가 숨어있어요!</p>
      </div>
      <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-4">
        {STAGES.map((stage, i) => (
          <button
            key={stage.id}
            onClick={() => onSelect(i)}
            className="relative overflow-hidden rounded-2xl shadow-lg border border-[#FFD4A8]/40 bg-white hover:scale-[1.02] transition-transform text-left"
            style={{ aspectRatio: '16/9' }}
          >
            <Image
              src={stage.bg}
              alt={stage.title}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3">
              <span className="text-white font-black text-lg leading-tight block">
                {stage.emoji} {stage.title}
              </span>
              <span className="text-white/80 text-xs">{stage.subtitle}</span>
            </div>
            <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Stage {i + 1}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// 게임 화면
function GamePlay({ stageIdx, onBack }: { stageIdx: number; onBack: () => void }) {
  const stage = STAGES[stageIdx]
  const targets = stage.targets.map(t => ({ ...t, ...CATS[t.catIdx] }))

  const [found, setFound]         = useState<Set<string>>(new Set())
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsed, setElapsed]     = useState(0)
  const [finished, setFinished]   = useState(false)
  const [miss, setMiss]           = useState<{ x: number; y: number } | null>(null)
  const [hit, setHit]             = useState<string | null>(null)
  const containerRef              = useRef<HTMLDivElement>(null)
  const timerRef                  = useRef<ReturnType<typeof setInterval> | null>(null)

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
    const py = ((e.clientY - rect.top) / rect.height) * 100

    if (!startTime) setStartTime(Date.now())

    let gotHit = false
    for (const t of targets) {
      if (found.has(t.id)) continue
      const dx = px - t.x, dy = py - t.y
      if (Math.sqrt(dx * dx + dy * dy) <= t.r) {
        const next = new Set(found)
        next.add(t.id)
        setFound(next)
        setHit(t.id)
        setTimeout(() => setHit(null), 800)
        gotHit = true
        if (next.size === targets.length) {
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
  }, [found, startTime, finished, targets])

  const reset = () => {
    setFound(new Set())
    setStartTime(null)
    setElapsed(0)
    setFinished(false)
    setMiss(null)
    setHit(null)
  }

  const share = () => {
    const text = `[숨은 피노 찾기] ${stage.emoji} ${stage.title} — ${formatTime(elapsed)} 만에 완료! → https://pino-games.revely.company/find`
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
        <button onClick={onBack} className="text-sm text-[#A0785A] hover:text-[#6B4C2A] font-semibold">← 스테이지</button>
        <div className="text-center">
          <h1 className="text-xl font-black text-[#6B4C2A]">{stage.emoji} {stage.title}</h1>
          <p className="text-xs text-[#A0785A]">5마리 고양이를 모두 찾아라!</p>
        </div>
        <div className="font-mono font-bold text-[#6B4C2A] text-lg min-w-[56px] text-right">
          {formatTime(elapsed)}
        </div>
      </div>

      {/* 진행도 뱃지 */}
      <div className="flex flex-wrap gap-1.5 mb-3 justify-center">
        {targets.map(t => (
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
        {/* 배경 이미지 */}
        <Image
          src={stage.bg}
          alt={stage.title}
          fill
          unoptimized
          className="object-cover select-none"
          draggable={false}
          priority
          sizes="(max-width: 768px) 100vw, 768px"
        />

        {/* 고양이들 (숨겨진 상태 = 낮은 opacity) */}
        {targets.map(t => (
          <div
            key={t.id}
            className="absolute transition-all duration-300 pointer-events-none"
            style={{
              left: `${t.x}%`,
              top: `${t.y}%`,
              transform: 'translate(-50%, -50%)',
              width: '8%',
              opacity: found.has(t.id) ? 1 : 0.25,
              filter: hit === t.id
                ? 'drop-shadow(0 0 14px #FFD166) brightness(1.3)'
                : found.has(t.id)
                ? 'drop-shadow(0 0 8px #FFB7C5)'
                : 'brightness(0.7) saturate(0.6)',
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
        {targets.filter(t => found.has(t.id)).map(t => (
          <div
            key={`ring-${t.id}`}
            className="absolute pointer-events-none"
            style={{
              left: `${t.x}%`,
              top: `${t.y}%`,
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

        {/* 발견 수 오버레이 */}
        <div className="absolute bottom-2 right-3 bg-black/30 text-white text-sm font-bold px-3 py-1 rounded-full z-20">
          {found.size} / 5
        </div>
      </div>

      <p className="text-xs text-[#C0A88A] mt-2">고양이들이 배경 곳곳에 숨어있어요. 잘 찾아보세요 🐾</p>

      {/* 결과 모달 */}
      {finished && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full shadow-2xl">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-2xl font-black text-[#6B4C2A] mb-1">모두 찾았어요!</h2>
            <p className="text-4xl font-mono font-bold text-[#FFB7C5] mb-1">{formatTime(elapsed)}</p>
            <p className="text-[#A0785A] text-sm mb-6">{stage.emoji} {stage.title}에서 5마리 모두 발견!</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button onClick={share} className="bg-[#FFB7C5] text-white font-bold px-5 py-2.5 rounded-full hover:bg-[#FF8FA8] transition-colors">
                공유하기 📤
              </button>
              <button onClick={reset} className="bg-[#FFD166] text-[#6B4C2A] font-bold px-5 py-2.5 rounded-full hover:bg-[#FFC233] transition-colors">
                다시 도전 🔄
              </button>
              <button onClick={onBack} className="bg-white border border-[#FFD4A8] text-[#A0785A] font-bold px-5 py-2.5 rounded-full hover:bg-[#FFF0E0] transition-colors">
                스테이지 선택 🗺️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function FindGame() {
  const [stageIdx, setStageIdx] = useState<number | null>(null)

  if (stageIdx === null) {
    return <StageSelect onSelect={setStageIdx} />
  }

  return <GamePlay stageIdx={stageIdx} onBack={() => setStageIdx(null)} />
}
