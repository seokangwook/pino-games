'use client'
import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store/authStore'
import { NicknameModal } from './NicknameModal'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { init } = useAuthStore()
  useEffect(() => { init() }, [init])
  return (
    <>
      <NicknameModal />
      {children}
    </>
  )
}
