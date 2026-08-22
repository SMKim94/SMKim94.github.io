import { useEffect, useState } from "react";
import { APPS, PINNED, type AppId } from "./apps";
import { useWindows } from "./WindowManager";
import { ICON } from "./iconSizes";
import {
  BellIcon,
  EthernetIcon,
  ChevronUpIcon,
  KeyboardIcon,
  SearchIcon,
  StartGlyph,
  TaskViewIcon,
  VolumeIcon,
} from "./icons";

export type Flyout = null | "start" | "quick" | "taskview";

function useClock(): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

/** "오전 3:05:35" — Win11 한국어 시계는 초까지 보여준다 */
function formatTime(d: Date): string {
  const h = d.getHours();
  const ampm = h < 12 ? "오전" : "오후";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${ampm} ${h12}:${mm}:${ss}`;
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export function Taskbar({
  flyout,
  setFlyout,
}: {
  flyout: Flyout;
  setFlyout: (f: Flyout) => void;
}) {
  const wm = useWindows();
  const now = useClock();

  function toggle(f: Exclude<Flyout, null>) {
    setFlyout(flyout === f ? null : f);
  }

  function onAppClick(app: AppId) {
    setFlyout(null);
    const wins = wm.windows.filter((w) => w.app === app);
    if (wins.length === 0) {
      wm.open(app);
      return;
    }
    const top = wins.reduce((a, b) => (a.z > b.z ? a : b));
    const focusedHere =
      wm.focusedId !== null && wins.some((w) => w.id === wm.focusedId);
    if (focusedHere) {
      for (const w of wins) wm.minimize(w.id);
    } else {
      wm.focus(top.id);
    }
  }

  return (
    <footer className="taskbar">
      <div className="tb-center">
        <button
          className={`tb-btn tb-start ${flyout === "start" ? "open" : ""}`}
          aria-label="시작"
          onClick={() => toggle("start")}
        >
          <StartGlyph size={ICON.medium} />
        </button>

        {/* Win11의 검색 알약. 누르면 검색창이 있는 시작 메뉴가 열린다. */}
        <button
          className={`tb-search ${flyout === "start" ? "open" : ""}`}
          aria-label="검색"
          onClick={() => toggle("start")}
        >
          <SearchIcon size={ICON.small} />
          <span>검색</span>
        </button>

        <button
          className={`tb-btn ${flyout === "taskview" ? "open" : ""}`}
          aria-label="작업 보기"
          title="작업 보기"
          onClick={() => toggle("taskview")}
        >
          <TaskViewIcon size={ICON.medium} />
        </button>

        {PINNED.map((id) => {
          const def = APPS[id];
          const wins = wm.windows.filter((w) => w.app === id);
          const running = wins.length > 0;
          const active =
            wm.focusedId !== null && wins.some((w) => w.id === wm.focusedId);
          return (
            <button
              key={id}
              className={`tb-btn ${running ? "running" : ""} ${active ? "active" : ""}`}
              title={def.name}
              aria-label={def.name}
              onClick={() => onAppClick(id)}
            >
              <def.Icon size={ICON.medium} />
            </button>
          );
        })}
      </div>

      <div className="tb-right">
        <button
          className="tb-tray-btn tb-chevron"
          aria-label="숨겨진 아이콘 표시"
        >
          <ChevronUpIcon size={13} />
        </button>

        {/* 입력기 표시 — 상태 표시라 누르는 곳이 아니다 */}
        <div className="tb-ime" aria-label="입력기: 영문">
          <KeyboardIcon size={16} />
          <span className="tb-ime-mode">A</span>
        </div>

        <button
          className={`tb-tray-btn tb-status ${flyout === "quick" ? "open" : ""}`}
          aria-label="네트워크 및 소리 설정"
          onClick={() => toggle("quick")}
        >
          <EthernetIcon size={15} />
          <VolumeIcon size={15} />
        </button>

        <button className="tb-tray-btn tb-clock" aria-label="날짜 및 시간">
          <span>{formatTime(now)}</span>
          <span>{formatDate(now)}</span>
        </button>

        <button className="tb-tray-btn tb-bell" aria-label="알림">
          <BellIcon size={16} />
        </button>

        <button
          className="tb-show-desktop"
          aria-label="바탕 화면 보기"
          title="바탕 화면 보기"
          onClick={() => {
            setFlyout(null);
            wm.minimizeAll();
          }}
        />
      </div>
    </footer>
  );
}
