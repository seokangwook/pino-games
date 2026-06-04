'use client'
import { useEffect, useState } from 'react'
import { BGM_URLS, BgmKey } from './bgm'

const VOLUME_KEY = 'pino_bgm_volume'
const MUTED_KEY = 'pino_bgm_muted'
let globalAudio: HTMLAudioElement | null = null
let currentKey: string | null = null
let audioStarted = false  // 사용자가 명시적으로 시작

export function useAudio(bgmKey: BgmKey | null) {
  const [volume, setVolumeState] = useState<number>(() => typeof window==='undefined' ? 0.4 : parseFloat(localStorage.getItem(VOLUME_KEY) ?? '0.4'))
  const [muted, setMutedState] = useState<boolean>(() => typeof window==='undefined' ? false : localStorage.getItem(MUTED_KEY) === 'true')
  const [started, setStarted] = useState(false)

  // Set up audio element and change track when bgmKey changes
  useEffect(() => {
    if (typeof window === 'undefined' || !bgmKey) return
    const url = BGM_URLS[bgmKey]; if (!url) return
    if (!globalAudio) { globalAudio = new Audio(); globalAudio.loop = true; globalAudio.preload = 'none' }
    const wasPlaying = audioStarted && !muted
    if (currentKey !== bgmKey) {
      globalAudio.pause()
      globalAudio.src = url
      currentKey = bgmKey
    }
    globalAudio.volume = muted ? 0 : volume
    if (wasPlaying) {
      globalAudio.play().catch(() => {})
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
      // 처음 클릭 = 재생 시작
      audioStarted = true
      setStarted(true)
      setMutedState(false)
      localStorage.setItem(MUTED_KEY, 'false')
      if (globalAudio) {
        globalAudio.volume = volume
        globalAudio.play().catch(() => {
          // If play still blocked, set muted
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
        if (!n) globalAudio.play().catch(() => {})
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
