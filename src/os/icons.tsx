import type { ReactNode } from "react";

/**
 * 아이콘 모음.
 *
 * 단색 UI 아이콘은 Microsoft **Fluent UI System Icons** (MIT) 의 20px Regular
 * 경로를 그대로 옮겨 왔다. Windows에서 추출한 자산이 아니라 Microsoft가
 * 오픈소스로 공개한 것이라 재배포에 제약이 없다. 라이선스 전문과 출처는
 * 저장소 루트의 THIRD-PARTY-NOTICES.md 에 있다.
 *
 * 컬러 앱 아이콘(폴더·메모장·터미널 등)은 직접 그린 것이다. 제품 아이콘은
 * 상표라서 Fluent 세트에 들어 있지 않다.
 */

interface P {
  size?: number;
}

// ── 시작 버튼: 중립적인 4분할 글리프 ──────────────────
export function StartGlyph({ size = 22 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <defs>
        <linearGradient id="stg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#61c8ff" />
          <stop offset="1" stopColor="#0067c0" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="2.5" width="9" height="9" rx="1.6" fill="url(#stg)" />
      <rect x="12.5" y="2.5" width="9" height="9" rx="1.6" fill="url(#stg)" />
      <rect x="2.5" y="12.5" width="9" height="9" rx="1.6" fill="url(#stg)" />
      <rect x="12.5" y="12.5" width="9" height="9" rx="1.6" fill="url(#stg)" />
    </svg>
  );
}

// ── 컬러 앱·파일 아이콘 (직접 그림) ──────────────────
export function FolderIcon({ size = 48 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path
        d="M4 12a4 4 0 0 1 4-4h10l4 4h18a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z"
        fill="#f0b429"
      />
      <path
        d="M4 18h40v14a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z"
        fill="#ffd166"
      />
    </svg>
  );
}

export function ExplorerIcon({ size = 48 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path
        d="M4 12a4 4 0 0 1 4-4h10l4 4h18a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z"
        fill="#f0b429"
      />
      <path d="M4 17h40v10H4Z" fill="#ffd166" />
      <path
        d="M4 26h40v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z"
        fill="#8ecbff"
        opacity="0.95"
      />
    </svg>
  );
}

export function NotepadIcon({ size = 48 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <rect x="9" y="6" width="30" height="38" rx="3" fill="#ffffff" stroke="#8fa0b4" />
      <rect x="9" y="6" width="30" height="7" rx="3" fill="#2f6fde" />
      <rect x="9" y="10" width="30" height="3" fill="#2f6fde" />
      <g stroke="#b9c4d1" strokeWidth="2" strokeLinecap="round">
        <path d="M15 21h18M15 27h18M15 33h12" />
      </g>
    </svg>
  );
}

export function TerminalIcon({ size = 48 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <rect x="4" y="7" width="40" height="34" rx="5" fill="#1d1e23" />
      <rect x="4" y="7" width="40" height="34" rx="5" fill="none" stroke="#4d5361" />
      <path
        d="M13 19l7 6-7 6"
        stroke="#e6e6e6"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M24 32h11" stroke="#e6e6e6" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function RecycleBinIcon({ size = 48 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <rect x="12" y="9" width="24" height="4" rx="2" fill="#9fb2c8" />
      <rect x="20" y="6" width="8" height="4" rx="2" fill="#9fb2c8" />
      <path
        d="M13 15h22l-2 24a3 3 0 0 1-3 2.8H18a3 3 0 0 1-3-2.8Z"
        fill="#dbe7f4"
        stroke="#8fa0b4"
      />
      <g
        stroke="#3f9c5a"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 25l4-5 4 5" />
        <path d="M28.5 31.5 24 36.5l-4.5-5" />
      </g>
    </svg>
  );
}

export function FileTextIcon({ size = 48 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path
        d="M12 5h16l8 8v29a1.5 1.5 0 0 1-1.5 1.5h-22A1.5 1.5 0 0 1 11 42V6.5A1.5 1.5 0 0 1 12.5 5Z"
        fill="#ffffff"
        stroke="#98a6b8"
      />
      <path d="M28 5l8 8h-8Z" fill="#dbe4ee" stroke="#98a6b8" />
      <g stroke="#7f8ea0" strokeWidth="2" strokeLinecap="round">
        <path d="M17 22h14M17 28h14M17 34h9" />
      </g>
    </svg>
  );
}

export function ExeIcon({ size = 48 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <rect x="6" y="8" width="36" height="32" rx="4" fill="#eef3fa" stroke="#8fa0b4" />
      <rect x="6" y="8" width="36" height="9" rx="4" fill="#5a9bd8" />
      <rect x="6" y="13" width="36" height="4" fill="#5a9bd8" />
      <rect x="12" y="23" width="10" height="10" rx="1.5" fill="#5a9bd8" />
      <g stroke="#9fb2c8" strokeWidth="2.4" strokeLinecap="round">
        <path d="M27 25h9M27 31h9" />
      </g>
    </svg>
  );
}

/** 로컬 디스크 — 시스템 드라이브라 왼쪽 위에 창 문양을 얹는다 */
export function DriveIcon({ size = 48 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      {/* 드라이브 본체 */}
      <path
        d="M9 24h34a3 3 0 0 1 3 3v13a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V27a3 3 0 0 1 3-3Z"
        fill="#7d8894"
      />
      {/* 윗면 하이라이트 */}
      <path d="M9 24h34a3 3 0 0 1 3 3v3H6v-3a3 3 0 0 1 3-3Z" fill="#9aa5b1" />
      {/* 상태 표시등과 라벨 */}
      <circle cx="41" cy="36.5" r="2" fill="#c8f7c5" />
      <rect x="11" y="35" width="15" height="3" rx="1.5" fill="#cfd6dd" />
      {/* 시스템 드라이브 표시 */}
      <rect x="4" y="4" width="7" height="7" rx="0.7" fill="#0078d4" />
      <rect x="12.5" y="4" width="7" height="7" rx="0.7" fill="#0078d4" />
      <rect x="4" y="12.5" width="7" height="7" rx="0.7" fill="#0078d4" />
      <rect x="12.5" y="12.5" width="7" height="7" rx="0.7" fill="#0078d4" />
    </svg>
  );
}

// ── 단색 UI 아이콘 — Fluent UI System Icons (MIT) ─
/**
 * Fluent 20px Regular 래퍼.
 *
 * Fluent 아이콘은 선이 아니라 채워진 도형이다. 그래서 stroke가 아니라
 * fill에 currentColor를 건다 — 테마가 바뀌면 색이 따라오는 건 그대로다.
 *
 * 20px을 기준 크기로 고른 이유: Fluent 세트에서 가장 많은 아이콘이 갖춰진
 * 크기이고(2,800여 개), Windows 11 셸이 실제로 쓰는 크기다. viewBox가
 * 20이라 16·24·32 어디로 그려도 비율은 그대로 유지된다.
 */
function Fluent({ size = 16, children }: P & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      {children}
    </svg>
  );
}

// 빠른 설정·트레이
/** Fluent `search` */
export function SearchIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M13.73 14.44a6.5 6.5 0 1 1 .7-.7l3.42 3.4a.5.5 0 0 1-.63.77l-.07-.06zm-.71-.71A5.5 5.5 0 0 0 15 9.5a5.5 5.5 0 1 0-1.98 4.23" />
    </Fluent>
  );
}

/** Fluent `wifi_1` */
export function WifiIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M16.83 7.38q.62.63 1.14 1.37a.5.5 0 0 1-.83.57 8.61 8.61 0 0 0-14.2 0 .5.5 0 0 1-.82-.58 9.61 9.61 0 0 1 14.71-1.36M14.6 9.36q.71.72 1.19 1.65a.5.5 0 0 1-.89.46q-.4-.8-1.01-1.4a5.45 5.45 0 0 0-8.72 1.38.5.5 0 1 1-.89-.45q.45-.9 1.2-1.64a6.45 6.45 0 0 1 9.12 0m-1.71 2.5q.53.53.85 1.25a.5.5 0 0 1-.92.4 3.03 3.03 0 0 0-5.56-.01.5.5 0 1 1-.92-.4q.3-.72.84-1.25a4.03 4.03 0 0 1 5.7 0m-1.93 1.93a1.3 1.3 0 1 1-1.83 1.83 1.3 1.3 0 0 1 1.83-1.83" />
    </Fluent>
  );
}

/** Fluent `speaker_2` */
export function VolumeIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M12 3a1 1 0 0 0-1.68-.73l-3.88 3.6A.5.5 0 0 1 6.1 6H3.5C2.67 6 2 6.67 2 7.5v5c0 .83.67 1.5 1.5 1.5h2.6a.5.5 0 0 1 .34.13l3.88 3.6a1 1 0 0 0 1.68-.74zM7.12 6.6 11 3v14l-3.88-3.6A1.5 1.5 0 0 0 6.1 13H3.5a.5.5 0 0 1-.5-.5v-5c0-.28.22-.5.5-.5h2.6c.38 0 .75-.14 1.02-.4m8.14-1.97a.5.5 0 0 1 .7.04 8 8 0 0 1 0 10.66.5.5 0 0 1-.74-.66 7 7 0 0 0 0-9.34.5.5 0 0 1 .04-.7m-1.18 8.3a.5.5 0 0 1-.18-.68 4.5 4.5 0 0 0 0-4.5.5.5 0 1 1 .86-.5 5.5 5.5 0 0 1 0 5.5.5.5 0 0 1-.68.18" />
    </Fluent>
  );
}

/** Fluent `bluetooth` */
export function BluetoothIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M9.3 2.04a.5.5 0 0 1 .55.1l4 4a.5.5 0 0 1-.02.74L10.26 10l3.57 3.12a.5.5 0 0 1 .02.73l-4 4A.5.5 0 0 1 9 17.5v-6.4l-3.17 2.78a.5.5 0 0 1-.66-.76L8.74 10 5.17 6.88a.5.5 0 0 1 .66-.76L9 8.9V2.5q.01-.32.3-.46m.7 9.06v5.2l2.77-2.78zm0-2.2 2.77-2.42L10 3.7z" />
    </Fluent>
  );
}

/** Fluent `airplane` */
export function AirplaneIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M8.78 8.29 8.1 2.81a1.16 1.16 0 0 1 1-1.3h.08l.17-.01c.6 0 1.13.35 1.37.9l2.51 5.74 2.75-.09c1.03-.03 1.9.73 2 1.74l.02.15V10c0 1.08-.87 1.95-1.96 1.95l-2.8-.1-2.52 5.75c-.24.55-.78.9-1.37.9h-.1a1.16 1.16 0 0 1-1.15-1.3l.68-5.5-2.14-.06-.96 1.67c-.24.43-.7.69-1.18.69a1 1 0 0 1-1-1v-1.47h-.16a1.53 1.53 0 0 1 0-3.05l.16-.01V7a1 1 0 0 1 1-1c.49 0 .94.26 1.18.69l.96 1.67zm.57-5.79h-.12a.16.16 0 0 0-.14.18l.82 6.57-3.84.13-1.26-2.2A.4.4 0 0 0 4.5 7v2.43l-.98.04a.53.53 0 0 0 0 1.06l.98.04V13h.08q.15-.05.23-.18l1.26-2.2 3.84.13-.82 6.59q.01.15.16.16h.1a.5.5 0 0 0 .45-.3l2.79-6.36 3.46.11c.52 0 .95-.42.95-.95v-.03a.95.95 0 0 0-.98-.92l-3.43.11L9.8 2.8a.5.5 0 0 0-.45-.3" />
    </Fluent>
  );
}

/** Fluent `weather_moon` */
export function MoonIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M15.5 13.5A6.98 6.98 0 0 1 4 14.39c2.83-1.09 4.56-2.42 5.6-4.4 1.04-2 1.33-4.16.75-6.9q1.36.17 2.58.87a7 7 0 0 1 2.55 9.54M5.45 16.92A7.98 7.98 0 1 0 9.88 2.04a.6.6 0 0 0-.61.73c.69 2.82.43 4.88-.55 6.76-.94 1.78-2.55 3.03-5.55 4.1a.6.6 0 0 0-.3.9 8 8 0 0 0 2.59 2.39" />
    </Fluent>
  );
}

/** Fluent `weather_sunny` */
export function SunIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M10 2c.28 0 .5.22.5.5v1a.5.5 0 0 1-1 0v-1c0-.28.22-.5.5-.5m0 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8m0-1a3 3 0 1 1 0-6 3 3 0 0 1 0 6m7.5-2.5a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1zM10 16c.28 0 .5.22.5.5v1a.5.5 0 0 1-1 0v-1c0-.28.22-.5.5-.5m-6.5-5.5a.5.5 0 0 0 0-1H2.46a.5.5 0 0 0 0 1zm.65-6.35c.2-.2.5-.2.7 0l1 1a.5.5 0 1 1-.7.7l-1-1a.5.5 0 0 1 0-.7m.7 11.7a.5.5 0 0 1-.7-.7l1-1a.5.5 0 0 1 .7.7zm11-11.7a.5.5 0 0 0-.7 0l-1 1a.5.5 0 0 0 .7.7l1-1a.5.5 0 0 0 0-.7m-.7 11.7a.5.5 0 0 0 .7-.7l-1-1a.5.5 0 0 0-.7.7z" />
    </Fluent>
  );
}

/** 야간 모드 — 해가 낮게 걸린 모양 — Fluent `weather_sunny_low` */
export function NightIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M5.55 10.02q0 .5.11.98H2.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.1a4.5 4.5 0 0 0-4.36-5.47c-2.48 0-4.49 2.01-4.49 4.49m7.83.98H6.7a3.48 3.48 0 1 1 6.68 0m-3.35 7.01.1-.01h-.21zM5 4.32l.07.06.85.86A.5.5 0 0 1 5.3 6l-.07-.05-.86-.86A.5.5 0 0 1 5 4.32m10.67.06c.17.18.2.44.06.64l-.06.07-.86.86a.5.5 0 0 1-.76-.64l.06-.07.85-.86c.2-.2.52-.2.71 0m-5.65-2.36a.5.5 0 0 1 .49.41v1.3a.5.5 0 0 1-.98.1l-.01-.1v-1.2c0-.28.22-.5.5-.5M8.5 16a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM5 14c0-.28.22-.5.5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 5 14" />
    </Fluent>
  );
}

/** 절전 모드 — Fluent `leaf_one` */
export function LeafIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="m11.07 2.46 3.24 3.3A6.03 6.03 0 0 1 10.5 16v1.5a.5.5 0 1 1-1 0V16A6.03 6.03 0 0 1 5.69 5.76l3.24-3.3a1.5 1.5 0 0 1 2.14 0m-.57 12.53a5.03 5.03 0 0 0 3.1-8.52l-3.24-3.31a.5.5 0 0 0-.72 0L6.4 6.46A5.03 5.03 0 0 0 9.5 15v-5.5a.5.5 0 1 1 1 0z" />
    </Fluent>
  );
}

/** Fluent `power` */
export function PowerIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M10.5 2.5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0zM13.74 4a.5.5 0 1 0-.5.87 6.5 6.5 0 1 1-6.49 0 .5.5 0 1 0-.5-.87 7.5 7.5 0 1 0 7.5 0" />
    </Fluent>
  );
}

/** Fluent `person` */
export function UserIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M10 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8M7 6a3 3 0 1 1 6 0 3 3 0 0 1-6 0m-2 5a2 2 0 0 0-2 2c0 1.7.83 2.97 2.13 3.8A9 9 0 0 0 10 18c1.85 0 3.58-.39 4.87-1.2A4.4 4.4 0 0 0 17 13a2 2 0 0 0-2-2zm-1 2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1c0 1.3-.62 2.28-1.67 2.95A8 8 0 0 1 10 17a8 8 0 0 1-4.33-1.05A3.4 3.4 0 0 1 4 13" />
    </Fluent>
  );
}

// 컨텍스트 메뉴
/** 열기 — Fluent `folder_open` */
export function OpenIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M3 5.5v6.6l1.5-2.6A3 3 0 0 1 7.1 8H15v-.5c0-.83-.67-1.5-1.5-1.5h-4a.5.5 0 0 1-.35-.15l-1.71-1.7A.5.5 0 0 0 7.09 4H4.5C3.67 4 3 4.67 3 5.5m1.28 10.48.22.02h9.4a2 2 0 0 0 1.73-1l2.17-3.75A1.5 1.5 0 0 0 16.5 9H7.1a2 2 0 0 0-1.73 1L3.2 13.75a1.5 1.5 0 0 0 1.08 2.23M2 14.46V5.5A2.5 2.5 0 0 1 4.5 3h2.59c.4 0 .78.16 1.06.44L9.7 5h3.79A2.5 2.5 0 0 1 16 7.5V8h.5a2.5 2.5 0 0 1 2.16 3.75L16.5 15.5a3 3 0 0 1-2.6 1.5H4.5a2.5 2.5 0 0 1-1.62-.6A2.5 2.5 0 0 1 2 14.46" />
    </Fluent>
  );
}

/** 고정 — Fluent `pin` */
export function PinIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M10.12 3.14a2 2 0 0 1 3.2-.52l4.06 4.05a2 2 0 0 1-.52 3.2l-3.46 1.74a1.5 1.5 0 0 0-.72.78L11.25 16a1 1 0 0 1-1.64.33L7 13.7 3.7 17H3v-.7L6.3 13l-2.62-2.61a1 1 0 0 1 .34-1.64L7.6 7.32q.52-.23.78-.72zm2.5.18a1 1 0 0 0-1.6.26L9.29 7.04a2.5 2.5 0 0 1-1.31 1.2L4.39 9.69l5.93 5.93 1.43-3.59a2.5 2.5 0 0 1 1.2-1.3l3.47-1.74a1 1 0 0 0 .25-1.6z" />
    </Fluent>
  );
}

/** 압축 — Fluent `folder_zip` */
export function ZipIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M6.98 3c.47 0 .91.18 1.24.51L9.71 5h5.79A2.5 2.5 0 0 1 18 7.5v7a2.5 2.5 0 0 1-2.5 2.5H15v.54c0 .25-.2.46-.46.46h-3.08l-.1-.01a.46.46 0 0 1-.36-.45V17H4.5A2.5 2.5 0 0 1 2 14.5v-9A2.5 2.5 0 0 1 4.5 3zM13 13a1 1 0 0 0-1 1v3h2v-3a1 1 0 0 0-1-1M8.15 7.56A1.5 1.5 0 0 1 7.09 8H3v6.5c0 .83.67 1.5 1.5 1.5H11v-2a2 2 0 1 1 4 0v2h.5c.83 0 1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5H9.7zM13 12h-1.5a.5.5 0 0 1 0-1H13zm1.5-2a.5.5 0 0 1 0 1H13v-1zM13 10h-1.5a.5.5 0 0 1 0-1H13zm1.5-2a.5.5 0 0 1 0 1H13V8zM13 8h-1.5a.5.5 0 0 1 0-1H13zM4.5 4C3.67 4 3 4.67 3 5.5V7h4.09a.5.5 0 0 0 .35-.15L8.79 5.5 7.51 4.22A.8.8 0 0 0 6.98 4z" />
    </Fluent>
  );
}

/** 경로로 복사 — Fluent `clipboard_link` */
export function CopyPathIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M7.09 3c.2-.58.76-1 1.41-1h3c.65 0 1.2.42 1.41 1h1.59c.83 0 1.5.67 1.5 1.5V11h-1V4.5a.5.5 0 0 0-.5-.5h-1.59c-.2.58-.76 1-1.41 1h-3a1.5 1.5 0 0 1-1.41-1H5.5a.5.5 0 0 0-.5.5v12c0 .28.22.5.5.5h2.76q.19.54.5 1H5.5A1.5 1.5 0 0 1 4 16.5v-12C4 3.67 4.67 3 5.5 3zM8.5 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM19 15.5a3.5 3.5 0 0 0-3.5-3.5h-.09a.5.5 0 0 0 .09 1h.16a2.5 2.5 0 0 1-.16 5l-.1.01a.5.5 0 0 0 .1 1V19h.2a3.5 3.5 0 0 0 3.3-3.5m-6-3a.5.5 0 0 0-.5-.5h-.2a3.5 3.5 0 0 0 .2 7h.09a.5.5 0 0 0-.09-1h-.16a2.5 2.5 0 0 1 .16-5h.09a.5.5 0 0 0 .41-.5m2.5 2.5h-3.09a.5.5 0 0 0 .09 1h3.09a.5.5 0 0 0-.09-1" />
    </Fluent>
  );
}

/** 속성 — Fluent `wrench` */
export function WrenchIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M9 6.5a4.5 4.5 0 0 1 6.35-4.1.5.5 0 0 1 .15.8l-2.3 2.3 1.3 1.3 2.3-2.3a.5.5 0 0 1 .8.15A4.5 4.5 0 0 1 13.5 11a5 5 0 0 1-1.1-.14l-6.37 6.45a2.36 2.36 0 0 1-3.37-3.3l6.42-6.65A5 5 0 0 1 9 6.5M13.5 3a3.5 3.5 0 0 0-3.39 4.39.5.5 0 0 1-.12.47L3.38 14.7a1.36 1.36 0 0 0 1.94 1.9l6.57-6.66a.5.5 0 0 1 .51-.12 3.5 3.5 0 0 0 4.53-4.05l-2.08 2.07a.5.5 0 0 1-.7 0l-2-2a.5.5 0 0 1 0-.7l2.07-2.08A4 4 0 0 0 13.5 3" />
    </Fluent>
  );
}

/** 추가 옵션 표시 — Fluent `window_bullet_list` */
export function MoreOptionsIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M5.58 9.11a1 1 0 0 0-.08.39q0 .2.08.4.07.18.2.31.15.13.33.21t.39.08q.2 0 .4-.08.17-.08.31-.22a1 1 0 0 0 0-1.41q-.14-.13-.33-.21a1 1 0 0 0-.38-.08 1 1 0 0 0-.4.08q-.17.08-.31.22t-.21.31m0 4a1 1 0 0 0-.08.39q0 .2.08.4.07.18.2.31.15.13.33.21t.39.08q.2 0 .4-.08.17-.08.31-.22a1 1 0 0 0 .29-.7 1 1 0 0 0-.3-.71q-.14-.13-.32-.21a1 1 0 0 0-.38-.08 1 1 0 0 0-.4.08 1.01 1.01 0 0 0-.53.53M9.55 10a.6.6 0 0 1-.39-.15.46.46 0 0 1 0-.7Q9.33 9 9.55 9h4.4a.6.6 0 0 1 .5.31.5.5 0 0 1-.11.54q-.16.15-.4.15zm-.39 3.85q.17.15.39.15h4.4a.6.6 0 0 0 .5-.3.5.5 0 0 0-.11-.55.6.6 0 0 0-.4-.15h-4.4a.6.6 0 0 0-.5.3.5.5 0 0 0 .12.55M3 6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zm3-2a2 2 0 0 0-2 2h12a2 2 0 0 0-2-2zm10 3H4v7c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2z" />
    </Fluent>
  );
}

// 작업표시줄·시스템 트레이
/** 작업 보기 — Fluent `window_multiple` */
export function TaskViewIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v8A2.5 2.5 0 0 0 4.5 15h8a2.5 2.5 0 0 0 2.5-2.5v-8A2.5 2.5 0 0 0 12.5 2zM3 12.5V6h11v6.5c0 .83-.67 1.5-1.5 1.5h-8A1.5 1.5 0 0 1 3 12.5M3 5v-.5C3 3.67 3.67 3 4.5 3h8c.83 0 1.5.67 1.5 1.5V5zm4.5 13a2.5 2.5 0 0 1-2.45-2h1.04c.2.58.76 1 1.41 1H14a3 3 0 0 0 3-3V7.5c0-.65-.42-1.2-1-1.41V5.05a2.5 2.5 0 0 1 2 2.45V14a4 4 0 0 1-4 4z" />
    </Fluent>
  );
}

/** 입력기 — Fluent `keyboard` */
export function KeyboardIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M5 12.5c0-.28.22-.5.5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M11.5 8a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m3.75-.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M5.5 8a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m2.25 1.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m2.25.75A.75.75 0 1 0 10 9a.75.75 0 0 0 0 1.5m3.76-.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M8.5 8a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M2 5.5C2 4.67 2.67 4 3.5 4h13c.83 0 1.5.67 1.5 1.5v8c0 .83-.67 1.5-1.5 1.5h-13A1.5 1.5 0 0 1 2 13.5zM3.5 5a.5.5 0 0 0-.5.5v8c0 .28.22.5.5.5h13a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5z" />
    </Fluent>
  );
}

/** 유선 네트워크 연결 — Fluent `desktop_signal` */
export function EthernetIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M12 1q-.27 0-.54.02a.5.5 0 1 0 .08 1L12 2a6 6 0 0 1 5.98 6.46.5.5 0 1 0 1 .08L19 8a7 7 0 0 0-7-7m0 2q-.28 0-.55.03a.5.5 0 0 0 .1 1L12 4a4 4 0 0 1 3.98 4.45.5.5 0 1 0 .99.1Q17 8.28 17 8a5 5 0 0 0-5-5m0 2q-.3 0-.6.06a.5.5 0 0 0 .2.98A2 2 0 0 1 14 8q0 .2-.04.4a.5.5 0 0 0 .98.2A3 3 0 0 0 12 5m-1.92-3H4a2 2 0 0 0-2 2v9c0 1.1.9 2 2 2h3v2H5.5a.5.5 0 1 0 0 1h9a.5.5 0 0 0 0-1H13v-2h3a2 2 0 0 0 2-2V9.92a2 2 0 0 1-.52-.3q-.21.19-.48.28V13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6.1q.1-.27.29-.48a2 2 0 0 1-.31-.52M12 15v2H8v-2zm1-7a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
    </Fluent>
  );
}

/** 알림 — Fluent `alert` */
export function BellIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M10 2a5.9 5.9 0 0 1 5.98 5.36l.02.22v3.82l.92 2.22.06.17.01.08.01.13a1 1 0 0 1-.75.97l-.11.02L16 15h-3.5v.17a2.5 2.5 0 0 1-5 0V15H4l-.26-.03-.13-.04a1 1 0 0 1-.6-1.05l.02-.13.05-.13L4 11.4V7.57A5.9 5.9 0 0 1 10 2m1.5 13h-3v.15a1.5 1.5 0 0 0 1.36 1.34l.14.01c.78 0 1.42-.6 1.5-1.36zM10 3a4.9 4.9 0 0 0-4.98 4.38L5 7.6v3.9l-.04.2L4 14h12l-.96-2.3-.04-.2V7.61A4.9 4.9 0 0 0 10 3" />
    </Fluent>
  );
}

// 방향·탐색
/** Fluent `chevron_up` */
export function ChevronUpIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M4.15 12.35a.5.5 0 0 1 0-.7L9.6 6.16a.55.55 0 0 1 .78 0l5.47 5.49a.5.5 0 0 1-.71.7L10 7.2l-5.15 5.16a.5.5 0 0 1-.7 0" />
    </Fluent>
  );
}

/** Fluent `chevron_right` */
export function ChevronRightIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M7.65 4.15c.2-.2.5-.2.7 0l5.49 5.46c.21.22.21.57 0 .78l-5.49 5.47a.5.5 0 0 1-.7-.71L12.8 10 7.65 4.85a.5.5 0 0 1 0-.7" />
    </Fluent>
  );
}

/** Fluent `chevron_down` */
export function ChevronDownIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M15.85 7.65c.2.2.2.5 0 .7l-5.46 5.49a.55.55 0 0 1-.78 0L4.15 8.35a.5.5 0 1 1 .7-.7L10 12.8l5.15-5.16c.2-.2.5-.2.7 0" />
    </Fluent>
  );
}

/** Fluent `arrow_left` */
export function BackIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M9.16 16.87a.5.5 0 1 0 .67-.74L3.67 10.5H17.5a.5.5 0 0 0 0-1H3.67l6.16-5.63a.5.5 0 0 0-.67-.74L2.24 9.44a.75.75 0 0 0 0 1.11z" />
    </Fluent>
  );
}

/** Fluent `arrow_right` */
export function ForwardIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M10.84 3.13a.5.5 0 0 0-.68.74l6.17 5.63H2.5a.5.5 0 0 0 0 1h13.83l-6.17 5.63a.5.5 0 0 0 .68.74l6.91-6.32a.75.75 0 0 0 0-1.1z" />
    </Fluent>
  );
}

/** Fluent `arrow_up` */
export function UpIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M3.13 9.16a.5.5 0 1 0 .74.68L9.5 3.67V17.5a.5.5 0 1 0 1 0V3.67l5.63 6.17a.5.5 0 0 0 .74-.68l-6.32-6.92a.75.75 0 0 0-1.1 0z" />
    </Fluent>
  );
}

/** Fluent `arrow_clockwise` */
export function RefreshIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M4 10a6 6 0 0 1 10.47-4H12.5a.5.5 0 0 0 0 1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-1 0v1.6a7 7 0 1 0 1.98 4.36.5.5 0 1 0-1 .08L16 10a6 6 0 0 1-12 0" />
    </Fluent>
  );
}

// 편집·명령
/** Fluent `add` */
export function PlusIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M10 2.5c.28 0 .5.22.5.5v6.5H17a.5.5 0 0 1 0 1h-6.5V17a.5.5 0 0 1-1 0v-6.5H3a.5.5 0 0 1 0-1h6.5V3c0-.28.22-.5.5-.5" />
    </Fluent>
  );
}

/** Fluent `delete` */
export function TrashIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M8.5 4h3a1.5 1.5 0 0 0-3 0m-1 0a2.5 2.5 0 0 1 5 0h5a.5.5 0 0 1 0 1h-1.05l-1.2 10.34A3 3 0 0 1 12.27 18H7.73a3 3 0 0 1-2.98-2.66L3.55 5H2.5a.5.5 0 0 1 0-1zM5.74 15.23A2 2 0 0 0 7.73 17h4.54a2 2 0 0 0 1.99-1.77L15.44 5H4.56zM8.5 7.5c.28 0 .5.22.5.5v6a.5.5 0 0 1-1 0V8c0-.28.22-.5.5-.5M12 8a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
    </Fluent>
  );
}

/** 복원 — Fluent `arrow_counterclockwise` */
export function RestoreArrowIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M16 10A6 6 0 0 0 5.53 6H7.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 1 0v1.6a7 7 0 1 1-1.98 4.36.5.5 0 0 1 1 .08L4 10a6 6 0 0 0 12 0" />
    </Fluent>
  );
}

/** Fluent `cut` */
export function CutIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M5.92 2.23a.5.5 0 0 0-.84.54L9.4 9.43l-1.92 2.96a3 3 0 1 0 .78.64L10 10.35l1.74 2.68a3 3 0 1 0 .78-.64zM14 17a2 2 0 1 1 0-4 2 2 0 0 1 0 4M4 15a2 2 0 1 1 4 0 2 2 0 0 1-4 0m7.2-6.49-.6-.92 3.48-5.36a.5.5 0 0 1 .84.54z" />
    </Fluent>
  );
}

/** Fluent `copy` */
export function CopyIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M7 7H5.5C4.67 7 4 7.67 4 8.5v6c0 .83.67 1.5 1.5 1.5h4c.65 0 1.2-.42 1.41-1h1.04a2.5 2.5 0 0 1-2.45 2h-4A2.5 2.5 0 0 1 3 14.5v-6A2.5 2.5 0 0 1 5.5 6H7zm7.5-4A2.5 2.5 0 0 1 17 5.5v6a2.5 2.5 0 0 1-2.5 2.5h-4A2.5 2.5 0 0 1 8 11.5v-6A2.5 2.5 0 0 1 10.5 3zm-4 1C9.67 4 9 4.67 9 5.5v6c0 .83.67 1.5 1.5 1.5h4c.83 0 1.5-.67 1.5-1.5v-6c0-.83-.67-1.5-1.5-1.5z" />
    </Fluent>
  );
}

/** Fluent `clipboard_paste` */
export function PasteIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M4.5 4h1.59c.2.58.76 1 1.41 1h3c.65 0 1.2-.42 1.41-1h1.59c.28 0 .5.22.5.5v1a.5.5 0 0 0 1 0v-1c0-.83-.67-1.5-1.5-1.5h-1.59c-.2-.58-.76-1-1.41-1h-3c-.65 0-1.2.42-1.41 1H4.5C3.67 3 3 3.67 3 4.5v12c0 .83.67 1.5 1.5 1.5h3a.5.5 0 0 0 0-1h-3a.5.5 0 0 1-.5-.5v-12c0-.28.22-.5.5-.5m3 0a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1zm3 3C9.67 7 9 7.67 9 8.5v8c0 .83.67 1.5 1.5 1.5h5c.83 0 1.5-.67 1.5-1.5v-8c0-.83-.67-1.5-1.5-1.5zM10 8.5c0-.28.22-.5.5-.5h5c.28 0 .5.22.5.5v8a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5z" />
    </Fluent>
  );
}

/** 이름 바꾸기 — Fluent `edit`. Fluent의 `rename`은 문자열 편집 상자를
 * 뜻하는 글리프라 16px에서 무엇인지 읽히지 않는다. 연필이 Windows 11
 * 탐색기 명령 모음의 이름 바꾸기 단추와도 가깝다. */
export function RenameIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M17.18 2.93a2.97 2.97 0 0 0-4.26-.06l-9.37 9.38q-.5.5-.66 1.2l-.88 3.94a.5.5 0 0 0 .6.6l3.93-.87c.46-.1.9-.34 1.23-.68l9.36-9.36a2.97 2.97 0 0 0 .05-4.15m-3.55.65a1.97 1.97 0 1 1 2.8 2.8l-.68.66-2.8-2.79zm-1.38 1.38 2.8 2.8-7.99 7.97q-.31.31-.74.41l-3.16.7.7-3.18q.1-.41.4-.7z" />
    </Fluent>
  );
}

/** Fluent `more_horizontal` */
export function MoreIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M6.25 10a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0m5 0a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0M15 11.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5" />
    </Fluent>
  );
}

// 탐색기 사이드바·파일 종류
/** Fluent `home` */
export function HouseIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M9 2.39a1.5 1.5 0 0 1 2 0l5.5 4.94c.32.28.5.69.5 1.12v7.05c0 .83-.67 1.5-1.5 1.5H13a1.5 1.5 0 0 1-1.5-1.5V12a.5.5 0 0 0-.5-.5H9a.5.5 0 0 0-.5.5v3.5c0 .83-.67 1.5-1.5 1.5H4.5A1.5 1.5 0 0 1 3 15.5V8.45c0-.43.18-.84.5-1.12zm1.33.74a.5.5 0 0 0-.66 0l-5.5 4.94a.5.5 0 0 0-.17.38v7.05c0 .28.22.5.5.5H7a.5.5 0 0 0 .5-.5V12c0-.83.67-1.5 1.5-1.5h2c.83 0 1.5.67 1.5 1.5v3.5c0 .28.22.5.5.5h2.5a.5.5 0 0 0 .5-.5V8.45a.5.5 0 0 0-.17-.38z" />
    </Fluent>
  );
}

/** 바탕 화면 — Fluent `desktop` */
export function MonitorIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M4 2a2 2 0 0 0-2 2v9c0 1.1.9 2 2 2h3v2H5.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1H13v-2h3a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm8 13v2H8v-2zM3 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
    </Fluent>
  );
}

/** Fluent `document` */
export function DocMonoIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M6 2a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V7.41c0-.4-.16-.78-.44-1.06l-3.91-3.91A1.5 1.5 0 0 0 10.59 2zM5 4a1 1 0 0 1 1-1h4v3.5c0 .83.67 1.5 1.5 1.5H15v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zm9.8 3h-3.3a.5.5 0 0 1-.5-.5V3.2z" />
    </Fluent>
  );
}

/** Fluent `arrow_download` */
export function DownloadIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M15.5 17a.5.5 0 0 1 .09 1H4.5a.5.5 0 0 1-.09-1H15.5M10 2a.5.5 0 0 1 .5.41V14.3l3.64-3.65a.5.5 0 0 1 .64-.06l.07.06c.17.17.2.44.06.63l-.06.07-4.5 4.5a.5.5 0 0 1-.25.14L10 16a.5.5 0 0 1-.4-.2l-4.46-4.45a.5.5 0 0 1 .64-.76l.07.06 3.65 3.64V2.5c0-.27.22-.5.5-.5" />
    </Fluent>
  );
}

/** Fluent `image` */
export function ImageIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M14 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0M3 6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zm3-2a2 2 0 0 0-2 2v8q0 .56.28 1.02l4.67-4.59a1.5 1.5 0 0 1 2.1 0l4.67 4.59Q16 14.56 16 14V6a2 2 0 0 0-2-2zm0 12h8a2 2 0 0 0 1.01-.27l-4.66-4.58a.5.5 0 0 0-.7 0l-4.66 4.58A2 2 0 0 0 6 16" />
    </Fluent>
  );
}

/** Fluent `music_note_2` */
export function MusicIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M14.7 2.23a1 1 0 0 1 1.3.95V13.5a2.5 2.5 0 1 1-1-2V6.18L8 8.37v7.13a2.5 2.5 0 1 1-1-2V5.37a1 1 0 0 1 .7-.96zM8 7.32l7-2.19V3.18L8 5.37zM5.5 14a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m6.5-.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0" />
    </Fluent>
  );
}

/** Fluent `video` */
export function VideoIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M5 4a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h5a3 3 0 0 0 3-3v-.32l3.04 2.1c.83.57 1.96-.03 1.96-1.03v-7.5c0-1-1.13-1.6-1.96-1.03L13 7.32V7a3 3 0 0 0-3-3zm8 4.54 3.6-2.5c.17-.1.4.01.4.21v7.5c0 .2-.23.32-.4.2L13 11.46zM3 7c0-1.1.9-2 2-2h5a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </Fluent>
  );
}

/** 내 PC — Fluent `desktop_tower` */
export function PcIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M4 2a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h2.09a1.5 1.5 0 0 1 0-1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1h1a2 2 0 0 0-2-2zm1 5c0-1.1.9-2 2-2h9a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2v2h1.5a.5.5 0 0 1 0 1h-8a.5.5 0 0 1 0-1H9v-2H7a2 2 0 0 1-2-2zm5 10h3v-2h-3zm6-3a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1z" />
    </Fluent>
  );
}

/** 휴지통 — Fluent `bin_recycle` */
export function BinMonoIcon(p: P) {
  return (
    <Fluent {...p}>
      <path d="M11.3 7.75c-.58-1-2.02-1-2.6 0l-.45.78a.5.5 0 1 0 .87.5l.45-.78a.5.5 0 0 1 .86 0l.45.78a.5.5 0 0 0 .87-.5zm.86 3.5-.1-.19a.5.5 0 0 1 .86-.5l.11.19a1.5 1.5 0 0 1-1.3 2.25H11a.5.5 0 0 1 0-1h.73a.5.5 0 0 0 .43-.75M9 12a.5.5 0 0 1 0 1h-.73a1.5 1.5 0 0 1-1.3-2.25l.1-.19a.5.5 0 0 1 .87.5l-.1.19a.5.5 0 0 0 .43.75zm6.91-9.41A2 2 0 0 1 16.5 4v.56l-1.33 11.67a2 2 0 0 1-2 1.77H6.85a2 2 0 0 1-2-1.77L3.5 4.56V4a2 2 0 0 1 2-2h9a2 2 0 0 1 1.41.59M14.5 3h-9a1 1 0 0 0-1 1h11a1 1 0 0 0-1-1m-.67 13.75a1 1 0 0 0 .33-.64L15.44 5H4.56l1.28 11.11a1 1 0 0 0 1 .89h6.32a1 1 0 0 0 .67-.25" />
    </Fluent>
  );
}

// ── 창 제어 버튼 글리프 (10px) ────────────────────
/*
 * 여기만 직접 그린 채로 둔다. Windows 11의 제목 표시줄 단추는 Fluent UI
 * System Icons가 아니라 Segoe Fluent Icons **폰트**의 Chrome* 글리프이고,
 * 10px 상자를 꽉 채우는 1px 선이다. Fluent의 subtract/square/dismiss를
 * 10px로 줄여 나란히 놓고 비교해 보니 안쪽 여백 때문에 눈에 띄게 작고
 * 흐려져서, 바꾸면 오히려 실물에서 멀어진다.
 */

export function MinGlyph() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
      <path d="M0 5h10" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function MaxGlyph() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
      <rect
        x="0.5"
        y="0.5"
        width="9"
        height="9"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

export function RestoreGlyph() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
      <rect
        x="0.5"
        y="2.5"
        width="7"
        height="7"
        rx="1.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M3 2.5V2a1.5 1.5 0 0 1 1.5-1.5H8A1.5 1.5 0 0 1 9.5 2v3.5A1.5 1.5 0 0 1 8 7h-.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

export function CloseGlyph() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
      <path d="M0.5 0.5 9.5 9.5M9.5 0.5 0.5 9.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
