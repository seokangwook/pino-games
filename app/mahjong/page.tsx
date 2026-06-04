import { MahjongGame } from '@/components/mahjong/MahjongGame'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '마작 솔리테어 🀄 | 피노 게임',
  description: '피노 고양이 마작 솔리테어 짝 맞추기 게임',
}

export default function MahjongPage() {
  return <MahjongGame />
}
