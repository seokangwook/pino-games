import { CATS } from './cats'

export interface TileData {
  id: number
  col: number
  row: number
  layer: number
  catId: number
  isMatched: boolean
  isSelected: boolean
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generatePositions(): [number, number, number][] {
  const positions: [number, number, number][] = []

  // Layer 0: 8 cols × 6 rows = 48 tiles
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 8; c++) {
      positions.push([c, r, 0])
    }
  }

  // Layer 1: cols 2-5, rows 1-4 = 16 tiles
  for (let r = 1; r <= 4; r++) {
    for (let c = 2; c <= 5; c++) {
      positions.push([c, r, 1])
    }
  }

  // Layer 2: cols 2-5, rows 2-3 = 8 tiles
  for (let r = 2; r <= 3; r++) {
    for (let c = 2; c <= 5; c++) {
      positions.push([c, r, 2])
    }
  }

  return positions // 72 total
}

export function buildBoard(): TileData[] {
  const positions = generatePositions() // 72
  // 18 cats × 4 tiles each = 72
  const catPool = shuffle(CATS.flatMap(c => [c.id, c.id, c.id, c.id]))

  return positions.map(([col, row, layer], idx) => ({
    id: idx,
    col,
    row,
    layer,
    catId: catPool[idx],
    isMatched: false,
    isSelected: false,
  }))
}

export function isTileAvailable(tile: TileData, all: TileData[]): boolean {
  const active = all.filter(t => !t.isMatched)

  // Blocked on top?
  const topBlocked = active.some(
    t => t.id !== tile.id && t.layer === tile.layer + 1 && t.col === tile.col && t.row === tile.row
  )
  if (topBlocked) return false

  // Check left/right at same layer
  const leftBlocked = active.some(
    t => t.id !== tile.id && t.layer === tile.layer && t.row === tile.row && t.col === tile.col - 1
  )
  const rightBlocked = active.some(
    t => t.id !== tile.id && t.layer === tile.layer && t.row === tile.row && t.col === tile.col + 1
  )

  return !leftBlocked || !rightBlocked
}

export function findHint(tiles: TileData[]): [TileData, TileData] | null {
  const available = tiles.filter(t => !t.isMatched && isTileAvailable(t, tiles))
  for (let i = 0; i < available.length; i++) {
    for (let j = i + 1; j < available.length; j++) {
      if (available[i].catId === available[j].catId) {
        return [available[i], available[j]]
      }
    }
  }
  return null
}

export function reshuffleRemaining(tiles: TileData[]): TileData[] {
  const remaining = tiles.filter(t => !t.isMatched)
  const shuffledCats = shuffle(remaining.map(t => t.catId))
  return tiles.map(t => {
    if (t.isMatched) return t
    const idx = remaining.findIndex(r => r.id === t.id)
    return { ...t, catId: shuffledCats[idx], isSelected: false }
  })
}
