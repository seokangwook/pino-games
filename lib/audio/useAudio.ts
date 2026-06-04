'use client'
import { useEffect, useState } from 'react'
import { BGM_URLS, BgmKey } from './bgm'

const VOLUME_KEY = 'pino_bgm_volume'
const MUTED_KEY = 'pino_bgm_muted'
let globalAudio: HTMLAudioElement | null = null
let currentKey: string | null = null

export function useAudio(bgmKey: BgmKey | null) {
  const [volume, setVolumeState] = useState<number>(() => typeof window==='undefined' ? 0.4 : parseFloat(localStorage.getItem(VOLUME_KEY) ?? '0.4'))
  const [muted, setMutedState] = useState<boolean>(() => typeof window==='undefined' ? false : localStorage.getItem(MUTED_KEY) === 'true')
  useEffect(() => {
    if (typeof window === 'undefined' || !bgmKey) return
    const url = BGM_URLS[bgmKey]; if (!url) return
    if (!globalAudio) { globalAudio = new Audio(); globalAudio.loop = true; globalAudio.preload = 'none' }
    if (currentKey !== bgmKey) { globalAudio.pause(); globalAudio.src = url; currentKey = bgmKey }
    globalAudio.volume = muted ? 0 : volume
    if (!muted) globalAudio.play().catch(() => {})
  }, [bgmKey])
  useEffect(() => { if (globalAudio) globalAudio.volume = muted ? 0 : volume }, [volume, muted])
  function setVolume(v: number) { setVolumeState(v); localStorage.setItem(VOLUME_KEY, String(v)); if (globalAudio) globalAudio.volume = muted ? 0 : v }
  function toggleMute() { const n = !muted; setMutedState(n); localStorage.setItem(MUTED_KEY, String(n)); if (globalAudio) globalAudio.volume = n ? 0 : volume }
  function playOnce(key: BgmKey) { const url = BGM_URLS[key]; if (!url || muted) return; const s = new Audio(url); s.volume = volume * 0.8; s.play().catch(() => {}) }
  return { volume, muted, setVolume, toggleMute, playOnce }
}
export function stopBgm() { globalAudio?.pause() }
