import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "피노 게임 — 귀여운 고양이 카드 맞추기 미니게임";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(150deg, #fef9ec 0%, #fff3cd 50%, #ffe8a0 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
        gap: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          width: 200,
          height: 200,
          borderRadius: 9999,
          background: "rgba(255,180,0,0.18)",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <svg width="140" height="140" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="60" rx="28" ry="24" fill="#ffe066" />
          <ellipse cx="50" cy="58" rx="22" ry="20" fill="#fff5c0" />
          <circle cx="40" cy="54" r="3" fill="#333" />
          <circle cx="60" cy="54" r="3" fill="#333" />
          <circle cx="41" cy="53" r="1.2" fill="#fff" />
          <circle cx="61" cy="53" r="1.2" fill="#fff" />
          <ellipse cx="50" cy="62" rx="4" ry="3" fill="#ffaaaa" />
          <path d="M46 64 Q50 68 54 64" stroke="#c97" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <line x1="30" y1="60" x2="15" y2="55" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="30" y1="63" x2="13" y2="63" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="70" y1="60" x2="85" y2="55" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="70" y1="63" x2="87" y2="63" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
          <polygon points="36,36 30,20 44,30" fill="#ffe066" />
          <polygon points="64,36 70,20 56,30" fill="#ffe066" />
          <ellipse cx="36" cy="34" rx="5" ry="7" fill="#ffe066" />
          <ellipse cx="64" cy="34" rx="5" ry="7" fill="#ffe066" />
        </svg>
      </div>
      <div
        style={{
          fontSize: 74,
          fontWeight: 900,
          color: "#7a4800",
          letterSpacing: "-2px",
          textAlign: "center",
        }}
      >
        피노 게임
      </div>
      <div
        style={{
          fontSize: 34,
          color: "#9a6200",
          textAlign: "center",
          maxWidth: 860,
          lineHeight: 1.4,
        }}
      >
        고양이 카드 맞추기 + 마작 솔리테어 · 무료
      </div>
      <div
        style={{
          marginTop: 14,
          fontSize: 24,
          color: "#b07800",
          background: "rgba(122,72,0,0.09)",
          padding: "8px 30px",
          borderRadius: 32,
          border: "1px solid rgba(122,72,0,0.2)",
        }}
      >
        pino-games.revely.company
      </div>
    </div>,
    { ...size }
  );
}
