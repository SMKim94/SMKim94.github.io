import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { HOME } from "../os/filesystem";
import { useSystem } from "../os/System";
import { useWindows, type WinState } from "../os/WindowManager";
import {
  VERSION_LINE,
  displayCwd,
  exec,
  type TerminalHost,
} from "./terminalCommands";

/** 명령 프롬프트: 가짜 FS 위에서 실제로 동작하는 cmd 재현 */
export function Terminal({ win }: { win: WinState }) {
  const wm = useWindows();
  const sys = useSystem();
  const [lines, setLines] = useState<string[]>([
    VERSION_LINE,
    "(c) Microsoft Corporation. All rights reserved.",
    "",
  ]);
  const [cwd, setCwd] = useState(HOME);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState<null | "confirm-format" | "formatting">(null);
  const histRef = useRef<string[]>([]);
  const histIdx = useRef(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const formatTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
    // lines/busy는 본문에서 쓰지 않지만, 내용이 바뀔 때 맨 아래로 따라 내려가려면
    // 트리거로 필요하다. 지우면 자동 스크롤이 멈춘다.
    // oxlint-disable-next-line react/exhaustive-effect-dependencies
  }, [lines, busy]);

  useEffect(() => {
    return () => {
      if (formatTimer.current) clearInterval(formatTimer.current);
    };
  }, []);

  const promptText =
    busy === "confirm-format"
      ? "포맷하시겠습니까 (Y/N)? "
      : `${displayCwd(cwd)}>`;

  function print(...ls: string[]) {
    setLines((prev) => [...prev, ...ls]);
  }

  function startFormatting() {
    setBusy("formatting");
    setLines((prev) => [...prev, "포맷하는 중: 0% 완료."]);
    let pct = 0;
    formatTimer.current = setInterval(() => {
      pct = Math.min(100, pct + Math.ceil(Math.random() * 6));
      setLines((prev) => [...prev.slice(0, -1), `포맷하는 중: ${pct}% 완료.`]);
      if (pct >= 100 && formatTimer.current) {
        clearInterval(formatTimer.current);
        formatTimer.current = null;
        setTimeout(() => sys.bsod(), 700);
      }
    }, 160);
  }

  // 명령 해석은 terminalCommands.ts가 맡고, 여기서는 부수효과만 연결한다.
  const host: TerminalHost = {
    cwd,
    setCwd,
    print,
    clear: () => setLines([]),
    setTitle: (title) => wm.setTitle(win.id, title),
    openApp: (app, args) => wm.open(app, args),
    closeSelf: () => wm.close(win.id),
    closeAll: () => wm.closeAll(),
    shutdown: () => sys.shutdown(),
    restart: () => sys.restart(),
    confirmFormat: () => setBusy("confirm-format"),
    now: () => Date.now(),
  };


  function submit() {
    const raw = input;
    setInput("");
    histIdx.current = -1;

    if (busy === "confirm-format") {
      print(promptText + raw);
      const a = raw.trim().toLowerCase();
      if (a === "y") {
        startFormatting();
      } else {
        setBusy(null);
        print("포맷이 취소되었습니다.", "");
      }
      return;
    }

    print(promptText + raw);
    if (raw.trim()) histRef.current.push(raw);
    exec(host, raw);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      submit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const h = histRef.current;
      if (h.length === 0) return;
      histIdx.current =
        histIdx.current < 0
          ? h.length - 1
          : Math.max(0, histIdx.current - 1);
      setInput(h[histIdx.current]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const h = histRef.current;
      if (histIdx.current < 0) return;
      histIdx.current++;
      if (histIdx.current >= h.length) {
        histIdx.current = -1;
        setInput("");
      } else {
        setInput(h[histIdx.current]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
    }
  }

  return (
    <div
      className="terminal"
      ref={scrollRef}
      onClick={() => {
        if (window.getSelection()?.isCollapsed) inputRef.current?.focus();
      }}
    >
      {lines.map((l, i) => (
        <div key={i} className="term-line">
          {l === "" ? "\u00a0" : l}
        </div>
      ))}
      {busy !== "formatting" && (
        <div className="term-input-row">
          <span>{promptText}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoFocus
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            aria-label="명령 입력"
          />
        </div>
      )}
    </div>
  );
}
