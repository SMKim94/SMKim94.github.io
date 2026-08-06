import type { ReactNode } from "react";

/** 직접 그린 Fluent 풍 SVG 아이콘 모음. MS 저작권 자산은 사용하지 않는다. */

interface P {
  size?: number;
}

// ── 시작 버튼: 중립적인 4분할 글리프 ──────────────────────
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

// ── 컬러 앱/파일 아이콘 ──────────────────────────────────
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

// ── 단색 유틸 아이콘 (currentColor) ──────────────────────
function Mono({
  size = 16,
  children,
  vb = 24,
}: P & { children: ReactNode; vb?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${vb} ${vb}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function SearchIcon(p: P) {
  return (
    <Mono {...p}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 5 5" />
    </Mono>
  );
}

export function WifiIcon(p: P) {
  return (
    <Mono {...p}>
      <path d="M3 9.5a13.5 13.5 0 0 1 18 0" />
      <path d="M6.5 13.2a8.6 8.6 0 0 1 11 0" />
      <path d="M9.8 16.7a4 4 0 0 1 4.4 0" />
      <circle cx="12" cy="19.6" r="1.1" fill="currentColor" stroke="none" />
    </Mono>
  );
}

export function VolumeIcon(p: P) {
  return (
    <Mono {...p}>
      <path d="M4 10v4h4l5 4V6l-5 4Z" />
      <path d="M16.5 9.5a4 4 0 0 1 0 5" />
      <path d="M18.8 7.2a7.4 7.4 0 0 1 0 9.6" />
    </Mono>
  );
}

export function BluetoothIcon(p: P) {
  return (
    <Mono {...p}>
      <path d="M7 7.5 17 16l-5 4.5v-17L17 8 7 16.5" />
    </Mono>
  );
}

export function AirplaneIcon(p: P) {
  return (
    <Mono {...p}>
      <path d="M10.5 21v-3l1.5-1.5L13.5 18v3l-1.5-1Z" fill="currentColor" />
      <path d="M12 3.5 12 14M12 3.5c.8 0 1.5 1.6 1.5 3v2.2l7 4.3v2l-7-2.3v3.4l-3 .0v-3.4L3.5 15v-2l7-4.3V6.5c0-1.4.7-3 1.5-3Z" />
    </Mono>
  );
}

export function MoonIcon(p: P) {
  return (
    <Mono {...p}>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />
    </Mono>
  );
}

export function SunIcon(p: P) {
  return (
    <Mono {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5 5l1.7 1.7M17.3 17.3 19 19M19 5l-1.7 1.7M6.7 17.3 5 19" />
    </Mono>
  );
}

export function NightIcon(p: P) {
  return (
    <Mono {...p}>
      <circle cx="12" cy="14" r="4" />
      <path d="M12 5v2.5M5.5 8.5 7 10M18.5 8.5 17 10M3 18h18" />
    </Mono>
  );
}

export function LeafIcon(p: P) {
  return (
    <Mono {...p}>
      <path d="M6 18C6 9 12 5 20 4c-.5 8-4 14-13 14" />
      <path d="M4 20c2.5-4 5-6.5 9-9" />
    </Mono>
  );
}

export function PowerIcon(p: P) {
  return (
    <Mono {...p}>
      <path d="M12 3v8" />
      <path d="M6.6 6.4a8 8 0 1 0 10.8 0" />
    </Mono>
  );
}

export function UserIcon(p: P) {
  return (
    <Mono {...p}>
      <circle cx="12" cy="8.5" r="4" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </Mono>
  );
}

export function ChevronUpIcon(p: P) {
  return (
    <Mono {...p}>
      <path d="m7 14 5-5 5 5" />
    </Mono>
  );
}

export function ChevronRightIcon(p: P) {
  return (
    <Mono {...p}>
      <path d="m10 7 5 5-5 5" />
    </Mono>
  );
}

export function ChevronDownIcon(p: P) {
  return (
    <Mono {...p}>
      <path d="m7 10 5 5 5-5" />
    </Mono>
  );
}

export function BackIcon(p: P) {
  return (
    <Mono {...p}>
      <path d="M20 12H5M11 5.5 4.5 12 11 18.5" />
    </Mono>
  );
}

export function ForwardIcon(p: P) {
  return (
    <Mono {...p}>
      <path d="M4 12h15M13 5.5 19.5 12 13 18.5" />
    </Mono>
  );
}

export function UpIcon(p: P) {
  return (
    <Mono {...p}>
      <path d="M12 20V5M5.5 11 12 4.5 18.5 11" />
    </Mono>
  );
}

export function RefreshIcon(p: P) {
  return (
    <Mono {...p}>
      <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3L19.5 9" />
      <path d="M19.5 4.5V9H15" />
    </Mono>
  );
}

export function PlusIcon(p: P) {
  return (
    <Mono {...p}>
      <path d="M12 5v14M5 12h14" />
    </Mono>
  );
}

export function TrashIcon(p: P) {
  return (
    <Mono {...p}>
      <path d="M4.5 6.5h15M9.5 3.5h5M7 6.5l.8 13a1.5 1.5 0 0 0 1.5 1.4h5.4a1.5 1.5 0 0 0 1.5-1.4l.8-13" />
      <path d="M10 10.5v6M14 10.5v6" />
    </Mono>
  );
}

export function RestoreArrowIcon(p: P) {
  return (
    <Mono {...p}>
      <path d="M5 13a7 7 0 1 0 2-5L4.5 10.5" />
      <path d="M4.5 5.5v5H9" />
    </Mono>
  );
}

export function CutIcon(p: P) {
  return (
    <Mono {...p}>
      <circle cx="6.5" cy="17.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
      <path d="M8.5 15.5 19 4M15.5 15.5 5 4" />
    </Mono>
  );
}

export function CopyIcon(p: P) {
  return (
    <Mono {...p}>
      <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
      <path d="M5.5 15.5v-9a2 2 0 0 1 2-2h9" />
    </Mono>
  );
}

export function PasteIcon(p: P) {
  return (
    <Mono {...p}>
      <rect x="5.5" y="4.5" width="13" height="16" rx="2" />
      <rect x="9" y="2.8" width="6" height="3.4" rx="1" />
    </Mono>
  );
}

export function RenameIcon(p: P) {
  return (
    <Mono {...p}>
      <path d="m14.5 5.5 4 4L8 20H4v-4Z" />
    </Mono>
  );
}

export function MoreIcon(p: P) {
  return (
    <Mono {...p}>
      <circle cx="5" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </Mono>
  );
}

export function HouseIcon(p: P) {
  return (
    <Mono {...p}>
      <path d="m3.5 11 8.5-7 8.5 7" />
      <path d="M6 9.5V20h12V9.5" />
    </Mono>
  );
}

export function MonitorIcon(p: P) {
  return (
    <Mono {...p}>
      <rect x="3.5" y="5" width="17" height="12" rx="1.8" />
      <path d="M9.5 20.5h5M12 17v3.5" />
    </Mono>
  );
}

export function DocMonoIcon(p: P) {
  return (
    <Mono {...p}>
      <path d="M6.5 3.5h8l4 4V20a.8.8 0 0 1-.8.8H6.5a.8.8 0 0 1-.8-.8V4.3a.8.8 0 0 1 .8-.8Z" />
      <path d="M9 12h6M9 15.5h6" />
    </Mono>
  );
}

export function DownloadIcon(p: P) {
  return (
    <Mono {...p}>
      <path d="M12 4v10M7.5 10.5 12 15l4.5-4.5" />
      <path d="M5 19.5h14" />
    </Mono>
  );
}

export function ImageIcon(p: P) {
  return (
    <Mono {...p}>
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m5.5 17 4.5-4 3.5 3 2.5-2 3 3" />
    </Mono>
  );
}

export function MusicIcon(p: P) {
  return (
    <Mono {...p}>
      <path d="M9.5 17.5V6l9-2v11.5" />
      <circle cx="7" cy="17.5" r="2.5" />
      <circle cx="16" cy="15.5" r="2.5" />
    </Mono>
  );
}

export function VideoIcon(p: P) {
  return (
    <Mono {...p}>
      <rect x="3.5" y="6" width="13" height="12" rx="2" />
      <path d="m16.5 10 4-2.5v9l-4-2.5" />
    </Mono>
  );
}

export function PcIcon(p: P) {
  return (
    <Mono {...p}>
      <rect x="3.5" y="4.5" width="17" height="11" rx="1.5" />
      <path d="M8 19.5h8M10 15.5v4M14 15.5v4" />
    </Mono>
  );
}

export function BinMonoIcon(p: P) {
  return (
    <Mono {...p}>
      <path d="M5 7h14M10 4.5h4M6.8 7l.7 12a1.4 1.4 0 0 0 1.4 1.3h6.2a1.4 1.4 0 0 0 1.4-1.3l.7-12" />
      <path d="m10 11 4 5M14 11l-4 5" />
    </Mono>
  );
}

// ── 창 제어 버튼 글리프 (10px) ───────────────────────────
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
