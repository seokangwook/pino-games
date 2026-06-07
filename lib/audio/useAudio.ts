'use client'
import { useEffect, useState } from 'react'
import { BGM_URLS, BgmKey } from './bgm'

const VOLUME_KEY = 'pino_bgm_volume'
const MUTED_KEY = 'pino_bgm_muted'
let globalAudio: HTMLAudioElement | null = null
let currentKey: string | null = null
let audioStarted = false

export function useAudio(bgmKey: BgmKey | null) {
  const [volume, setVolumeState] = useState<number>(() => typeof window==='undefined' ? 0.4 : parseFloat(localStorage.getItem(VOLUME_KEY) ?? '0.4'))
  const [muted, setMutedState] = useState<boolean>(() => typeof window==='undefined' ? false : localStorage.getItem(MUTED_KEY) === 'true')
  const [started, setStarted] = useState(() => audioStarted)

  useEffect(() => {
    if (typeof window === 'undefined' || !bgmKey) return
    const url = BGM_URLS[bgmKey]; if (!url) return
    if (!globalAudio) {
      globalAudio = new Audio()
      globalAudio.loop = true
      // iOS Safari fix: preload='auto' ensures readyState >= 1 before play()
      // preload='none' + readyState=0 causes NotAllowedError even on real user gestures (WebKit bug)
      globalAudio.preload = 'auto'
    }
    const wasPlaying = audioStarted && !muted
    if (currentKey !== bgmKey) {
      globalAudio.pause()
      globalAudio.src = url
      globalAudio.load()  // explicit load — iOS Safari needs this to start buffering
      currentKey = bgmKey
    }
    globalAudio.volume = muted ? 0 : volume
    if (wasPlaying) {
      globalAudio.play().catch(e => console.warn('[BGM] track-change play failed:', e.name))
    }
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
        globalAudio.play().catch(e => {
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
