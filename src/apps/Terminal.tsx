import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  HOME,
  HOME_VIEW,
  byteSize,
  fs,
  resolvePath,
  type FsFolder,
} from "../os/filesystem";
import { useSystem } from "../os/System";
import { useWindows, type WinState } from "../os/WindowManager";

const VERSION_LINE = "Microsoft Windows [Version 10.0.26100.4652]";

function two(n: number): string {
  return String(n).padStart(2, "0");
}

/** dir 출력용 날짜: "2026-08-07  오후 09:41" */
function dirDate(ms: number): string {
  const d = new Date(ms);
  const ampm = d.getHours() < 12 ? "오전" : "오후";
  const h12 = d.getHours() % 12 === 0 ? 12 : d.getHours() % 12;
  return `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}  ${ampm} ${two(h12)}:${two(d.getMinutes())}`;
}

function comma(n: number): string {
  return n.toLocaleString("en-US");
}

function displayCwd(cwd: string): string {
  return cwd === "C:" ? "C:\\" : cwd;
}

/** cmd처럼 경로를 감싼 큰따옴표를 벗긴다 */
function unquote(s: string): string {
  return s.replace(/^"(.*)"$/s, "$1");
}

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

  function cmdDir(arg: string | undefined): string[] {
    const target = arg ? resolvePath(cwd, unquote(arg)) : cwd;
    const canonical = fs.canonicalize(target);
    const node = canonical ? fs.getNode(canonical) : null;
    if (!node || node.type !== "folder") {
      return ["파일을 찾을 수 없습니다."];
    }
    const out: string[] = [
      " C 드라이브의 볼륨에는 이름이 없습니다.",
      " 볼륨 일련 번호: 7C3A-19E4",
      "",
      ` ${displayCwd(canonical!)} 디렉터리`,
      "",
    ];
    const now = Date.now();
    out.push(`${dirDate(now)}    <DIR>          .`);
    out.push(`${dirDate(now)}    <DIR>          ..`);
    let fileCount = 0;
    let dirCount = 2;
    let total = 0;
    for (const c of fs.list(canonical!)) {
      if (c.type === "folder") {
        dirCount++;
        out.push(`${dirDate(c.mtime)}    <DIR>          ${c.name}`);
      } else {
        fileCount++;
        const size = byteSize(c.content);
        total += size;
        out.push(`${dirDate(c.mtime)}    ${comma(size).padStart(14)} ${c.name}`);
      }
    }
    out.push(`${String(fileCount).padStart(15)}개 파일  ${comma(total).padStart(17)} 바이트`);
    out.push(`${String(dirCount).padStart(15)}개 디렉터리  ${comma(107374182400).padStart(15)} 바이트 남음`);
    return out;
  }

  function cmdTree(arg: string | undefined, withFiles: boolean): string[] {
    const target = arg ? resolvePath(cwd, unquote(arg)) : cwd;
    const canonical = fs.canonicalize(target);
    const node = canonical ? fs.getNode(canonical) : null;
    if (!node || node.type !== "folder") {
      return ["잘못된 경로입니다."];
    }
    const out: string[] = [displayCwd(canonical!)];
    const walk = (folder: FsFolder, prefix: string) => {
      const children = folder.children.filter(
        (c) => withFiles || c.type === "folder",
      );
      children.forEach((c, i) => {
        const last = i === children.length - 1;
        out.push(`${prefix}${last ? "└───" : "├───"}${c.name}`);
        if (c.type === "folder") {
          walk(c, `${prefix}${last ? "    " : "│   "}`);
        }
      });
    };
    walk(node, "");
    return out;
  }

  function exec(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    const tokens = trimmed.split(/\s+/);
    let cmd = tokens[0].toLowerCase();
    let args = tokens.slice(1);
    // "cd.." 처럼 붙여 쓴 형태 허용
    if (cmd.startsWith("cd") && cmd !== "cd" && /^cd\.+$/.test(cmd)) {
      args = [cmd.slice(2)];
      cmd = "cd";
    }
    const restRaw = trimmed.slice(tokens[0].length).trim();

    switch (cmd) {
      case "help":
        print(
          "사용할 수 있는 명령:",
          "CD       현재 디렉터리를 표시하거나 바꿉니다.",
          "CLS      화면을 지웁니다.",
          "DIR      디렉터리의 파일과 하위 디렉터리 목록을 표시합니다.",
          "ECHO     메시지를 표시합니다.",
          "MKDIR    디렉터리를 만듭니다.",
          "DEL      파일을 삭제합니다.",
          "RMDIR    디렉터리를 제거합니다.",
          "TYPE     텍스트 파일의 내용을 표시합니다.",
          "TREE     디렉터리 구조를 그래픽으로 표시합니다.",
          "TITLE    창 제목을 설정합니다.",
          "VER      Windows 버전을 표시합니다.",
          "WHOAMI   현재 사용자를 표시합니다.",
          "NOTEPAD  메모장을 엽니다.",
          "EXPLORER 파일 탐색기를 엽니다.",
          "SHUTDOWN 컴퓨터를 종료하거나 다시 시작합니다.",
          "EXIT     명령 프롬프트를 종료합니다.",
        );
        break;
      case "cls":
        setLines([]);
        return;
      case "cd":
      case "chdir": {
        if (args.length === 0) {
          print(displayCwd(cwd));
          break;
        }
        const target = resolvePath(cwd, unquote(args.join(" ")));
        const canonical = fs.canonicalize(target);
        const node = canonical ? fs.getNode(canonical) : null;
        if (node && node.type === "folder") setCwd(canonical!);
        else print("지정된 경로를 찾을 수 없습니다.");
        break;
      }
      case "dir": {
        const target = args.filter((a) => !a.startsWith("/")).join(" ");
        print(...cmdDir(target || undefined));
        break;
      }
      case "type": {
        if (args.length === 0) {
          print("명령 구문이 올바르지 않습니다.");
          break;
        }
        const p = resolvePath(cwd, unquote(args.join(" ")));
        const node = fs.getNode(p);
        if (!node) print("지정된 파일을 찾을 수 없습니다.");
        else if (node.type === "folder") print("액세스가 거부되었습니다.");
        else print(...node.content.split("\n"));
        break;
      }
      case "echo": {
        if (!restRaw) print("ECHO 상태: 켬(ON)입니다.");
        else if (restRaw === ".") print("");
        else print(restRaw);
        break;
      }
      case "mkdir":
      case "md": {
        if (args.length === 0) {
          print("명령 구문이 올바르지 않습니다.");
          break;
        }
        const r = fs.mkdir(resolvePath(cwd, unquote(args.join(" "))));
        if (!r.ok && r.error) print(r.error);
        break;
      }
      case "del":
      case "erase": {
        if (args.length === 0) {
          print("명령 구문이 올바르지 않습니다.");
          break;
        }
        const p = resolvePath(cwd, unquote(args.join(" ")));
        const node = fs.getNode(p);
        if (!node) print("지정된 파일을 찾을 수 없습니다.");
        else if (node.type === "folder") print("액세스가 거부되었습니다.");
        else fs.remove(p);
        break;
      }
      case "rmdir":
      case "rd": {
        if (args.length === 0) {
          print("명령 구문이 올바르지 않습니다.");
          break;
        }
        const p = resolvePath(cwd, unquote(args.join(" ")));
        const node = fs.getNode(p);
        if (!node || node.type !== "folder")
          print("지정된 경로를 찾을 수 없습니다.");
        else if (node.children.length > 0)
          print("디렉터리가 비어 있지 않습니다.");
        else fs.remove(p);
        break;
      }
      case "tree":
        print(...cmdTree(
          args.find((a) => !a.startsWith("/")),
          args.some((a) => a.toLowerCase() === "/f"),
        ));
        break;
      case "ver":
        print("", VERSION_LINE);
        break;
      case "whoami":
        print("desktop-smk94\\smkim94");
        break;
      case "hostname":
        print("DESKTOP-SMK94");
        break;
      case "date": {
        const d = new Date();
        const days = ["일", "월", "화", "수", "목", "금", "토"];
        print(
          `현재 날짜: ${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())} ${days[d.getDay()]}`,
        );
        break;
      }
      case "time": {
        const d = new Date();
        const ampm = d.getHours() < 12 ? "오전" : "오후";
        const h12 = d.getHours() % 12 === 0 ? 12 : d.getHours() % 12;
        print(
          `현재 시간: ${ampm} ${h12}:${two(d.getMinutes())}:${two(d.getSeconds())}.${two(Math.floor(d.getMilliseconds() / 10))}`,
        );
        break;
      }
      case "title":
        wm.setTitle(win.id, restRaw || "명령 프롬프트");
        break;
      case "notepad": {
        if (args.length === 0) {
          wm.open("notepad");
        } else {
          const p = resolvePath(cwd, unquote(args.join(" ")));
          const canonical = fs.canonicalize(p);
          const node = canonical ? fs.getNode(canonical) : null;
          if (node && node.type === "file")
            wm.open("notepad", { path: canonical! });
          else wm.open("notepad");
        }
        break;
      }
      case "explorer": {
        if (args.length === 0) {
          wm.open("explorer", { path: HOME_VIEW });
        } else {
          const p = resolvePath(cwd, unquote(args.join(" ")));
          const canonical = fs.canonicalize(p);
          const node = canonical ? fs.getNode(canonical) : null;
          wm.open("explorer", {
            path: node && node.type === "folder" ? canonical! : HOME_VIEW,
          });
        }
        break;
      }
      case "cmd":
        wm.open("terminal");
        break;
      case "start": {
        const what = args[0]?.toLowerCase();
        if (what === "notepad") wm.open("notepad");
        else if (what === "cmd") wm.open("terminal");
        else if (what === "explorer" || what === undefined)
          wm.open("explorer", { path: HOME_VIEW });
        else
          print(
            `'${args[0]}'을(를) 찾을 수 없습니다. 이름을 올바르게 입력했는지 확인하십시오.`,
          );
        break;
      }
      case "exit":
        wm.close(win.id);
        return;
      case "shutdown": {
        const flags = args.map((a) => a.toLowerCase());
        if (flags.includes("/s") || flags.includes("-s")) {
          wm.closeAll();
          sys.shutdown();
          return;
        }
        if (flags.includes("/r") || flags.includes("-r")) {
          wm.closeAll();
          sys.restart();
          return;
        }
        print(
          "사용법: shutdown [/s | /r]",
          "    /s     컴퓨터를 종료합니다.",
          "    /r     컴퓨터를 종료하고 다시 시작합니다.",
        );
        break;
      }
      case "format": {
        const drive = args[0]?.toLowerCase();
        if (!drive) {
          print("필수 매개 변수가 없습니다 - 드라이브 문자를 지정하십시오.");
          break;
        }
        if (drive !== "c:") {
          print("지정한 드라이브를 찾을 수 없습니다.");
          break;
        }
        print(
          "경고: 하드 디스크 드라이브 C:의",
          "모든 데이터가 손실됩니다!",
        );
        setBusy("confirm-format");
        return;
      }
      default:
        print(
          `'${tokens[0]}'은(는) 내부 또는 외부 명령, 실행할 수 있는 프로그램, 또는`,
          "배치 파일이 아닙니다.",
        );
    }
    print("");
  }

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
    exec(raw);
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
