'use client'
import { useCardStore } from '@/lib/store/cardStore'
import { getGridDims } from '@/lib/cardLogic'
import { FlipCard } from './FlipCard'

export function CardBoard() {
  const { cards, gridSize, flipCard } = useCardStore()
  const { cols } = getGridDims(gridSize)

  const cardSize = cols <= 4 ? 'lg' : 'md'

  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {cards.map(card => (
        <div key={card.id} className="flex items-center justify-center">
          <FlipCard
            catId={card.catId}
            isFlipped={card.isFlipped}
            isMatched={card.isMatched}
            onClick={() => flipCard(card.id)}
            size={cardSize}
          />
        </div>
      ))}
    </div>
  )
}
