'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useT } from '@/lib/i18n-client';

interface InAppState {
  isInApp: boolean;
  isKakao: boolean;
  appName: string;
}

const InAppContext = createContext<InAppState>({ isInApp: false, isKakao: false, appName: '' });
export function useInAppBrowser() { return useContext(InAppContext); }

function detectInApp(): InAppState {
  if (typeof window === 'undefined') return { isInApp: false, isKakao: false, appName: '' };
  const ua = navigator.userAgent || '';
  if (/KAKAOTALK/i.test(ua)) return { isInApp: true, isKakao: true, appName: 'KakaoTalk' };
  if (/\bThreads\//i.test(ua)) return { isInApp: true, isKakao: false, appName: 'Threads' };
  if (/FBAN|FBAV/i.test(ua)) return { isInApp: true, isKakao: false, appName: 'Facebook' };
  if (/Instagram/i.test(ua)) return { isInApp: true, isKakao: false, appName: 'Instagram' };
  if (/Line\//i.test(ua)) return { isInApp: true, isKakao: false, appName: 'LINE' };
  if (/NAVER\(inapp/i.test(ua)) return { isInApp: true, isKakao: false, appName: 'Naver' };
  if (/DaumApps/i.test(ua)) return { isInApp: true, isKakao: false, appName: 'Daum' };
  if (/Musical\.ly|TikTok/i.test(ua)) return { isInApp: true, isKakao: false, appName: 'TikTok' };
  if (/Twitter\/|XCom\//i.test(ua)) return { isInApp: true, isKakao: false, appName: 'X' };
  if (/LinkedInApp/i.test(ua)) return { isInApp: true, isKakao: false, appName: 'LinkedIn' };
  if (/MicroMessenger/i.test(ua)) return { isInApp: true, isKakao: false, appName: 'WeChat' };
  return { isInApp: false, isKakao: false, appName: '' };
}

function tryOpenExternal(appName?: string) {
  const url = window.location.href;
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (appName === 'KakaoTalk') {
    const enc = encodeURIComponent(url);
    try { window.location.href = `kakaotalk://web/openExternal?url=${enc}`; } catch { /* noop */ }
    return;
  }
  if (!isIOS) {
    setTimeout(() => {
      try { window.location.href = `intent://${url.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`; } catch { /* noop */ }
    }, 400);
  }
  if (isIOS) {
    setTimeout(() => {
      try { window.location.href = `x-safari-https://${url.replace(/^https?:\/\//, '')}`; } catch { /* noop */ }
    }, 400);
  }
}

export function InAppBrowserGuard({ children }: { children: ReactNode }) {
  const [state, setState] = useState<InAppState>({ isInApp: false, isKakao: false, appName: '' });
  const [showGuide, setShowGuide] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // /auth/ 경로에서는 OAuth 콜백 처리를 위해 가이드 스킵
    if (window.location.pathname.startsWith('/auth/')) return;
    const detected = detectInApp();
    setState(detected);
    if (detected.isInApp) {
      setShowGuide(true);
      tryOpenExternal(detected.appName);
    }
  }, []);

  async function copyUrl() {
    try { await navigator.clipboard.writeText(window.location.href); } catch { /* noop */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  if (showGuide) {
    return (
      <InAppContext.Provider value={state}>
        <InAppGuideContent state={state} copied={copied} onCopyUrl={copyUrl} onClose={() => setShowGuide(false)} />
      </InAppContext.Provider>
    );
  }

  return (
    <InAppContext.Provider value={state}>
      {children}
    </InAppContext.Provider>
  );
}

function InAppGuideContent({ state, copied, onCopyUrl, onClose }: {
  state: InAppState; copied: boolean; onCopyUrl: () => void; onClose: () => void;
}) {
  const { m, t } = useT();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center bg-[#FFF8F0]">
      <div className="text-5xl select-none">🐱</div>
      <div className="space-y-2">
        <h1 className="text-xl font-bold text-[#4A2C0A]">{t(m.inapp.title, { appName: state.appName })}</h1>
        <p className="text-sm max-w-xs leading-relaxed text-[#A0785A]">
          {t(m.inapp.desc, { appName: state.appName }).split('\n').map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button type="button" onClick={() => tryOpenExternal(state.appName)}
          className="w-full py-3 rounded-2xl font-bold text-white text-sm transition hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #A0785A, #6B4C2A)' }}>
          {m.inapp.openExternal}
        </button>
        <button type="button" onClick={onCopyUrl}
          className="w-full py-2.5 rounded-2xl text-sm font-medium border border-[#FFD4A8] bg-white transition hover:bg-[#FFF8F0]"
          style={{ color: copied ? '#16a34a' : '#6B4C2A' }}>
          {copied ? m.inapp.copied : m.inapp.copyUrl}
        </button>
      </div>
      <button type="button" onClick={onClose} className="text-xs underline text-[#A0785A]">
        {m.inapp.continueWithout}
      </button>
    </div>
  );
}
