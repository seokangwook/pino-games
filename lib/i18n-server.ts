import { headers, cookies } from 'next/headers'
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALES, isLocale, type Locale, type Messages, loadMessages } from './i18n'

function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE
  const candidates = acceptLanguage
    .split(',')
    .map(part => {
      const [tag, ...params] = part.trim().split(';')
      const qStr = params.map(p => p.trim()).find(p => p.startsWith('q='))?.slice(2)
      return { tag: tag.trim().toLowerCase(), q: qStr ? parseFloat(qStr) : 1.0 }
    })
    .sort((a, b) => b.q - a.q)

  for (const c of candidates) {
    const exact = LOCALES.find(l => l.toLowerCase() === c.tag)
    if (exact) return exact

    const primary = c.tag.split('-')[0]
    if (primary === 'zh') {
      if (c.tag.includes('tw') || c.tag.includes('hk') || c.tag.includes('hant')) return 'zh-TW'
      return 'zh-CN'
    }
    if (primary === 'pt') return 'pt-BR'

    const match = LOCALES.find(l => l.toLowerCase().split('-')[0] === primary)
    if (match) return match
  }
  return DEFAULT_LOCALE
}

export async function getServerLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies()
    const val = cookieStore.get(LOCALE_COOKIE)?.value
    if (val && isLocale(val)) return val
  } catch {}

  try {
    const headerStore = await headers()
    return negotiateLocale(headerStore.get('accept-language'))
  } catch {}

  return DEFAULT_LOCALE
}

export async function getServerMessages(locale: Locale): Promise<Messages> {
  return loadMessages(locale)
}
