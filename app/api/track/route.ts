/**
 * /api/track — 거의 실시간 트래픽 수집 endpoint
 * 출처: D:\reve\shared\analytics\api-route.ts (수정 시 shared 원본도 함께 갱신)
 */

import { NextResponse } from "next/server";
import { createHash } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_APPS = new Set(["pino-games"]);

const ALLOWED_TYPES = new Set(["pageview", "premium_click", "result_view", "share"]);

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 120;
const hits = new Map<string, number[]>();

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for") || "";
  return xff.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > MAX_PER_WINDOW;
}

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.slice(0, max) : "";
}

function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT || "reve-analytics-v1";
  return createHash("sha256").update(salt + "|" + ip).digest("hex").slice(0, 64);
}

function uaType(ua: string): string {
  if (!ua) return "desktop";
  if (/bot|crawl|spider|slurp|bingpreview|facebookexternalhit|preview/i.test(ua)) return "bot";
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return "tablet";
  if (/Mobi|iPhone|Android.*Mobile|iPod|Windows Phone/i.test(ua)) return "mobile";
  return "desktop";
}

function classifyReferrer(referrer: string, selfHost: string): string {
  if (!referrer) return "direct";
  let host = "";
  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    return "other";
  }
  if (!host) return "direct";
  if (selfHost && host === selfHost.toLowerCase()) return "direct";
  const has = (s: string) => host === s || host.endsWith("." + s) || host.includes(s);
  if (has("threads.net") || has("threads.com")) return "threads";
  if (has("instagram.com") || has("cdninstagram")) return "instagram";
  if (has("facebook.com") || has("fb.com") || has("fb.me")) return "facebook";
  if (has("youtube.com") || has("youtu.be")) return "youtube";
  if (has("twitter.com") || host === "t.co" || has("x.com")) return "x";
  if (has("kakao.com") || has("kakaocdn") || has("daum.net")) return "kakao";
  if (has("naver.com") || has("naver.me")) return "naver";
  if (has("google.") || has("bing.com") || has("yahoo.") || has("duckduckgo.com") || has("baidu.com") || has("yandex.")) return "search";
  return "other";
}

export async function POST(req: Request) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const app = str(body.app, 64).trim();
  if (!ALLOWED_APPS.has(app)) {
    return NextResponse.json({ ok: false, error: "unknown_app" }, { status: 400 });
  }
  const type = ALLOWED_TYPES.has(str(body.type, 32)) ? str(body.type, 32) : "pageview";

  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: true, throttled: true });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yiduavoxineujidorcbx.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpZHVhdm94aW5ldWppZG9yY2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NDE4MzAsImV4cCI6MjA5MjExNzgzMH0.lPhnp5DZD_6y0BcSaj_lQhHSVE4kbyuQn7OhngJp71U';

  const ua = str(req.headers.get("user-agent"), 500);
  const country =
    str(req.headers.get("x-vercel-ip-country"), 8) ||
    str(req.headers.get("cf-ipcountry"), 8) ||
    "";
  const referrer = str(body.referrer, 1024);
  const selfHost = str(req.headers.get("host"), 255);
  const source = classifyReferrer(referrer, selfHost);

  try {
    const res = await fetch(`${url}/rest/v1/rpc/ingest_page_event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        p_app: app,
        p_path: str(body.path, 512),
        p_referrer: referrer,
        p_referrer_source: source,
        p_country: country,
        p_ip_hash: hashIp(ip),
        p_session_id: str(body.sessionId, 64),
        p_user_agent_type: uaType(ua) === "desktop" ? str(body.device, 16) || "desktop" : uaType(ua),
        p_event_type: type,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { ok: false, error: "ingest_failed", detail: text.slice(0, 200) },
        { status: 200 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "unexpected" }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "track", app: "pino-games" });
}
