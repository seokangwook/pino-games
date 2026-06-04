'use client'
import { ModeGate } from '@/components/multiplayer/ModeGate'
import { MahjongGame } from '@/components/mahjong/MahjongGame'

export default function MahjongPage() {
  return (
    <ModeGate
      gameType="mahjong"
      singleContent={<MahjongGame />}
      multiContent={<MahjongGame />}
    />
  )
}
