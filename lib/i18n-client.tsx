'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Locale, Messages } from './i18n'
import { DEFAULT_LOCALE, HTML_LANG, LOCALE_COOKIE, RTL_LOCALES, detectLocale, loadMessages } from './i18n'
import { t as interpolate } from './i18n'

type Ctx = { locale: Locale; messages: Messages; setLocale: (l: Locale) => void }
const I18nContext = createContext<Ctx | null>(null)

export function I18nProvider({ children, initialMessages }: { children: ReactNode; initialMessages: Messages }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)
  const [messages, setMessages] = useState<Messages>(initialMessages)

  useEffect(() => {
    const detected = detectLocale()
    if (detected !== DEFAULT_LOCALE) {
      loadMessages(detected).then(m => { setMessages(m); setLocaleState(detected) })
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[locale]
    document.documentElement.dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr'
  }, [locale])

  function setLocale(l: Locale) {
    setLocaleState(l)
    localStorage.setItem(LOCALE_COOKIE, l)
    loadMessages(l).then(m => setMessages(m))
  }

  return <I18nContext.Provider value={{ locale, messages, setLocale }}>{children}</I18nContext.Provider>
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

export function useT() {
  const { messages, locale, setLocale } = useI18n()
  return {
    locale,
    m: messages,
    setLocale,
    t: (template: string, vars: Record<string, string | number> = {}) => interpolate(template, vars),
  }
}
