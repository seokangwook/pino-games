'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { TileData } from '@/lib/mahjongLayout'
import { getCatById } from '@/lib/cats'

interface MahjongTileProps {
  tile: TileData
  isAvailable: boolean
  isHint: boolean
  onClick: () => void
  tileW: number
  tileH: number
  layerOff: number
}

export function MahjongTile({ tile, isAvailable, isHint, onClick, tileW, tileH, layerOff }: MahjongTileProps) {
  const cat = getCatById(tile.catId)

  const x = tile.col * tileW + tile.layer * layerOff
  const y = tile.row * tileH - tile.layer * layerOff

  const shadow = `${tile.layer * 2 + 2}px ${tile.layer * 2 + 2}px 0 rgba(0,0,0,${0.15 + tile.layer * 0.05})`

  const borderColor = tile.isSelected
    ? '#FFC107'
    : isHint
    ? '#7BC9A0'
    : 'rgba(255,255,255,0.7)'

  return (
    <motion.button
      className="absolute rounded-lg border-2 overflow-hidden flex items-center justify-center
                 focus:outline-none transition-opacity"
      style={{
        width: tileW,
        height: tileH,
        left: x,
        top: y,
        background: cat.color,
        zIndex: tile.layer * 100 + tile.row * 10 + tile.col,
        boxShadow: shadow,
        borderColor,
        opacity: isAvailable ? 1 : 0.55,
        cursor: isAvailable ? 'pointer' : 'default',
      }}
      whileHover={isAvailable ? { scale: 1.06, zIndex: 9999 } : {}}
      whileTap={isAvailable ? { scale: 0.94 } : {}}
      onClick={isAvailable ? onClick : undefined}
    >
      {cat.image ? (
        <Image src={cat.image} alt={cat.label} fill className="object-cover p-0.5" />
      ) : (
        <div className="flex flex-col items-center leading-none gap-0.5 p-0.5">
          <span style={{ fontSize: tileW * 0.42 }}>{cat.emoji}</span>
          <span
            className="font-bold truncate w-full text-center"
            style={{ fontSize: tileW * 0.16, color: cat.textColor }}
          >
            {cat.label}
          </span>
        </div>
      )}
      {tile.isSelected && (
        <div className="absolute inset-0 rounded-md ring-2 ring-[#FFC107] ring-offset-1 pointer-events-none" />
      )}
      {isHint && (
        <motion.div
          className="absolute inset-0 rounded-md bg-green-300/30 pointer-events-none"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.button>
  )
}
