'use client'
import { useAudio } from '@/lib/audio/useAudio'
import { BgmKey } from '@/lib/audio/bgm'

interface AudioToggleProps { bgmKey: BgmKey; className?: string }

export function AudioToggle({ bgmKey, className = '' }: AudioToggleProps) {
  const { volume, muted, started, setVolume, toggleMute } = useAudio(bgmKey)
  const icon = !started ? '🎵' : muted ? '🔇' : volume > 0.5 ? '🔊' : '🔉'
  const title = !started ? '음악 켜기' : muted ? '음악 켜기' : '음소거'
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button onClick={toggleMute} title={title}
        className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all shadow-sm text-sm
          ${!started ? 'bg-[#FFB7C5]/40 border-[#FFB7C5] animate-pulse' : 'bg-white/60 hover:bg-white border-[#FFD4A8]/50 text-[#6B4C2A]'}`}>
        {icon}
      </button>
      {started && !muted && (
        <input type="range" min="0" max="1" step="0.05" value={volume}
          onChange={e => setVolume(parseFloat(e.target.value))}
          className="w-16 h-1 accent-[#FFB7C5] cursor-pointer" title="볼륨" />
      )}
    </div>
  )
}
