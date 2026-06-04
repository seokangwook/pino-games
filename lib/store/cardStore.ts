'use client'
import { create } from 'zustand'
import { CardData, GridSize, createCardDeck } from '../cardLogic'

interface CardStore {
  cards: CardData[]
  gridSize: GridSize
  flippedIds: number[]
  moves: number
  matchedCount: number
  startTime: number | null
  endTime: number | null
  status: 'idle' | 'playing' | 'won'
  isChecking: boolean

  setGridSize: (s: GridSize) => void
  startGame: () => void
  flipCard: (id: number) => void
  resetGame: () => void
}

export const useCardStore = create<CardStore>((set, get) => ({
  cards: [],
  gridSize: '4x4',
  flippedIds: [],
  moves: 0,
  matchedCount: 0,
  startTime: null,
  endTime: null,
  status: 'idle',
  isChecking: false,

  setGridSize: (gridSize) => set({ gridSize }),

  startGame: () => {
    const { gridSize } = get()
    set({
      cards: createCardDeck(gridSize),
      flippedIds: [],
      moves: 0,
      matchedCount: 0,
      startTime: Date.now(),
      endTime: null,
      status: 'playing',
      isChecking: false,
    })
  },

  flipCard: (id) => {
    const { cards, flippedIds, isChecking, status } = get()
    if (status !== 'playing') return
    if (isChecking) return

    const card = cards.find(c => c.id === id)
    if (!card || card.isFlipped || card.isMatched) return
    if (flippedIds.includes(id)) return

    const newCards = cards.map(c => c.id === id ? { ...c, isFlipped: true } : c)
    const newFlipped = [...flippedIds, id]

    if (newFlipped.length < 2) {
      set({ cards: newCards, flippedIds: newFlipped })
      return
    }

    // Second flip: check match
    set({ cards: newCards, flippedIds: newFlipped, moves: get().moves + 1, isChecking: true })

    setTimeout(() => {
      const { cards: latest } = get()
      const [id1, id2] = newFlipped
      const c1 = latest.find(c => c.id === id1)!
      const c2 = latest.find(c => c.id === id2)!

      if (c1.catId === c2.catId) {
        const matched = latest.map(c =>
          c.id === id1 || c.id === id2 ? { ...c, isMatched: true, isFlipped: true } : c
        )
        const newMatchedCount = get().matchedCount + 1
        const totalPairs = matched.filter(c => c.isMatched).length / 2
        const allDone = matched.every(c => c.isMatched)
        set({
          cards: matched,
          flippedIds: [],
          matchedCount: newMatchedCount,
          isChecking: false,
          status: allDone ? 'won' : 'playing',
          endTime: allDone ? Date.now() : null,
        })
      } else {
        const reset = latest.map(c =>
          c.id === id1 || c.id === id2 ? { ...c, isFlipped: false } : c
        )
        set({ cards: reset, flippedIds: [], isChecking: false })
      }
    }, 900)
  },

  resetGame: () => {
    set({ status: 'idle', cards: [], flippedIds: [], moves: 0, matchedCount: 0, startTime: null, endTime: null })
  },
}))
