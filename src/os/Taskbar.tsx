import { useEffect, useState } from "react";
import { APPS, PINNED, type AppId } from "./apps";
import { useWindows } from "./WindowManager";
import { ChevronUpIcon, StartGlyph, VolumeIcon, WifiIcon } from "./icons";

export type Flyout = null | "start" | "quick";

function useClock(): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function formatTime(d: Date): string {
  const h = d.getHours();
  const ampm = h < 12 ? "오전" : "오후";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${ampm} ${h12}:${String(d.getMinutes()).padStart(2, "0")}`;
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
          onClick={() => setFlyout(flyout === "start" ? null : "start")}
        >
          <StartGlyph size={24} />
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
              <def.Icon size={26} />
            </button>
          );
        })}
      </div>
      <div className="tb-right">
        <button className="tb-tray-btn tb-chevron" aria-label="숨겨진 아이콘 표시">
          <ChevronUpIcon size={14} />
        </button>
        <button
          className={`tb-tray-btn tb-status ${flyout === "quick" ? "open" : ""}`}
          aria-label="네트워크 및 소리 설정"
          onClick={() => setFlyout(flyout === "quick" ? null : "quick")}
        >
          <WifiIcon size={15} />
          <VolumeIcon size={15} />
        </button>
        <button className="tb-tray-btn tb-clock" aria-label="날짜 및 시간">
          <span>{formatTime(now)}</span>
          <span>{formatDate(now)}</span>
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
