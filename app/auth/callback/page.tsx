'use client'
import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/store/authStore'

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'
    if (code) {
      supabase.auth.exchangeCodeForSession(code)
        .then(() => router.replace(next))
        .catch(() => router.replace('/'))
    } else {
      router.replace('/')
    }
  }, [router, searchParams])

  return null
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
      <div className="text-center space-y-3">
        <div className="text-4xl animate-bounce select-none">🐱</div>
        <p className="text-sm text-[#A0785A] font-medium">로그인 중...</p>
        <Suspense>
          <CallbackHandler />
        </Suspense>
      </div>
    </div>
  )
}
