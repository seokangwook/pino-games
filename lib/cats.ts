export interface Cat {
  id: number
  name: string
  label: string
  image: string | null
  color: string
  textColor: string
  emoji: string
}

export const CATS: Cat[] = [
  { id: 1,  name: 'pino_danbi', label: '피노&단비', image: '/cats/pino_danbi.png', color: '#FFF5E4', textColor: '#6B4C2A', emoji: '🐱' },
  { id: 2,  name: 'lucky',     label: '럭키',      image: '/cats/lucky.png',      color: '#FFE4B5', textColor: '#7A5C00', emoji: '😺' },
  { id: 3,  name: 'luna',      label: '루나',      image: '/cats/luna.png',       color: '#E8E8F8', textColor: '#4A4A8A', emoji: '😸' },
  { id: 4,  name: 'noir',      label: '누아르',    image: '/cats/noir.png',       color: '#2D2D4A', textColor: '#FFFFFF', emoji: '😼' },
  { id: 5,  name: 'siam',      label: '시암',      image: '/cats/siam.png',       color: '#D4B896', textColor: '#5A3A1A', emoji: '😽' },
  { id: 6,  name: 'mochi',     label: '모찌',      image: '/cats/cat-01.jpg',     color: '#FFB7C5', textColor: '#8A2040', emoji: '🐈' },
  { id: 7,  name: 'cloud',     label: '구름',      image: '/cats/cat-02.jpg',     color: '#B7D4FF', textColor: '#1A4080', emoji: '😻' },
  { id: 8,  name: 'caramel',   label: '카라멜',    image: '/cats/cat-03.jpg',     color: '#C4843A', textColor: '#FFFFFF', emoji: '🙀' },
  { id: 9,  name: 'shadow',    label: '섀도우',    image: '/cats/cat-04.jpg',     color: '#7B68B5', textColor: '#FFFFFF', emoji: '😾' },
  { id: 10, name: 'cream',     label: '크림',      image: '/cats/cat-05.jpg',     color: '#FDEBD0', textColor: '#7A5C00', emoji: '🐈\u200D⬛' },
  { id: 11, name: 'marble',    label: '마블',      image: '/cats/cat-06.jpg',     color: '#BDC3C7', textColor: '#2C3E50', emoji: '😿' },
  { id: 12, name: 'copper',    label: '코퍼',      image: '/cats/cat-07.jpg',     color: '#B87333', textColor: '#FFFFFF', emoji: '😹' },
  { id: 13, name: 'jade',      label: '제이드',    image: '/cats/cat-08.jpg',     color: '#7BC9A0', textColor: '#1A5035', emoji: '🐱' },
  { id: 14, name: 'amber',     label: '앰버',      image: '/cats/cat-09.jpg',     color: '#FFD166', textColor: '#7A5000', emoji: '😺' },
  { id: 15, name: 'ash',       label: '애쉬',      image: '/cats/cat-10.jpg',     color: '#95A5A6', textColor: '#FFFFFF', emoji: '😸' },
  { id: 16, name: 'cocoa',     label: '코코아',    image: '/cats/cat-11.jpg',     color: '#795548', textColor: '#FFFFFF', emoji: '😼' },
  { id: 17, name: 'coral',     label: '코럴',      image: '/cats/cat-12.jpg',     color: '#FF8C82', textColor: '#FFFFFF', emoji: '😻' },
  { id: 18, name: 'storm',     label: '스톰',      image: '/cats/cat-13.jpg',     color: '#607D8B', textColor: '#FFFFFF', emoji: '😾' },
]

const catMap = new Map(CATS.map(c => [c.id, c]))

export function getCatById(id: number): Cat {
  return catMap.get(id) ?? CATS[0]
}
