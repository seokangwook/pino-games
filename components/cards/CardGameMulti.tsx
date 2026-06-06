'use client'
import { useEffect, useRef, useState } from 'react'
import { useRoomStore } from '@/lib/store/roomStore'
import { CardData } from '@/lib/cardLogic'
import { FlipCard } from './FlipCard'
import { OpponentStatus } from '../multiplayer/OpponentStatus'
import { GameResultModal } from '../multiplayer/GameResultModal'
import { formatTime } from '@/lib/supabase'

export function CardGameMulti() {
  const { boardState, role, gridSize, gameType, multiMode, pushUpdate, finishRoom, leaveRoom, roomCode, userId } = useRoomStore()
  const startTime = useRef(Date.now())
  const [elapsed, setElapsed] = useState(0)
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
    const id = setInterval(() => setElapsed(Date.now() - startTime.current), 500)
    return () => clearInterval(id)
  }, [won])

  const cols = gridSize === '4x4' ? 4 : 6
  const totalPairs = gridSize === '4x4' ? 8 : gridSize === '4x6' ? 12 : 18

  const progKey = role === 'host' ? 'hostProgress' : 'guestProgress'
  const opKey = role === 'host' ? 'guestProgress' : 'hostProgress'
  const opProgress = boardState[opKey] as { matched?: number; moves?: number; clearTime?: number | null } | undefined
  const opCleared = opProgress?.clearTime != null

  // Victory = I cleared; Defeat = opponent cleared before me
  const isVictory = won
  const isDefeat = !won && opCleared
  const showModal = isVictory || isDefeat

  // Freeze elapsed on game end
  const frozenElapsed = useRef<number | null>(null)
  if (showModal && frozenElapsed.current === null) {
    frozenElapsed.current = Date.now() - startTime.current
  }
  const displayElapsed = frozenElapsed.current ?? elapsed

  const opMatchedCount = opProgress?.matched ?? 0
  const opClearElapsed = opCleared && opProgress?.clearTime != null
    ? Math.max(0, opProgress.clearTime - startTime.current)
    : undefined

  function flipCard(id: number) {
    if (isChecking || won || opCleared) return
    const card = localCards.find(c => c.id === id)
    if (!card || card.isFlipped || card.isMatched) return
    if (flippedIds.includes(id)) return
    const newCards = localCards.map(c => c.id === id ? { ...c, isFlipped: true } : c)
    const newFlipped = [...flippedIds, id]
    if (newFlipped.length < 2) { setLocalCards(newCards); setFlippedIds(newFlipped); return }
    setLocalCards(newCards); setIsChecking(true)
    const newMoves = moves + 1; setMoves(newMoves)
    setTimeout(async () => {
      const [id1, id2] = newFlipped
      const c1 = newCards.find(c => c.id === id1)!
      const c2 = newCards.find(c => c.id === id2)!
      if (c1.catId === c2.catId) {
        const matched = newCards.map(c => c.id === id1 || c.id === id2 ? { ...c, isMatched: true } : c)
        const newMC = matchedCount + 1
        setLocalCards(matched); setMatchedCount(newMC); setFlippedIds([]); setIsChecking(false)
        if (newMC >= totalPairs) {
          setWon(true)
          await pushUpdate({ [progKey]: { matched: newMC, moves: newMoves, clearTime: Date.now() } })
          await finishRoom(userId)
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

  function handleRematch() {
    const gt = gameType ?? 'cards'
    const gs = gridSize ?? '4x4'
    const mm = multiMode ?? 'concurrent'
    leaveRoom()
    setTimeout(() => {
      useRoomStore.getState().createRoom(gt, gs, mm)
    }, 50)
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
          <p className="text-xs text-[#A0785A]">{formatTime(displayElapsed)} · {moves}번</p>
        </div>
        <OpponentStatus totalPairs={totalPairs} />
      </div>

      {won && !opCleared && (
        <div className="w-full max-w-2xl bg-yellow-50 border-2 border-yellow-300 rounded-3xl px-6 py-4 mb-4 text-center shadow-md">
          <p className="text-2xl font-black text-yellow-700">클리어! 🎉 {formatTime(displayElapsed)}</p>
          <p className="text-sm text-yellow-600 mt-1">상대방 기다리는 중...</p>
        </div>
      )}

      <div
        className={`grid gap-2 transition-opacity ${showModal ? 'opacity-30 pointer-events-none' : ''}`}
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {localCards.map(card => (
          <div key={card.id} className="flex items-center justify-center">
            <FlipCard catId={card.catId} isFlipped={card.isFlipped} isMatched={card.isMatched} onClick={() => flipCard(card.id)} size={cols <= 4 ? 'lg' : 'md'} />
          </div>
        ))}
      </div>

      {showModal && (
        <GameResultModal
          result={isVictory ? 'victory' : 'defeat'}
          myMatched={matchedCount}
          opMatched={opMatchedCount}
          totalPairs={totalPairs}
          elapsed={displayElapsed}
          opElapsed={opClearElapsed}
          onRematch={handleRematch}
          onHome={leaveRoom}
        />
      )}
    </div>
  )
}
