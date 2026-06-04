'use client'
import { useEffect, useState } from 'react'
import { useRoomStore } from '@/lib/store/roomStore'
import { CardData } from '@/lib/cardLogic'
import { FlipCard } from './FlipCard'
import { OpponentStatus } from '../multiplayer/OpponentStatus'
import { formatTime } from '@/lib/supabase'

export function CardGameMulti() {
  const { boardState, role, gridSize, status, pushUpdate, leaveRoom, roomCode } = useRoomStore()
  const [elapsed, setElapsed] = useState(0)
  const [startTime] = useState(() => Date.now())
  const [flippedIds, setFlippedIds] = useState<number[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [localCards, setLocalCards] = useState<CardData[]>([])
  const [moves, setMoves] = useState(0)
  const [matchedCount, setMatchedCount] = useState(0)
  const [won, setWon] = useState(false)

  useEffect(() => {
    const key = role === 'host' ? 'hostCards' : 'guestCards'
    const cards = boardState[key] as CardData[] | undefined
    if (cards?.length && localCards.length === 0) setLocalCards(cards)
  }, [boardState, role, localCards.length])

  useEffect(() => {
    if (won) return
    const id = setInterval(() => setElapsed(Date.now() - startTime), 500)
    return () => clearInterval(id)
  }, [won, startTime])

  const cols = gridSize === '4x4' ? 4 : 6
  const totalPairs = gridSize === '4x4' ? 8 : gridSize === '4x6' ? 12 : 18

  function flipCard(id: number) {
    if (isChecking || won) return
    const card = localCards.find(c => c.id === id)
    if (!card || card.isFlipped || card.isMatched) return
    if (flippedIds.includes(id)) return
    const newCards = localCards.map(c => c.id === id ? { ...c, isFlipped: true } : c)
    const newFlipped = [...flippedIds, id]
    if (newFlipped.length < 2) { setLocalCards(newCards); setFlippedIds(newFlipped); return }
    setLocalCards(newCards); setIsChecking(true)
    const newMoves = moves + 1; setMoves(newMoves)
    setTimeout(() => {
      const [id1, id2] = newFlipped
      const c1 = newCards.find(c => c.id === id1)!
      const c2 = newCards.find(c => c.id === id2)!
      const progKey = role === 'host' ? 'hostProgress' : 'guestProgress'
      if (c1.catId === c2.catId) {
        const matched = newCards.map(c => c.id === id1 || c.id === id2 ? { ...c, isMatched: true } : c)
        const newMC = matchedCount + 1
        setLocalCards(matched); setMatchedCount(newMC); setFlippedIds([]); setIsChecking(false)
        if (newMC >= totalPairs) {
          setWon(true)
          pushUpdate({ [progKey]: { matched: newMC, moves: newMoves, clearTime: Date.now() } })
        } else {
          pushUpdate({ [progKey]: { matched: newMC, moves: newMoves, clearTime: null } })
        }
      } else {
        const reset = newCards.map(c => c.id === id1 || c.id === id2 ? { ...c, isFlipped: false } : c)
        setLocalCards(reset); setFlippedIds([]); setIsChecking(false)
        pushUpdate({ [progKey]: { matched: matchedCount, moves: newMoves, clearTime: null } })
      }
    }, 900)
  }

  const opKey = role === 'host' ? 'guestProgress' : 'hostProgress'
  const opProgress = boardState[opKey] as { clearTime?: number | null } | undefined
  const bothDone = won && opProgress?.clearTime != null
  let resultMsg = ''
  if (bothDone) {
    const myProg = boardState[role === 'host' ? 'hostProgress' : 'guestProgress'] as { clearTime?: number | null }
    resultMsg = (myProg?.clearTime ?? Infinity) < (opProgress?.clearTime ?? Infinity) ? '내가 이겼다! 🎉' : (myProg?.clearTime ?? Infinity) > (opProgress?.clearTime ?? Infinity) ? '아쉽다... 😿' : '무승부! 🤝'
  }

  if (localCards.length === 0) return <div className="text-center text-[#A0785A] mt-20">로딩 중...</div>

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-2xl flex items-center mb-4 gap-3">
        <button onClick={leaveRoom} className="text-[#A0785A] text-2xl">←</button>
        <h1 className="text-2xl font-black text-[#6B4C2A]">카드 뒤집기 · 멀티 🃏</h1>
        <span className="ml-auto text-xs bg-[#FFB7C5] text-white px-3 py-1 rounded-full font-bold">방 {roomCode}</span>
      </div>
      <div className="w-full max-w-2xl grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/70 backdrop-blur rounded-2xl px-4 py-3 text-center border-2 border-[#FFB7C5]/50 shadow-sm">
          <p className="text-xs text-[#A0785A] font-semibold">내 매칭</p>
          <p className="text-2xl font-black text-[#6B4C2A]">{matchedCount}/{totalPairs}</p>
          <p className="text-xs text-[#A0785A]">{formatTime(elapsed)} · {moves}번</p>
        </div>
        <OpponentStatus totalPairs={totalPairs} />
      </div>
      {won && (
        <div className="w-full max-w-2xl bg-yellow-50 border-2 border-yellow-300 rounded-3xl px-6 py-4 mb-4 text-center shadow-md">
          <p className="text-2xl font-black text-yellow-700">클리어! {formatTime(elapsed)}</p>
          {bothDone && <p className="text-lg font-bold text-yellow-600 mt-1">{resultMsg}</p>}
          {!bothDone && <p className="text-sm text-yellow-600 mt-1">상대방 기다리는 중...</p>}
          {bothDone && <button onClick={leaveRoom} className="mt-3 bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-6 py-2 rounded-2xl transition-colors">메뉴로</button>}
        </div>
      )}
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {localCards.map(card => (
          <div key={card.id} className="flex items-center justify-center">
            <FlipCard catId={card.catId} isFlipped={card.isFlipped} isMatched={card.isMatched} onClick={() => flipCard(card.id)} size={cols <= 4 ? 'lg' : 'md'} />
          </div>
        ))}
      </div>
    </div>
  )
}
