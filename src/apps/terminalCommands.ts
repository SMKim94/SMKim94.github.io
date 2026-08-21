import {
  HOME_VIEW,
  byteSize,
  fs,
  resolvePath,
  type FsFolder,
} from "../os/filesystem";
import type { AppArgs, AppId } from "../os/appMeta";

/**
 * 명령 프롬프트의 명령 해석기.
 *
 * Terminal.tsx가 React 상태를 클로저로 들고 있어서 명령 로직을 테스트할 수
 * 없었다. 부수효과를 host 인터페이스로 빼서 순수하게 검사할 수 있게 한다.
 * 컴포넌트는 이 모듈을 호출하는 얇은 껍데기로 남는다.
 */
export interface TerminalHost {
  /** 현재 작업 디렉터리 (정규화된 절대 경로) */
  readonly cwd: string;
  setCwd(path: string): void;
  print(...lines: string[]): void;
  /** cls — 화면을 비운다 */
  clear(): void;
  setTitle(title: string): void;
  openApp(app: AppId, args?: AppArgs): void;
  /** exit — 이 창을 닫는다 */
  closeSelf(): void;
  closeAll(): void;
  shutdown(): void;
  restart(): void;
  /** format c: — 확인 프롬프트로 전환 */
  confirmFormat(): void;
  /** 현재 시각. 테스트에서 고정할 수 있도록 주입받는다. */
  now(): number;
}

export const VERSION_LINE = "Microsoft Windows [Version 10.0.26100.4652]";

function two(n: number): string {
  return String(n).padStart(2, "0");
}

/** dir 출력용 날짜: "2026-08-07  오후 09:41" */
export function dirDate(ms: number): string {
  const d = new Date(ms);
  const ampm = d.getHours() < 12 ? "오전" : "오후";
  const h12 = d.getHours() % 12 === 0 ? 12 : d.getHours() % 12;
  return `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}  ${ampm} ${two(h12)}:${two(d.getMinutes())}`;
}

function comma(n: number): string {
  return n.toLocaleString("en-US");
}

export function displayCwd(cwd: string): string {
  return cwd === "C:" ? "C:\\" : cwd;
}

/** cmd처럼 경로를 감싼 큰따옴표를 벗긴다 */
export function unquote(s: string): string {
  return s.replace(/^"(.*)"$/s, "$1");
}
export function cmdDir(host: TerminalHost, arg: string | undefined): string[] {
  const target = arg ? resolvePath(host.cwd, unquote(arg)) : host.cwd;
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
  const now = host.now();
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

export function cmdTree(
  host: TerminalHost,
  arg: string | undefined,
  withFiles: boolean,
): string[] {
  const target = arg ? resolvePath(host.cwd, unquote(arg)) : host.cwd;
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

export function exec(host: TerminalHost, raw: string): void {
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
      host.print(
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
      host.clear();
      return;
    case "cd":
    case "chdir": {
      if (args.length === 0) {
        host.print(displayCwd(host.cwd));
        break;
      }
      const target = resolvePath(host.cwd, unquote(args.join(" ")));
      const canonical = fs.canonicalize(target);
      const node = canonical ? fs.getNode(canonical) : null;
      if (node && node.type === "folder") host.setCwd(canonical!);
      else host.print("지정된 경로를 찾을 수 없습니다.");
      break;
    }
    case "dir": {
      const target = args.filter((a) => !a.startsWith("/")).join(" ");
      host.print(...cmdDir(host, target || undefined));
      break;
    }
    case "type": {
      if (args.length === 0) {
        host.print("명령 구문이 올바르지 않습니다.");
        break;
      }
      const p = resolvePath(host.cwd, unquote(args.join(" ")));
      const node = fs.getNode(p);
      if (!node) host.print("지정된 파일을 찾을 수 없습니다.");
      else if (node.type === "folder") host.print("액세스가 거부되었습니다.");
      else host.print(...node.content.split("\n"));
      break;
    }
    case "echo": {
      if (!restRaw) host.print("ECHO 상태: 켬(ON)입니다.");
      else if (restRaw === ".") host.print("");
      else host.print(restRaw);
      break;
    }
    case "mkdir":
    case "md": {
      if (args.length === 0) {
        host.print("명령 구문이 올바르지 않습니다.");
        break;
      }
      const r = fs.mkdir(resolvePath(host.cwd, unquote(args.join(" "))));
      if (!r.ok && r.error) host.print(r.error);
      break;
    }
    case "del":
    case "erase": {
      if (args.length === 0) {
        host.print("명령 구문이 올바르지 않습니다.");
        break;
      }
      const p = resolvePath(host.cwd, unquote(args.join(" ")));
      const node = fs.getNode(p);
      if (!node) host.print("지정된 파일을 찾을 수 없습니다.");
      else if (node.type === "folder") host.print("액세스가 거부되었습니다.");
      else fs.remove(p);
      break;
    }
    case "rmdir":
    case "rd": {
      if (args.length === 0) {
        host.print("명령 구문이 올바르지 않습니다.");
        break;
      }
      const p = resolvePath(host.cwd, unquote(args.join(" ")));
      const node = fs.getNode(p);
      if (!node || node.type !== "folder")
        host.print("지정된 경로를 찾을 수 없습니다.");
      else if (node.children.length > 0)
        host.print("디렉터리가 비어 있지 않습니다.");
      else fs.remove(p);
      break;
    }
    case "tree":
      host.print(
        ...cmdTree(
          host,
          args.find((a) => !a.startsWith("/")),
          args.some((a) => a.toLowerCase() === "/f"),
        ),
      );
      break;
    case "ver":
      host.print("", VERSION_LINE);
      break;
    case "whoami":
      host.print("desktop-smk94\\smkim94");
      break;
    case "hostname":
      host.print("DESKTOP-SMK94");
      break;
    case "date": {
      const d = new Date(host.now());
      const days = ["일", "월", "화", "수", "목", "금", "토"];
      host.print(
        `현재 날짜: ${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())} ${days[d.getDay()]}`,
      );
      break;
    }
    case "time": {
      const d = new Date(host.now());
      const ampm = d.getHours() < 12 ? "오전" : "오후";
      const h12 = d.getHours() % 12 === 0 ? 12 : d.getHours() % 12;
      host.print(
        `현재 시간: ${ampm} ${h12}:${two(d.getMinutes())}:${two(d.getSeconds())}.${two(Math.floor(d.getMilliseconds() / 10))}`,
      );
      break;
    }
    case "title":
      host.setTitle(restRaw || "명령 프롬프트");
      break;
    case "notepad": {
      if (args.length === 0) {
        host.openApp("notepad");
      } else {
        const p = resolvePath(host.cwd, unquote(args.join(" ")));
        const canonical = fs.canonicalize(p);
        const node = canonical ? fs.getNode(canonical) : null;
        if (node && node.type === "file")
          host.openApp("notepad", { path: canonical! });
        else host.openApp("notepad");
      }
      break;
    }
    case "explorer": {
      if (args.length === 0) {
        host.openApp("explorer", { path: HOME_VIEW });
      } else {
        const p = resolvePath(host.cwd, unquote(args.join(" ")));
        const canonical = fs.canonicalize(p);
        const node = canonical ? fs.getNode(canonical) : null;
        host.openApp("explorer", {
          path: node && node.type === "folder" ? canonical! : HOME_VIEW,
        });
      }
      break;
    }
    case "cmd":
      host.openApp("terminal");
      break;
    case "start": {
      const what = args[0]?.toLowerCase();
      if (what === "notepad") host.openApp("notepad");
      else if (what === "cmd") host.openApp("terminal");
      else if (what === "explorer" || what === undefined)
        host.openApp("explorer", { path: HOME_VIEW });
      else
        host.print(
          `'${args[0]}'을(를) 찾을 수 없습니다. 이름을 올바르게 입력했는지 확인하십시오.`,
        );
      break;
    }
    case "exit":
      host.closeSelf();
      return;
    case "shutdown": {
      const flags = args.map((a) => a.toLowerCase());
      if (flags.includes("/s") || flags.includes("-s")) {
        host.closeAll();
        host.shutdown();
        return;
      }
      if (flags.includes("/r") || flags.includes("-r")) {
        host.closeAll();
        host.restart();
        return;
      }
      host.print(
        "사용법: shutdown [/s | /r]",
        "    /s     컴퓨터를 종료합니다.",
        "    /r     컴퓨터를 종료하고 다시 시작합니다.",
      );
      break;
    }
    case "format": {
      const drive = args[0]?.toLowerCase();
      if (!drive) {
        host.print("필수 매개 변수가 없습니다 - 드라이브 문자를 지정하십시오.");
        break;
      }
      if (drive !== "c:") {
        host.print("지정한 드라이브를 찾을 수 없습니다.");
        break;
      }
      host.print(
        "경고: 하드 디스크 드라이브 C:의",
        "모든 데이터가 손실됩니다!",
      );
      host.confirmFormat();
      return;
    }
    default:
      host.print(
        `'${tokens[0]}'은(는) 내부 또는 외부 명령, 실행할 수 있는 프로그램, 또는`,
        "배치 파일이 아닙니다.",
      );
  }
  host.print("");
}
