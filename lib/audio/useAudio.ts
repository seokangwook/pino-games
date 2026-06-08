'use client'
import { useEffect, useState } from 'react'
import { BGM_URLS, BgmKey } from './bgm'

const VOLUME_KEY = 'pino_bgm_volume'
const MUTED_KEY = 'pino_bgm_muted'
const BGM_STATE_EVENT = 'pino-bgm-state'

// Module-level singletons — shared across ALL useAudio instances
let globalAudio: HTMLAudioElement | null = null
let currentKey: string | null = null
let audioStarted = false
let unlockListenerAdded = false
let globalMuted = false
let globalVolume = 0.4

// Initialize global state from localStorage on first client load
if (typeof window !== 'undefined') {
  globalMuted = localStorage.getItem(MUTED_KEY) === 'true'
  globalVolume = parseFloat(localStorage.getItem(VOLUME_KEY) ?? '0.4')
}

// Broadcast state to all mounted useAudio instances so React state stays in sync
function notifyBgmState() {
  if (typeof document !== 'undefined') {
    document.dispatchEvent(new CustomEvent(BGM_STATE_EVENT, {
      detail: { muted: globalMuted, volume: globalVolume, started: audioStarted }
    }))
  }
}

function ensureUnlockListener() {
  if (unlockListenerAdded || typeof document === 'undefined') return
  unlockListenerAdded = true
  const unlock = () => {
    if (!audioStarted && globalAudio) {
      audioStarted = true
      globalAudio.volume = globalMuted ? 0 : globalVolume
      if (!globalMuted) {
        globalAudio.play()
          .then(() => notifyBgmState())
          .catch(e => {
            console.warn('[BGM] auto-unlock failed:', e.name)
            audioStarted = false
            unlockListenerAdded = false
          })
      } else {
        notifyBgmState()
      }
    }
  }
  document.addEventListener('click', unlock, { once: true })
  document.addEventListener('touchstart', unlock, { once: true, passive: true })
}

export function useAudio(bgmKey: BgmKey | null) {
  // Initialize React state from global singletons (not from localStorage directly)
  const [volume, setVolumeState] = useState(() => globalVolume)
  const [muted, setMutedState] = useState(() => globalMuted)
  const [started, setStarted] = useState(() => audioStarted)

  // All instances stay in sync via DOM event (fixes multi-instance desync bug)
  useEffect(() => {
    const handler = (e: Event) => {
      const { muted: m, volume: v, started: s } = (e as CustomEvent).detail
      setMutedState(m)
      setVolumeState(v)
      setStarted(s)
    }
    document.addEventListener(BGM_STATE_EVENT, handler)
    return () => document.removeEventListener(BGM_STATE_EVENT, handler)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !bgmKey) return
    const url = BGM_URLS[bgmKey]; if (!url) return
    if (!globalAudio) {
      globalAudio = new Audio()
      globalAudio.loop = true
      globalAudio.preload = 'auto'
    }
    // Use globalMuted/globalVolume — not local React state — to avoid stale closure
    const wasPlaying = audioStarted && !globalMuted
    if (currentKey !== bgmKey) {
      globalAudio.pause()
      globalAudio.src = url
      globalAudio.load()
      currentKey = bgmKey
    }
    globalAudio.volume = globalMuted ? 0 : globalVolume
    if (wasPlaying) {
      globalAudio.play().catch(e => console.warn('[BGM] track-change play failed:', e.name))
    }
    ensureUnlockListener()
  }, [bgmKey])

  function setVolume(v: number) {
    globalVolume = v
    setVolumeState(v)
    localStorage.setItem(VOLUME_KEY, String(v))
    if (globalAudio) globalAudio.volume = globalMuted ? 0 : v
    notifyBgmState()
  }

  function toggleMute() {
    if (!audioStarted) {
      // First interaction: start BGM
      audioStarted = true
      globalMuted = false
      localStorage.setItem(MUTED_KEY, 'false')
      if (globalAudio) {
        globalAudio.volume = globalVolume
        globalAudio.play()
          .then(() => notifyBgmState())
          .catch(e => {
            console.error('[BGM] play failed:', e.name, e.message)
            audioStarted = false
            notifyBgmState()
          })
      } else {
        notifyBgmState()
      }
    } else {
      globalMuted = !globalMuted
      localStorage.setItem(MUTED_KEY, String(globalMuted))
      if (globalAudio) {
        if (globalMuted) {
          // Truly pause — not just volume=0
          globalAudio.volume = 0
          globalAudio.pause()
        } else {
          globalAudio.volume = globalVolume
          globalAudio.play().catch(e => console.warn('[BGM] unmute play failed:', e.name))
        }
      }
      notifyBgmState()
    }
  }

  function playOnce(key: BgmKey) {
    if (!audioStarted || globalMuted) return
    const url = BGM_URLS[key]; if (!url) return
    const s = new Audio(url); s.volume = globalVolume * 0.8; s.play().catch(() => {})
  }

  return { volume, muted, started, setVolume, toggleMute, playOnce }
}

export function stopBgm() { globalAudio?.pause() }
