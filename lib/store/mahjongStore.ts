'use client'
import { create } from 'zustand'
import { TileData, buildBoard, isTileAvailable, findHint, reshuffleRemaining } from '../mahjongLayout'

interface MahjongStore {
  tiles: TileData[]
  selectedId: number | null
  hintIds: [number, number] | null
  moves: number
  startTime: number | null
  endTime: number | null
  status: 'idle' | 'playing' | 'won' | 'stuck'

  startGame: () => void
  selectTile: (id: number) => void
  showHint: () => void
  reshuffle: () => void
  resetGame: () => void
}

export const useMahjongStore = create<MahjongStore>((set, get) => ({
  tiles: [],
  selectedId: null,
  hintIds: null,
  moves: 0,
  startTime: null,
  endTime: null,
  status: 'idle',

  startGame: () => {
    set({
      tiles: buildBoard(),
      selectedId: null,
      hintIds: null,
      moves: 0,
      startTime: Date.now(),
      endTime: null,
      status: 'playing',
    })
  },

  selectTile: (id) => {
    const { tiles, selectedId, status } = get()
    if (status !== 'playing') return

    const tile = tiles.find(t => t.id === id)
    if (!tile || tile.isMatched) return
    if (!isTileAvailable(tile, tiles)) return

    if (selectedId === null) {
      set({
        tiles: tiles.map(t => ({ ...t, isSelected: t.id === id })),
        selectedId: id,
        hintIds: null,
      })
      return
    }

    if (selectedId === id) {
      set({
        tiles: tiles.map(t => ({ ...t, isSelected: false })),
        selectedId: null,
      })
      return
    }

    const prev = tiles.find(t => t.id === selectedId)!
    if (prev.catId === tile.catId) {
      // Match!
      const newTiles = tiles.map(t =>
        t.id === id || t.id === selectedId
          ? { ...t, isMatched: true, isSelected: false }
          : { ...t, isSelected: false }
      )
      const remaining = newTiles.filter(t => !t.isMatched).length
      const won = remaining === 0
      const stuck = !won && findHint(newTiles) === null

      set({
        tiles: newTiles,
        selectedId: null,
        hintIds: null,
        moves: get().moves + 1,
        status: won ? 'won' : stuck ? 'stuck' : 'playing',
        endTime: won ? Date.now() : null,
      })
    } else {
      // No match — deselect prev, select new
      set({
        tiles: tiles.map(t => ({ ...t, isSelected: t.id === id })),
        selectedId: id,
        hintIds: null,
      })
    }
  },

  showHint: () => {
    const { tiles } = get()
    const hint = findHint(tiles)
    if (hint) {
      set({ hintIds: [hint[0].id, hint[1].id] })
    }
  },

  reshuffle: () => {
    const { tiles } = get()
    set({ tiles: reshuffleRemaining(tiles), selectedId: null, hintIds: null })
  },

  resetGame: () => {
    set({ status: 'idle', tiles: [], selectedId: null, hintIds: null, moves: 0, startTime: null, endTime: null })
  },
}))
