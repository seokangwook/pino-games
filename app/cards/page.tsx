import { CardGame } from '@/components/cards/CardGame'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '카드 뒤집기 🃏 | 피노 게임',
  description: '피노 고양이 카드 뒤집기 메모리 매칭 게임',
}

export default function CardsPage() {
  return <CardGame />
}
