import { ModeGate } from '@/components/multiplayer/ModeGate'
import { CardGame } from '@/components/cards/CardGame'
import { CardGameMulti } from '@/components/cards/CardGameMulti'

export default async function CardsPage({ searchParams }: { searchParams: Promise<{ join?: string }> }) {
  const { join } = await searchParams
  return (
    <ModeGate
      gameType="cards"
      singleContent={<CardGame />}
      multiContent={<CardGameMulti />}
      initialCode={join}
    />
  )
}
