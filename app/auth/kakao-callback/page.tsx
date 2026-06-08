'use client'
import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/store/authStore'

function KakaoCallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    if (error || !code) { router.replace('/'); return }

    const redirectUri = window.location.origin + '/auth/kakao-callback'
    fetch('/api/auth/kakao-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirectUri }),
    })
      .then(r => r.json())
      .then(async ({ idToken, error: e }) => {
        if (e || !idToken) { router.replace('/'); return }
        await supabase.auth.signInWithIdToken({ provider: 'kakao', token: idToken })
        router.replace('/')
      })
      .catch(() => router.replace('/'))
  }, [router, searchParams])

  return null
}

export default function KakaoCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
      <div className="text-center space-y-3">
        <div className="text-4xl animate-bounce select-none">🐱</div>
        <p className="text-sm text-[#A0785A] font-medium">카카오 로그인 중...</p>
        <Suspense><KakaoCallbackHandler /></Suspense>
      </div>
    </div>
  )
}
