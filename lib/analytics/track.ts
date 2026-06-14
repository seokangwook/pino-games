/**
 * track — 전 앱 공통 "거의 실시간" 트래픽 클라이언트 (모든 앱 공통)
 * 출처: D:\reve\shared\analytics\track.ts (수정 시 shared 원본도 함께 갱신)
 */

export type EventType = "pageview" | "premium_click" | "result_view" | "share";

export interface TrackOptions {
  endpoint?: string;
  path?: string;
}

const DEFAULT_ENDPOINT = "/api/track";
const SESSION_KEY = "_rv_sid";
const PV_THROTTLE_MS = 1500;
let lastPv = { path: "", at: 0 };

let memSid = "";
function uuid(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    /* ignore */
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let sid = window.localStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = uuid();
      window.localStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    /* localStorage 차단 → sessionStorage 시도 */
  }
  try {
    let sid = window.sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = uuid();
      window.sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    /* 둘 다 막히면 메모리 */
  }
  if (!memSid) memSid = uuid();
  return memSid;
}

export function classifyReferrer(referrer: string, currentHost?: string): string {
  if (!referrer) return "direct";
  let host = "";
  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    return "other";
  }
  if (!host) return "direct";
  if (currentHost && host === currentHost.toLowerCase()) return "direct";

  const has = (s: string) => host === s || host.endsWith("." + s) || host.includes(s);
  if (has("threads.net") || has("threads.com")) return "threads";
  if (has("instagram.com") || has("cdninstagram") || host === "l.instagram.com") return "instagram";
  if (has("facebook.com") || has("fb.com") || host === "l.facebook.com" || has("fb.me")) return "facebook";
  if (has("youtube.com") || has("youtu.be")) return "youtube";
  if (has("twitter.com") || host === "t.co" || has("x.com")) return "x";
  if (has("kakao.com") || has("kakaocdn") || has("daum.net")) return "kakao";
  if (has("naver.com") || has("naver.me")) return "naver";
  if (has("google.") || has("bing.com") || has("yahoo.") || has("duckduckgo.com") || has("baidu.com") || has("yandex.")) return "search";
  return "other";
}

function deviceType(): string {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent || "";
  if (/bot|crawl|spider|slurp|bingpreview/i.test(ua)) return "bot";
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return "tablet";
  if (/Mobi|iPhone|Android.*Mobile|iPod|Windows Phone/i.test(ua)) return "mobile";
  return "desktop";
}

function send(app: string, type: EventType, opts: TrackOptions = {}): void {
  if (typeof window === "undefined") return;
  const endpoint = opts.endpoint || DEFAULT_ENDPOINT;
  const path =
    opts.path ||
    (typeof location !== "undefined" ? location.pathname + location.search : "");
  const referrer = typeof document !== "undefined" ? document.referrer || "" : "";
  const host = typeof location !== "undefined" ? location.hostname : "";

  const payload = {
    app,
    type,
    path: path.slice(0, 512),
    referrer: referrer.slice(0, 1024),
    referrerSource: classifyReferrer(referrer, host),
    sessionId: getOrCreateSessionId(),
    device: deviceType(),
  };

  try {
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}

export function trackPageView(app: string, opts: TrackOptions = {}): void {
  if (typeof window === "undefined") return;
  const path =
    opts.path ||
    (typeof location !== "undefined" ? location.pathname + location.search : "");
  const now = Date.now();
  if (path === lastPv.path && now - lastPv.at < PV_THROTTLE_MS) return;
  lastPv = { path, at: now };
  send(app, "pageview", opts);
}

export function trackEvent(app: string, type: EventType, opts: TrackOptions = {}): void {
  send(app, type, opts);
}

export function initAnalytics(app: string, opts: TrackOptions = {}): () => void {
  if (typeof window === "undefined") return () => {};

  trackPageView(app, opts);

  const fire = () => trackPageView(app, opts);
  const origPush = history.pushState;
  const origReplace = history.replaceState;

  history.pushState = function (this: History, ...args: any[]) {
    const r = origPush.apply(this, args as any);
    fire();
    return r;
  } as typeof history.pushState;
  history.replaceState = function (this: History, ...args: any[]) {
    const r = origReplace.apply(this, args as any);
    fire();
    return r;
  } as typeof history.replaceState;

  window.addEventListener("popstate", fire);

  return () => {
    history.pushState = origPush;
    history.replaceState = origReplace;
    window.removeEventListener("popstate", fire);
  };
}
