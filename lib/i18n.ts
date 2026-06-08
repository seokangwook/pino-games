export const LOCALES = [
  'ko', 'en', 'ja', 'zh-CN', 'zh-TW',
  'es', 'pt-BR', 'fr', 'de', 'it',
  'ru', 'ar', 'id', 'hi', 'vi', 'th',
] as const

export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'ko'
export const RTL_LOCALES: ReadonlyArray<Locale> = ['ar']
export const LOCALE_COOKIE = 'pino_locale'

export const LOCALE_LABELS: Record<Locale, string> = {
  ko: '한국어', en: 'English', ja: '日本語',
  'zh-CN': '简体中文', 'zh-TW': '繁體中文',
  es: 'Español', 'pt-BR': 'Português (BR)',
  fr: 'Français', de: 'Deutsch', it: 'Italiano',
  ru: 'Русский', ar: 'العربية',
  id: 'Bahasa Indonesia', hi: 'हिन्दी',
  vi: 'Tiếng Việt', th: 'ไทย',
}

export const HTML_LANG: Record<Locale, string> = {
  ko: 'ko-KR', en: 'en', ja: 'ja-JP',
  'zh-CN': 'zh-Hans', 'zh-TW': 'zh-Hant',
  es: 'es', 'pt-BR': 'pt-BR',
  fr: 'fr', de: 'de', it: 'it',
  ru: 'ru', ar: 'ar', id: 'id',
  hi: 'hi', vi: 'vi', th: 'th',
}

export function isLocale(v: unknown): v is Locale {
  return typeof v === 'string' && (LOCALES as readonly string[]).includes(v)
}

export function isRtl(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale)
}

export function detectLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  const stored = localStorage.getItem(LOCALE_COOKIE)
  if (isLocale(stored)) return stored
  const nav = navigator.language
  if (isLocale(nav)) return nav
  const primary = nav.split('-')[0]
  if (primary === 'zh') {
    if (/TW|HK|Hant/i.test(nav)) return 'zh-TW'
    return 'zh-CN'
  }
  if (primary === 'pt') return 'pt-BR'
  const match = LOCALES.find(l => l.toLowerCase().split('-')[0] === primary.toLowerCase())
  return match ?? DEFAULT_LOCALE
}

export type Messages = {
  meta: { title: string; description: string; keywords: string }
  home: {
    tagline: string
    ranking: string
    cardGame: { title: string; desc: string; subDesc: string; cta: string }
    findGame: { title: string; desc: string; subDesc: string; cta: string }
    footer: string
  }
  mode: { title: string; subtitle: string; single: string; singleDesc: string; multi: string; multiDesc: string; back: string }
  card: {
    title: string; difficulty: string
    easy: string; medium: string; hard: string
    startGame: string; moves: string; matched: string; time: string; restart: string
    rankCheck: string; rankResult: string; loginToast: string; multiHeader: string
  }
  result: { clear: string; stat: string; saved: string; guestSaved: string; loginPrompt: string; replay: string; viewRanking: string; menu: string }
  guestNickname: { title: string; subtitle: string; hint: string; placeholder: string; save: string; skip: string; persist: string }
  ranking: {
    title: string; tab4x4: string; tab4x6: string; tab6x6: string
    loading: string; empty: string
    colRank: string; colPlayer: string; colTime: string; colMoves: string; movesSuffix: string
    loginHint: string
  }
  room: {
    tabCreate: string; tabJoin: string; grid: string; mode: string
    modeConcurrent: string; modeTurn: string; createBtn: string
    codePlaceholder: string; joinBtn: string; joining: string
    created: string; shareHint: string; tapCopy: string
    sendInvite: string; copyCode: string; waiting: string; cancel: string
    shareTitle: string; shareText: string; codeCopied: string; linkCopied: string
  }
  gameResult: {
    victory: string; defeat: string; victoryMsg: string; defeatMsg: string
    myMatched: string; elapsed: string; opMatched: string; opClear: string
    rematch: string; home: string
  }
  auth: {
    logout: string; login: string; kakaoLogin: string
    nicknameTitle: string; nicknameSubtitle: string; nicknameHint: string
    nicknamePlaceholder: string; nicknameSave: string; nicknameSaving: string
    nicknameChecking: string; nicknameSharedHint: string; duplicate: string
  }
  inapp: {
    title: string; desc: string; openExternal: string
    copyUrl: string; copied: string; manualSteps: string; continueWithout: string
  }
  locale: { label: string }
}

export async function loadMessages(locale: Locale): Promise<Messages> {
  try {
    const mod = await import(`@/messages/${locale}.json`)
    return (mod.default || mod) as Messages
  } catch {
    const fb = await import(`@/messages/${DEFAULT_LOCALE}.json`)
    return (fb.default || fb) as Messages
  }
}

export function t(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k] ?? ''))
}
