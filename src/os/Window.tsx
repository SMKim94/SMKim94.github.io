import { useRef, type PointerEvent as RPointerEvent, type ReactNode } from "react";
import { APPS } from "./apps";
import { isMobile, useWindows, type WinState } from "./WindowManager";
import { CloseGlyph, MaxGlyph, MinGlyph, RestoreGlyph } from "./icons";

const MIN_W = 360;
const MIN_H = 240;
const TASKBAR_H = 48;

interface DragRef {
  pointerId: number;
  sx: number;
  sy: number;
  dx: number;
  dy: number;
}

interface ResizeRef {
  pointerId: number;
  sx: number;
  sy: number;
  dir: string;
  base: { x: number; y: number; w: number; h: number };
  live: { x: number; y: number; w: number; h: number };
}

const RESIZE_DIRS = ["n", "s", "e", "w", "ne", "nw", "se", "sw"] as const;

export function Window({
  win,
  focused,
  children,
}: {
  win: WinState;
  focused: boolean;
  children: ReactNode;
}) {
  const wm = useWindows();
  const ref = useRef<HTMLElement>(null);
  const drag = useRef<DragRef | null>(null);
  const resize = useRef<ResizeRef | null>(null);
  const def = APPS[win.app];

  // ── 타이틀바 드래그 이동 ──────────────────────────────
  function onTitleDown(e: RPointerEvent<HTMLElement>) {
    if ((e.target as HTMLElement).closest(".win-ctrl")) return;
    if (win.maximized || isMobile()) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { pointerId: e.pointerId, sx: e.clientX, sy: e.clientY, dx: 0, dy: 0 };
    document.body.classList.add("os-dragging");
  }

  function onTitleMove(e: RPointerEvent<HTMLElement>) {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    d.dx = e.clientX - d.sx;
    d.dy = e.clientY - d.sy;
    if (ref.current) {
      ref.current.style.transform = `translate(${d.dx}px, ${d.dy}px)`;
    }
  }

  function onTitleUp(e: RPointerEvent<HTMLElement>) {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    drag.current = null;
    document.body.classList.remove("os-dragging");
    if (ref.current) ref.current.style.transform = "";
    if (d.dx !== 0 || d.dy !== 0) {
      const x = Math.min(
        Math.max(win.x + d.dx, -(win.w - 100)),
        window.innerWidth - 100,
      );
      const y = Math.min(
        Math.max(win.y + d.dy, 0),
        window.innerHeight - TASKBAR_H - 34,
      );
      wm.setRect(win.id, { x, y });
    }
  }

  // ── 8방향 리사이즈 ───────────────────────────────────
  function onResizeDown(e: RPointerEvent<HTMLElement>, dir: string) {
    if (win.maximized || isMobile()) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    resize.current = {
      pointerId: e.pointerId,
      sx: e.clientX,
      sy: e.clientY,
      dir,
      base: { x: win.x, y: win.y, w: win.w, h: win.h },
      live: { x: win.x, y: win.y, w: win.w, h: win.h },
    };
    document.body.classList.add("os-dragging");
  }

  function onResizeMove(e: RPointerEvent<HTMLElement>) {
    const r = resize.current;
    if (!r || r.pointerId !== e.pointerId) return;
    const dx = e.clientX - r.sx;
    const dy = e.clientY - r.sy;
    let { x, y, w, h } = r.base;

    if (r.dir.includes("e")) w = r.base.w + dx;
    if (r.dir.includes("s")) h = r.base.h + dy;
    if (r.dir.includes("w")) {
      w = r.base.w - dx;
      x = r.base.x + dx;
      if (w < MIN_W) {
        x = r.base.x + (r.base.w - MIN_W);
        w = MIN_W;
      }
    }
    if (r.dir.includes("n")) {
      h = r.base.h - dy;
      y = r.base.y + dy;
      if (h < MIN_H) {
        y = r.base.y + (r.base.h - MIN_H);
        h = MIN_H;
      }
      if (y < 0) {
        h += y;
        y = 0;
      }
    }
    w = Math.max(w, MIN_W);
    h = Math.max(h, MIN_H);

    r.live = { x, y, w, h };
    const el = ref.current;
    if (el) {
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
    }
  }

  function onResizeUp(e: RPointerEvent<HTMLElement>) {
    const r = resize.current;
    if (!r || r.pointerId !== e.pointerId) return;
    resize.current = null;
    document.body.classList.remove("os-dragging");
    wm.setRect(win.id, r.live);
  }

  const style = win.maximized
    ? { left: 0, top: 0, width: "100%", height: `calc(100% - ${TASKBAR_H}px)`, zIndex: win.z }
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z };

  return (
    <section
      ref={ref}
      className={[
        "window",
        focused ? "focused" : "",
        win.maximized ? "maximized" : "",
        win.minimized ? "minimized" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
      onPointerDown={() => {
        if (!focused) wm.focus(win.id);
      }}
      aria-label={win.title}
    >
      <header
        className="win-titlebar"
        onPointerDown={onTitleDown}
        onPointerMove={onTitleMove}
        onPointerUp={onTitleUp}
        onPointerCancel={onTitleUp}
        onDoubleClick={(e) => {
          if ((e.target as HTMLElement).closest(".win-ctrl")) return;
          if (!isMobile()) wm.toggleMax(win.id);
        }}
      >
        <span className="win-title-icon">
          <def.Icon size={16} />
        </span>
        <span className="win-title-text">{win.title}</span>
        <div className="win-ctrls">
          <button
            className="win-ctrl"
            aria-label="최소화"
            onClick={() => wm.minimize(win.id)}
          >
            <MinGlyph />
          </button>
          <button
            className="win-ctrl"
            aria-label={win.maximized ? "이전 크기로 복원" : "최대화"}
            onClick={() => wm.toggleMax(win.id)}
          >
            {win.maximized ? <RestoreGlyph /> : <MaxGlyph />}
          </button>
          <button
            className="win-ctrl win-ctrl-close"
            aria-label="닫기"
            onClick={() => wm.close(win.id)}
          >
            <CloseGlyph />
          </button>
        </div>
      </header>
      <div className={`win-body ${def.bodyClass ?? ""}`}>{children}</div>
      {!win.maximized &&
        !isMobile() &&
        RESIZE_DIRS.map((dir) => (
          <div
            key={dir}
            className={`rs rs-${dir}`}
            onPointerDown={(e) => onResizeDown(e, dir)}
            onPointerMove={onResizeMove}
            onPointerUp={onResizeUp}
            onPointerCancel={onResizeUp}
          />
        ))}
    </section>
  );
}
