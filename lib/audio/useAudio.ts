'use client'
import { useEffect, useState } from 'react'
import { BGM_URLS, BgmKey } from './bgm'

const VOLUME_KEY = 'pino_bgm_volume'
const MUTED_KEY = 'pino_bgm_muted'
const BGM_STARTED_EVENT = 'pino-bgm-started'

let globalAudio: HTMLAudioElement | null = null
let currentKey: string | null = null
let audioStarted = false
let unlockListenerAdded = false

// Notify all mounted useAudio instances that BGM started (via DOM event)
function notifyBgmStarted() {
  if (typeof document !== 'undefined') {
    document.dispatchEvent(new CustomEvent(BGM_STARTED_EVENT))
  }
}

// Register one-time first-interaction unlock listener (module-level, added once)
function ensureUnlockListener() {
  if (unlockListenerAdded || typeof document === 'undefined') return
  unlockListenerAdded = true
  const unlock = () => {
    if (!audioStarted && globalAudio) {
      const vol = parseFloat(localStorage.getItem(VOLUME_KEY) ?? '0.4')
      audioStarted = true
      localStorage.setItem(MUTED_KEY, 'false')
      globalAudio.volume = vol
      globalAudio.play()
        .then(() => notifyBgmStarted())
        .catch(e => {
          console.warn('[BGM] auto-unlock failed:', e.name)
          audioStarted = false
          unlockListenerAdded = false  // allow retry next mount
        })
    }
  }
  document.addEventListener('click', unlock, { once: true })
  document.addEventListener('touchstart', unlock, { once: true, passive: true })
}

export function useAudio(bgmKey: BgmKey | null) {
  const [volume, setVolumeState] = useState<number>(() =>
    typeof window === 'undefined' ? 0.4 : parseFloat(localStorage.getItem(VOLUME_KEY) ?? '0.4'))
  const [muted, setMutedState] = useState<boolean>(() =>
    typeof window === 'undefined' ? false : localStorage.getItem(MUTED_KEY) === 'true')
  const [started, setStarted] = useState(() => audioStarted)

  // Listen for bgm-started event (fired by auto-unlock or any hook instance)
  useEffect(() => {
    const handler = () => { setStarted(true); setMutedState(false) }
    document.addEventListener(BGM_STARTED_EVENT, handler)
    return () => document.removeEventListener(BGM_STARTED_EVENT, handler)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !bgmKey) return
    const url = BGM_URLS[bgmKey]; if (!url) return
    if (!globalAudio) {
      globalAudio = new Audio()
      globalAudio.loop = true
      globalAudio.preload = 'auto'
    }
    const wasPlaying = audioStarted && !muted
    if (currentKey !== bgmKey) {
      globalAudio.pause()
      globalAudio.src = url
      globalAudio.load()
      currentKey = bgmKey
    }
    globalAudio.volume = muted ? 0 : volume
    if (wasPlaying) {
      globalAudio.play().catch(e => console.warn('[BGM] track-change play failed:', e.name))
    }
    // Register first-interaction unlock (starts BGM on any tap/click)
    ensureUnlockListener()
  }, [bgmKey])

  useEffect(() => {
    if (globalAudio) globalAudio.volume = muted ? 0 : volume
  }, [volume, muted])

  function setVolume(v: number) {
    setVolumeState(v)
    localStorage.setItem(VOLUME_KEY, String(v))
    if (globalAudio) globalAudio.volume = muted ? 0 : v
  }

  function toggleMute() {
    if (!audioStarted) {
      audioStarted = true
      setStarted(true)
      setMutedState(false)
      localStorage.setItem(MUTED_KEY, 'false')
      if (globalAudio) {
        globalAudio.volume = volume
        globalAudio.play()
          .then(() => notifyBgmStarted())
          .catch(e => {
            console.error('[BGM] play failed:', e.name, e.message)
            audioStarted = false
            setStarted(false)
          })
      }
    } else {
      const n = !muted
      setMutedState(n)
      localStorage.setItem(MUTED_KEY, String(n))
      if (globalAudio) {
        globalAudio.volume = n ? 0 : volume
        if (!n) globalAudio.play().catch(e => console.warn('[BGM] unmute play failed:', e.name))
      }
    }
  }

  function playOnce(key: BgmKey) {
    if (!audioStarted) return
    const url = BGM_URLS[key]; if (!url || muted) return
    const s = new Audio(url); s.volume = volume * 0.8; s.play().catch(() => {})
  }

  return { volume, muted, started, setVolume, toggleMute, playOnce }
}

export function stopBgm() { globalAudio?.pause() }
