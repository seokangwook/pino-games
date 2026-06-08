'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

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
  if (/KAKAOTALK/i.test(ua)) return { isInApp: true, isKakao: true, appName: '카카오톡' };
  if (/\bThreads\//i.test(ua)) return { isInApp: true, isKakao: false, appName: 'Threads' };
  if (/FBAN|FBAV/i.test(ua)) return { isInApp: true, isKakao: false, appName: 'Facebook' };
  if (/Instagram/i.test(ua)) return { isInApp: true, isKakao: false, appName: 'Instagram' };
  if (/Line\//i.test(ua)) return { isInApp: true, isKakao: false, appName: 'LINE' };
  if (/NAVER\(inapp/i.test(ua)) return { isInApp: true, isKakao: false, appName: '네이버 앱' };
  if (/DaumApps/i.test(ua)) return { isInApp: true, isKakao: false, appName: 'Daum' };
  if (/Musical\.ly|TikTok/i.test(ua)) return { isInApp: true, isKakao: false, appName: 'TikTok' };
  if (/Twitter\/|XCom\//i.test(ua)) return { isInApp: true, isKakao: false, appName: 'X(Twitter)' };
  if (/LinkedInApp/i.test(ua)) return { isInApp: true, isKakao: false, appName: 'LinkedIn' };
  if (/MicroMessenger/i.test(ua)) return { isInApp: true, isKakao: false, appName: 'WeChat' };
  return { isInApp: false, isKakao: false, appName: '' };
}

function tryOpenExternal(appName?: string) {
  const url = window.location.href;
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (appName === '카카오톡') {
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

function getManualSteps(appName: string): string[] {
  switch (appName) {
    case 'Threads': return ['화면 우측 상단 ··· 탭', '"Safari로 열기" 또는 "브라우저에서 열기" 선택'];
    case 'Instagram': return ['우측 하단 ··· 탭', '"브라우저에서 열기" 선택'];
    case 'Facebook': return ['우측 상단 ··· 탭', '"브라우저에서 열기" 선택'];
    case 'LINE': return ['상단 주소창 옆 공유 아이콘 탭', '"Safari로 열기" 또는 "Chrome으로 열기" 선택'];
    case '네이버 앱': case 'Daum': return ['상단 주소창 옆 ··· 탭', '"외부 브라우저로 열기" 선택'];
    default: return [];
  }
}

export function InAppBrowserGuard({ children }: { children: ReactNode }) {
  const [state, setState] = useState<InAppState>({ isInApp: false, isKakao: false, appName: '' });
  const [showGuide, setShowGuide] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
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
    const steps = getManualSteps(state.appName);
    return (
      <InAppContext.Provider value={state}>
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center bg-[#FFF8F0]">
          <div className="text-5xl select-none">🐱</div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-[#4A2C0A]">
              {state.appName} 앱에서는 Google 로그인이 차단돼요
            </h1>
            <p className="text-sm max-w-xs leading-relaxed text-[#A0785A]">
              Google 정책상 {state.appName} 내부 브라우저에서<br />
              OAuth 로그인이 차단됩니다.<br />
              <strong className="text-[#4A2C0A]">Safari 또는 Chrome</strong>에서 열어주세요.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              type="button"
              onClick={() => tryOpenExternal(state.appName)}
              className="w-full py-3 rounded-2xl font-bold text-white text-sm transition hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #A0785A, #6B4C2A)' }}
            >
              🌐 외부 브라우저로 열기
            </button>
            <button
              type="button"
              onClick={copyUrl}
              className="w-full py-2.5 rounded-2xl text-sm font-medium border border-[#FFD4A8] bg-white transition hover:bg-[#FFF8F0]"
              style={{ color: copied ? '#16a34a' : '#6B4C2A' }}
            >
              {copied ? '✅ 복사됨 — 브라우저 주소창에 붙여넣기' : '📋 URL 복사'}
            </button>
          </div>
          {steps.length > 0 && (
            <div className="w-full max-w-xs rounded-2xl px-4 py-3 text-left space-y-1 bg-white border border-[#FFD4A8]">
              <p className="text-xs font-semibold mb-2 text-[#A0785A]">또는 직접 열기</p>
              {steps.map((s, i) => (
                <p key={i} className="text-xs text-[#6B4C2A]">{i + 1}. {s}</p>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowGuide(false)}
            className="text-xs underline text-[#A0785A]"
          >
            로그인 없이 계속 보기
          </button>
        </div>
      </InAppContext.Provider>
    );
  }

  return (
    <InAppContext.Provider value={state}>
      {children}
    </InAppContext.Provider>
  );
}
