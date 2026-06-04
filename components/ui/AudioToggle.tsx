'use client'
import { useAudio } from '@/lib/audio/useAudio'
import { BgmKey } from '@/lib/audio/bgm'

interface AudioToggleProps { bgmKey: BgmKey; className?: string }

export function AudioToggle({ bgmKey, className = '' }: AudioToggleProps) {
  const { volume, muted, setVolume, toggleMute } = useAudio(bgmKey)
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button onClick={toggleMute} title={muted ? '소리 켜기' : '소리 끄기'}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/60 hover:bg-white border border-[#FFD4A8]/50 text-[#6B4C2A] transition-all shadow-sm text-sm">
        {muted ? '🔇' : volume > 0.5 ? '🔊' : '🔉'}
      </button>
      {!muted && (
        <input type="range" min="0" max="1" step="0.05" value={volume}
          onChange={e => setVolume(parseFloat(e.target.value))}
          className="w-16 h-1 accent-[#FFB7C5] cursor-pointer" title="볼륨" />
      )}
    </div>
  )
}
