import { ModeGate } from '@/components/multiplayer/ModeGate'
import { CardGame } from '@/components/cards/CardGame'
import { CardGameMulti } from '@/components/cards/CardGameMulti'

export default function CardsPage() {
  return (
    <ModeGate
      gameType="cards"
      singleContent={<CardGame />}
      multiContent={<CardGameMulti />}
    />
  )
}
