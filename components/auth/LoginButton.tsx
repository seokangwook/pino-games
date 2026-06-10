'use client'
import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store/authStore'
import { useInAppBrowser } from './InAppBrowserGuard'
import { useT } from '@/lib/i18n-client'

export function LoginButton() {
  const { user, nickname, loading, init, signInWithGoogle, signInWithKakao, signOut } = useAuthStore()
  const { m } = useT()
  const { isKakao } = useInAppBrowser()
  useEffect(() => { init() }, [init])

  return (
    <>
      {!loading && (
        user ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#A0785A] font-bold">{nickname || user.email?.split('@')[0]}</span>
            <button onClick={signOut} className="text-xs text-[#A0785A] underline hover:text-[#6B4C2A]">{m.auth.logout}</button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {!isKakao && (
              <button onClick={signInWithGoogle} className="flex items-center gap-2 bg-white border border-[#FFD4A8] rounded-full px-4 py-2 text-sm font-semibold text-[#6B4C2A] shadow-sm hover:shadow-md transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {m.auth.login}
              </button>
            )}
            <button onClick={signInWithKakao} className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm hover:shadow-md transition-all" style={{ background: '#FEE500', color: '#3C1E1E' }}>
              <svg className="w-4 h-4" viewBox="0 0 18 18" fill="none">
                <path d="M9 1.5C4.86 1.5 1.5 4.14 1.5 7.38c0 2.07 1.3 3.9 3.27 4.98l-.84 3.12 3.57-2.34c.48.06.96.12 1.5.12 4.14 0 7.5-2.64 7.5-5.88S13.14 1.5 9 1.5z" fill="#3C1E1E"/>
              </svg>
              {m.auth.kakaoLogin}
            </button>
          </div>
        )
      )}
    </>
  )
}
