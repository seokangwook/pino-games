'use client';
import { useEffect, useRef, useState } from 'react';

const AD_CLIENT = 'ca-pub-4128588337803742';

export function InterstitialAd({ onSkip, duration = 5 }: { onSkip: () => void; duration?: number }) {
  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const [remaining, setRemaining] = useState(duration);

  useEffect(() => {
    if (!pushed.current && ref.current) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        pushed.current = true;
      } catch {}
    }
    if (remaining <= 0) { onSkip(); return; }
    const t = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, onSkip]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
          <span className="text-[11px] text-gray-400">광고</span>
          <button onClick={onSkip}
            className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 hover:bg-gray-200 transition-colors">
            {remaining > 0 ? (
              <><span className="font-mono font-bold text-gray-800">{remaining}</span><span>초 후 건너뛰기</span></>
            ) : '결과 보기 →'}
          </button>
        </div>
        <div className="p-2 min-h-[280px]">
          {process.env.NODE_ENV === 'development' ? (
            <div className="flex items-center justify-center h-[280px] border border-dashed border-gray-200 rounded-xl text-sm text-gray-400">
              광고 자리 (인터스티셜)
            </div>
          ) : (
            <ins ref={ref} className="adsbygoogle"
              style={{ display: 'block', minHeight: 280 }}
              data-ad-client={AD_CLIENT}
              data-ad-slot="6394256326"
              data-ad-format="auto"
              data-full-width-responsive="true" />
          )}
        </div>
      </div>
    </div>
  );
}
