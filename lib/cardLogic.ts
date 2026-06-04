import { CATS } from './cats'

export type GridSize = '4x4' | '4x6' | '6x6'

export interface CardData {
  id: number
  catId: number
  isFlipped: boolean
  isMatched: boolean
}

const GRID_PAIRS: Record<GridSize, number> = {
  '4x4': 8,
  '4x6': 12,
  '6x6': 18,
}

const GRID_DIMS: Record<GridSize, { cols: number; rows: number }> = {
  '4x4': { cols: 4, rows: 4 },
  '4x6': { cols: 6, rows: 4 },
  '6x6': { cols: 6, rows: 6 },
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function createCardDeck(gridSize: GridSize): CardData[] {
  const pairsCount = GRID_PAIRS[gridSize]
  const cats = CATS.slice(0, pairsCount)

  const cards: CardData[] = []
  cats.forEach((cat, i) => {
    cards.push({ id: i * 2,     catId: cat.id, isFlipped: false, isMatched: false })
    cards.push({ id: i * 2 + 1, catId: cat.id, isFlipped: false, isMatched: false })
  })

  return shuffle(cards)
}

export function getGridDims(gridSize: GridSize) {
  return GRID_DIMS[gridSize]
}
