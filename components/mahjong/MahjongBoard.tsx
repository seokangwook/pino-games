'use client'
import { useMemo } from 'react'
import { useMahjongStore } from '@/lib/store/mahjongStore'
import { isTileAvailable } from '@/lib/mahjongLayout'
import { MahjongTile } from './MahjongTile'

// Board viewport constants
const TILE_W = 52
const TILE_H = 52
const LAYER_OFF = 5  // pixels to shift per layer (shadow offset)
const BOARD_COLS = 8
const BOARD_ROWS = 6
const MAX_LAYERS = 3

const BOARD_W = BOARD_COLS * TILE_W + MAX_LAYERS * LAYER_OFF + 4
const BOARD_H = BOARD_ROWS * TILE_H + 2

export function MahjongBoard() {
  const { tiles, selectedId, hintIds, selectTile } = useMahjongStore()

  const activeTiles = useMemo(() => tiles.filter(t => !t.isMatched), [tiles])

  const availabilityMap = useMemo(() => {
    const map = new Map<number, boolean>()
    activeTiles.forEach(t => map.set(t.id, isTileAvailable(t, tiles)))
    return map
  }, [activeTiles, tiles])

  const hintSet = useMemo(() => new Set(hintIds ?? []), [hintIds])

  return (
    <div className="overflow-x-auto w-full">
      <div
        className="relative mx-auto"
        style={{ width: BOARD_W, height: BOARD_H }}
      >
        {activeTiles.map(tile => (
          <MahjongTile
            key={tile.id}
            tile={{ ...tile, isSelected: tile.id === selectedId }}
            isAvailable={availabilityMap.get(tile.id) ?? false}
            isHint={hintSet.has(tile.id)}
            onClick={() => selectTile(tile.id)}
            tileW={TILE_W}
            tileH={TILE_H}
            layerOff={LAYER_OFF}
          />
        ))}
        {activeTiles.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-[#A0785A] text-xl font-bold">
            모두 클리어! 🎊
          </div>
        )}
      </div>
    </div>
  )
}
