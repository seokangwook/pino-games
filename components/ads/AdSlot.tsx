'use client'
import { useEffect, useRef } from 'react'

interface AdSlotProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal'
  className?: string
}

const PUB = 'ca-pub-4128588337803742'

export function AdSlot({ slot, format = 'auto', className = '' }: AdSlotProps) {
  const pushed = useRef(false)
  useEffect(() => {
    if (pushed.current) return
    try {
      const adsbygoogle = (window as any).adsbygoogle ?? []
      adsbygoogle.push({})
      pushed.current = true
    } catch {}
  }, [])
  return (
    <div className={`text-center overflow-hidden ${className}`}>
      <ins className="adsbygoogle" style={{ display: 'block' }}
        data-ad-client={PUB} data-ad-slot={slot}
        data-ad-format={format} data-full-width-responsive="true" />
    </div>
  )
}
