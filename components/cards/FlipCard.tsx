'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { getCatById } from '@/lib/cats'

interface FlipCardProps {
  catId: number
  isFlipped: boolean
  isMatched: boolean
  onClick: () => void
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-20 h-20',
  lg: 'w-24 h-24',
}

export function FlipCard({ catId, isFlipped, isMatched, onClick, size = 'md' }: FlipCardProps) {
  const cat = getCatById(catId)
  const showing = isFlipped || isMatched

  return (
    <div
      className={`${sizeClasses[size]} relative cursor-pointer`}
      style={{ perspective: '1000px' }}
      onClick={onClick}
    >
      <motion.div
        className="card-3d w-full h-full relative"
        animate={{ rotateY: showing ? 180 : 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        {/* Back face */}
        <div
          className="card-face absolute inset-0 rounded-2xl flex items-center justify-center
                     shadow-md select-none overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #8B5E3C 0%, #5D3A1A 100%)' }}
        >
          <span className="text-3xl opacity-80">🐾</span>
        </div>

        {/* Front face */}
        <div
          className={`card-face card-back absolute inset-0 rounded-2xl flex flex-col
                      items-center justify-center overflow-hidden shadow-md select-none
                      ${isMatched ? 'ring-2 ring-green-400 opacity-70' : ''}`}
          style={{ background: cat.color }}
        >
          {cat.image ? (
            <Image
              src={cat.image}
              alt={cat.label}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-0.5 p-1">
              <span className="text-3xl leading-none">{cat.emoji}</span>
              <span className="text-[9px] font-bold" style={{ color: cat.textColor }}>
                {cat.label}
              </span>
            </div>
          )}
          {isMatched && (
            <div className="absolute inset-0 flex items-center justify-center bg-green-400/20">
              <span className="text-2xl">✓</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
