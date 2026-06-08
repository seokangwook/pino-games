// 통합 닉네임 검증 모듈 — 전 앱 공통
// owner 역할 사용자는 브랜드 단어 사용 허용

export type UserRole = 'user' | 'owner'

const BANNED_ALL: string[] = [
  // 욕설·비속어
  '씨발','시발','씨팔','씨바','씨불','쉬발','존나','졸라',
  '개새끼','새끼','개년','개놈','병신','빙신','미친','찐따','지랄',
  '보지','자지','섹스','강간','변태','창녀','꺼져','닥쳐','뒤져','죽어',
  'fuck','shit','bitch','asshole','bastard','cunt','cock','dick','pussy','whore','slut','nigger','nigga',
  // 시스템·사칭 (모든 사용자 차단)
  '관리자','운영자','운영진','스태프','시스템','공식',
  'admin','administrator','system','root','moderator','support','official','staff','bot',
  'anonymous','anon','익명','무명','null','undefined','deleted','guest',
  // 광고·스팸
  'http','https','www','.com','.net','.org','.io',
]

// 브랜드 단어 = owner만 허용
const BANNED_BRAND: string[] = [
  'revely','레블리','레브','피노','pino','모이','moi',
  '운명연구소','나어때','꿈자루','kkumjaru',
  'sidereus','hueli','pastlife','zenmind','voicemirror',
]

const NR: Record<string, string> = {
  '0':'o','1':'i','3':'e','4':'a','5':'s','6':'b','8':'b','9':'g','@':'a','$':'s','!':'i'
}

function normalize(s: string): string {
  return s.toLowerCase().split('').map(c => NR[c] ?? c).join('').replace(/[^a-z가-힣]/g, '')
}

export function validateNickname(nick: string, role: UserRole = 'user'): string | null {
  const t = nick.trim()
  if (t.length < 2) return '닉네임은 2자 이상이어야 합니다'
  if (t.length > 10) return '닉네임은 10자 이하여야 합니다'
  if (!/^[가-힣a-zA-Z0-9]+$/.test(t)) return '한글·영문·숫자만 사용 가능합니다'

  const lower = t.toLowerCase()
  const norm = normalize(t)

  // 욕설·시스템 = exact match만
  for (const b of BANNED_ALL) {
    if (lower === b.toLowerCase() || norm === normalize(b)) {
      return '사용할 수 없는 닉네임입니다'
    }
  }

  // 브랜드 단어 = exact match만, owner 허용
  if (role !== 'owner') {
    for (const b of BANNED_BRAND) {
      if (lower === b.toLowerCase() || norm === normalize(b)) {
        return '사용할 수 없는 닉네임입니다'
      }
    }
  }

  return null
}

export const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9]+$/
