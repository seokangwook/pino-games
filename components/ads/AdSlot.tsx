'use client'
import { useEffect, useRef } from 'react'

interface AdSlotProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal'
  className?: string
}

const PUB = 'ca-pub-4128588337803742'
const ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true'

export function AdSlot({ slot, format = 'auto', className = '' }: AdSlotProps) {
  const pushed = useRef(false)
  useEffect(() => {
    if (!ENABLED || pushed.current) return
    try {
      const adsbygoogle = (window as any).adsbygoogle ?? []
      adsbygoogle.push({})
      pushed.current = true
    } catch {}
  }, [])

  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`text-center text-xs border border-dashed border-pink-200 p-3 rounded text-pink-400 ${className}`}>
        광고 자리 ({slot})
      </div>
    )
  }

  if (!ENABLED) return null

  return (
    <div className={`text-center overflow-hidden ${className}`}>
      <ins className="adsbygoogle" style={{ display: 'block' }}
        data-ad-client={PUB} data-ad-slot={slot}
        data-ad-format={format} data-full-width-responsive="true" />
    </div>
  )
}
