import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TerminalHost } from "./terminalCommands";

type FsModule = typeof import("../os/filesystem");
type CmdModule = typeof import("./terminalCommands");

/** 테스트에서 시간을 고정한다 (로컬 시각으로 만들어 타임존에 의존하지 않는다) */
const FIXED = new Date(2026, 7, 7, 21, 41, 5, 30).getTime();

interface Harness {
  fsm: FsModule;
  cmds: CmdModule;
  host: TerminalHost;
  /** print로 나간 줄 */
  out: string[];
  /** 부수효과 호출 기록 */
  calls: string[];
  run(line: string): void;
}

/**
 * filesystem은 모듈 로드 시 싱글턴을 만든다.
 * 매 테스트마다 두 모듈을 함께 다시 불러 같은 인스턴스를 보게 하고,
 * 이전 테스트의 상태가 새지 않게 한다.
 */
async function freshTerm(): Promise<Harness> {
  localStorage.clear();
  vi.resetModules();
  const fsm = await import("../os/filesystem");
  const cmds = await import("./terminalCommands");

  const out: string[] = [];
  const calls: string[] = [];
  const host = {
    cwd: fsm.HOME,
    setCwd(p: string) {
      this.cwd = p;
      calls.push(`setCwd:${p}`);
    },
    print(...ls: string[]) {
      out.push(...ls);
    },
    clear() {
      out.length = 0;
      calls.push("clear");
    },
    setTitle(t: string) {
      calls.push(`setTitle:${t}`);
    },
    openApp(app: string, args?: { path?: string }) {
      calls.push(`open:${app}${args?.path ? `:${args.path}` : ""}`);
    },
    closeSelf() {
      calls.push("closeSelf");
    },
    closeAll() {
      calls.push("closeAll");
    },
    shutdown() {
      calls.push("shutdown");
    },
    restart() {
      calls.push("restart");
    },
    confirmFormat() {
      calls.push("confirmFormat");
    },
    now() {
      return FIXED;
    },
  };

  return {
    fsm,
    cmds,
    host: host as unknown as TerminalHost,
    out,
    calls,
    run(line: string) {
      out.length = 0;
      calls.length = 0;
      cmds.exec(host as unknown as TerminalHost, line);
    },
  };
}

let h: Harness;
beforeEach(async () => {
  h = await freshTerm();
});

describe("빈 입력", () => {
  it("아무것도 하지 않는다", () => {
    h.run("");
    expect(h.out).toEqual([]);
    expect(h.calls).toEqual([]);
  });

  it("공백만 있어도 아무것도 하지 않는다", () => {
    h.run("    ");
    expect(h.out).toEqual([]);
  });
});

describe("알 수 없는 명령", () => {
  it("cmd와 같은 안내를 낸다", () => {
    h.run("없는명령");
    expect(h.out[0]).toContain("'없는명령'은(는) 내부 또는 외부 명령");
    expect(h.out[1]).toBe("배치 파일이 아닙니다.");
  });

  it("원래 대소문자를 그대로 인용한다", () => {
    h.run("FooBar");
    expect(h.out[0]).toContain("'FooBar'");
  });
});

describe("출력 끝의 빈 줄", () => {
  it("보통 명령은 끝에 빈 줄을 남긴다", () => {
    h.run("ver");
    expect(h.out[h.out.length - 1]).toBe("");
  });

  it("cls는 화면을 비우고 빈 줄도 남기지 않는다", () => {
    h.run("cls");
    expect(h.calls).toContain("clear");
    expect(h.out).toEqual([]);
  });

  it("exit은 빈 줄 없이 창을 닫는다", () => {
    h.run("exit");
    expect(h.calls).toEqual(["closeSelf"]);
    expect(h.out).toEqual([]);
  });
});

describe("help", () => {
  it("주요 명령을 안내한다", () => {
    h.run("help");
    expect(h.out[0]).toBe("사용할 수 있는 명령:");
    const body = h.out.join("\n");
    for (const c of ["CD", "CLS", "DIR", "ECHO", "TREE", "SHUTDOWN", "EXIT"]) {
      expect(body).toContain(c);
    }
  });
});

describe("cd / chdir", () => {
  it("인자가 없으면 현재 경로를 보여준다", () => {
    h.run("cd");
    expect(h.out[0]).toBe(h.fsm.HOME);
  });

  it("폴더로 이동한다", () => {
    h.run("cd 문서");
    expect(h.host.cwd).toBe(h.fsm.DOCUMENTS_DIR);
  });

  it("chdir도 같게 동작한다", () => {
    h.run("chdir 문서");
    expect(h.host.cwd).toBe(h.fsm.DOCUMENTS_DIR);
  });

  it("대소문자가 달라도 실제 이름으로 정규화한다", () => {
    h.run("cd c:\\windows\\system32");
    expect(h.host.cwd).toBe("C:\\Windows\\System32");
  });

  it("없는 경로면 오류를 낸다", () => {
    h.run("cd 없는폴더");
    expect(h.out[0]).toBe("지정된 경로를 찾을 수 없습니다.");
    expect(h.host.cwd).toBe(h.fsm.HOME);
  });

  it("파일로는 이동하지 않는다", () => {
    h.run("cd C:\\Windows\\explorer.exe");
    expect(h.out[0]).toBe("지정된 경로를 찾을 수 없습니다.");
  });

  it("cd.. 처럼 붙여 써도 상위로 간다", () => {
    h.run("cd 문서");
    h.run("cd..");
    expect(h.host.cwd).toBe(h.fsm.HOME);
  });

  // 실제 cmd에서 cd...은 두 단계 위로 간다. 이 구현은 "..."을 경로 조각으로
  // 그대로 넘겨서 해석하지 못하고 실패한다. 현 동작을 그대로 고정해 둔다.
  it("cd...은 두 단계 위로 가지 못하고 경로 오류를 낸다", () => {
    h.run("cd...");
    expect(h.out[0]).toBe("지정된 경로를 찾을 수 없습니다.");
    expect(h.host.cwd).toBe(h.fsm.HOME);
  });

  it("공백이 있는 이름은 따옴표로 감싸 이동한다", () => {
    h.run('cd "바탕 화면"');
    expect(h.host.cwd).toBe(h.fsm.DESKTOP_DIR);
  });

  it("따옴표 없이 공백 이름도 받아준다", () => {
    h.run("cd 바탕 화면");
    expect(h.host.cwd).toBe(h.fsm.DESKTOP_DIR);
  });
});

describe("dir", () => {
  beforeEach(() => {
    h.fsm.fs.writeFile(`${h.fsm.DOCUMENTS_DIR}\\메모.txt`, "안녕");
    h.fsm.fs.mkdir(`${h.fsm.DOCUMENTS_DIR}\\하위`);
  });

  it("볼륨 머리말과 대상 디렉터리를 적는다", () => {
    h.run("dir 문서");
    expect(h.out[0]).toBe(" C 드라이브의 볼륨에는 이름이 없습니다.");
    expect(h.out[1]).toContain("볼륨 일련 번호");
    expect(h.out[3]).toBe(` ${h.fsm.DOCUMENTS_DIR} 디렉터리`);
  });

  it(". 과 .. 항목을 먼저 넣는다", () => {
    h.run("dir 문서");
    expect(h.out[5]).toContain("<DIR>          .");
    expect(h.out[6]).toContain("<DIR>          ..");
  });

  it("고정된 시각으로 . 항목 날짜를 적는다", () => {
    h.run("dir 문서");
    expect(h.out[5]).toContain(h.cmds.dirDate(FIXED));
  });

  it("폴더와 파일을 모두 나열한다", () => {
    h.run("dir 문서");
    const body = h.out.join("\n");
    expect(body).toContain("하위");
    expect(body).toContain("메모.txt");
  });

  it("파일 크기를 UTF-8 바이트로 적는다", () => {
    h.run("dir 문서");
    const line = h.out.find((l) => l.includes("메모.txt"))!;
    expect(line).toContain("6"); // "안녕" = 6바이트
  });

  it("개수 합계를 적는다", () => {
    h.run("dir 문서");
    const counts = h.out.filter((l) => l.includes("개 파일") || l.includes("개 디렉터리"));
    expect(counts[0]).toContain("1개 파일");
    // . 과 .. 를 포함해 3
    expect(counts[1]).toContain("3개 디렉터리");
  });

  it("인자가 없으면 현재 디렉터리를 본다", () => {
    h.run("cd 문서");
    h.run("dir");
    expect(h.out[3]).toBe(` ${h.fsm.DOCUMENTS_DIR} 디렉터리`);
  });

  it("/w 같은 스위치는 경로로 보지 않는다", () => {
    h.run("dir /w 문서");
    expect(h.out[3]).toBe(` ${h.fsm.DOCUMENTS_DIR} 디렉터리`);
  });

  it("없는 경로면 오류", () => {
    h.run("dir 없음");
    expect(h.out[0]).toBe("파일을 찾을 수 없습니다.");
  });

  it("파일을 가리키면 오류", () => {
    h.run("dir C:\\Windows\\explorer.exe");
    expect(h.out[0]).toBe("파일을 찾을 수 없습니다.");
  });
});

describe("type", () => {
  it("파일 내용을 줄 단위로 낸다", () => {
    h.fsm.fs.writeFile(`${h.fsm.DOCUMENTS_DIR}\\a.txt`, "첫 줄\n둘째 줄");
    h.run("type 문서\\a.txt");
    expect(h.out.slice(0, 2)).toEqual(["첫 줄", "둘째 줄"]);
  });

  it("인자가 없으면 구문 오류", () => {
    h.run("type");
    expect(h.out[0]).toBe("명령 구문이 올바르지 않습니다.");
  });

  it("없는 파일", () => {
    h.run("type 없음.txt");
    expect(h.out[0]).toBe("지정된 파일을 찾을 수 없습니다.");
  });

  it("폴더는 액세스 거부", () => {
    h.run("type 문서");
    expect(h.out[0]).toBe("액세스가 거부되었습니다.");
  });
});

describe("echo", () => {
  it("인자가 없으면 상태를 알린다", () => {
    h.run("echo");
    expect(h.out[0]).toBe("ECHO 상태: 켬(ON)입니다.");
  });

  it("echo . 은 빈 줄", () => {
    h.run("echo .");
    expect(h.out[0]).toBe("");
  });

  it("문장을 그대로 낸다", () => {
    h.run("echo 안녕  하세요");
    expect(h.out[0]).toBe("안녕  하세요");
  });
});

describe("mkdir / md", () => {
  it("폴더를 만든다", () => {
    h.run("mkdir 새폴더");
    expect(h.fsm.fs.exists(`${h.fsm.HOME}\\새폴더`)).toBe(true);
    expect(h.out).toEqual([""]);
  });

  it("md도 같게 동작한다", () => {
    h.run("md 새폴더2");
    expect(h.fsm.fs.exists(`${h.fsm.HOME}\\새폴더2`)).toBe(true);
  });

  it("이미 있으면 오류를 낸다", () => {
    h.run("mkdir 문서");
    expect(h.out[0]).toContain("이미 있습니다");
  });

  it("인자가 없으면 구문 오류", () => {
    h.run("mkdir");
    expect(h.out[0]).toBe("명령 구문이 올바르지 않습니다.");
  });
});

describe("del / erase", () => {
  beforeEach(() => {
    h.fsm.fs.writeFile(`${h.fsm.HOME}\\지울것.txt`, "x");
  });

  it("파일을 지운다", () => {
    h.run("del 지울것.txt");
    expect(h.fsm.fs.exists(`${h.fsm.HOME}\\지울것.txt`)).toBe(false);
  });

  it("휴지통으로 간다", () => {
    h.run("del 지울것.txt");
    expect(h.fsm.fs.recycle).toHaveLength(1);
  });

  it("erase도 같게 동작한다", () => {
    h.run("erase 지울것.txt");
    expect(h.fsm.fs.exists(`${h.fsm.HOME}\\지울것.txt`)).toBe(false);
  });

  it("폴더는 액세스 거부", () => {
    h.run("del 문서");
    expect(h.out[0]).toBe("액세스가 거부되었습니다.");
    expect(h.fsm.fs.exists(h.fsm.DOCUMENTS_DIR)).toBe(true);
  });

  it("없는 파일", () => {
    h.run("del 없음.txt");
    expect(h.out[0]).toBe("지정된 파일을 찾을 수 없습니다.");
  });

  it("인자가 없으면 구문 오류", () => {
    h.run("del");
    expect(h.out[0]).toBe("명령 구문이 올바르지 않습니다.");
  });
});

describe("rmdir / rd", () => {
  it("빈 폴더를 지운다", () => {
    h.fsm.fs.mkdir(`${h.fsm.HOME}\\빈폴더`);
    h.run("rmdir 빈폴더");
    expect(h.fsm.fs.exists(`${h.fsm.HOME}\\빈폴더`)).toBe(false);
  });

  it("rd도 같게 동작한다", () => {
    h.fsm.fs.mkdir(`${h.fsm.HOME}\\빈폴더2`);
    h.run("rd 빈폴더2");
    expect(h.fsm.fs.exists(`${h.fsm.HOME}\\빈폴더2`)).toBe(false);
  });

  it("비어 있지 않으면 거부한다", () => {
    h.fsm.fs.writeFile(`${h.fsm.DOCUMENTS_DIR}\\a.txt`, "x");
    h.run("rmdir 문서");
    expect(h.out[0]).toBe("디렉터리가 비어 있지 않습니다.");
    expect(h.fsm.fs.exists(h.fsm.DOCUMENTS_DIR)).toBe(true);
  });

  it("파일을 지정하면 경로 오류", () => {
    h.fsm.fs.writeFile(`${h.fsm.HOME}\\a.txt`, "x");
    h.run("rmdir a.txt");
    expect(h.out[0]).toBe("지정된 경로를 찾을 수 없습니다.");
  });

  it("인자가 없으면 구문 오류", () => {
    h.run("rd");
    expect(h.out[0]).toBe("명령 구문이 올바르지 않습니다.");
  });
});

describe("tree", () => {
  beforeEach(() => {
    h.fsm.fs.mkdir(`${h.fsm.DOCUMENTS_DIR}\\가`);
    h.fsm.fs.mkdir(`${h.fsm.DOCUMENTS_DIR}\\나`);
    h.fsm.fs.writeFile(`${h.fsm.DOCUMENTS_DIR}\\파일.txt`, "x");
  });

  it("머리에 대상 경로를 적는다", () => {
    h.run("tree 문서");
    expect(h.out[0]).toBe(h.fsm.DOCUMENTS_DIR);
  });

  it("기본은 폴더만 보여준다", () => {
    h.run("tree 문서");
    const body = h.out.join("\n");
    expect(body).toContain("가");
    expect(body).toContain("나");
    expect(body).not.toContain("파일.txt");
  });

  it("/f를 주면 파일도 보여준다", () => {
    h.run("tree 문서 /f");
    expect(h.out.join("\n")).toContain("파일.txt");
  });

  it("마지막 항목은 └───, 나머지는 ├───", () => {
    h.run("tree 문서");
    const branches = h.out.filter((l) => l.includes("───"));
    expect(branches[0]).toContain("├───");
    expect(branches[branches.length - 1]).toContain("└───");
  });

  it("없는 경로면 오류", () => {
    h.run("tree 없음");
    expect(h.out[0]).toBe("잘못된 경로입니다.");
  });
});

describe("정보 명령", () => {
  it("ver", () => {
    h.run("ver");
    expect(h.out[1]).toBe(h.cmds.VERSION_LINE);
  });

  it("whoami", () => {
    h.run("whoami");
    expect(h.out[0]).toBe("desktop-smk94\\smkim94");
  });

  it("hostname", () => {
    h.run("hostname");
    expect(h.out[0]).toBe("DESKTOP-SMK94");
  });

  it("date는 고정 시각을 요일과 함께 적는다", () => {
    h.run("date");
    expect(h.out[0]).toBe("현재 날짜: 2026-08-07 금");
  });

  it("time은 12시간제로 적는다", () => {
    h.run("time");
    expect(h.out[0]).toBe("현재 시간: 오후 9:41:05.03");
  });
});

describe("title", () => {
  it("창 제목을 바꾼다", () => {
    h.run("title 내 터미널");
    expect(h.calls).toEqual(["setTitle:내 터미널"]);
  });

  it("인자가 없으면 기본 제목으로 되돌린다", () => {
    h.run("title");
    expect(h.calls).toEqual(["setTitle:명령 프롬프트"]);
  });
});

describe("앱 실행", () => {
  it("notepad는 빈 메모장을 연다", () => {
    h.run("notepad");
    expect(h.calls).toEqual(["open:notepad"]);
  });

  it("notepad에 파일을 주면 그 파일을 연다", () => {
    h.fsm.fs.writeFile(`${h.fsm.HOME}\\메모.txt`, "x");
    h.run("notepad 메모.txt");
    expect(h.calls).toEqual([`open:notepad:${h.fsm.HOME}\\메모.txt`]);
  });

  it("notepad에 폴더를 주면 빈 메모장", () => {
    h.run("notepad 문서");
    expect(h.calls).toEqual(["open:notepad"]);
  });

  it("explorer는 기본으로 홈 화면을 연다", () => {
    h.run("explorer");
    expect(h.calls).toEqual([`open:explorer:${h.fsm.HOME_VIEW}`]);
  });

  it("explorer에 폴더를 주면 그 폴더를 연다", () => {
    h.run("explorer 문서");
    expect(h.calls).toEqual([`open:explorer:${h.fsm.DOCUMENTS_DIR}`]);
  });

  it("explorer에 파일을 주면 홈 화면으로 떨어진다", () => {
    h.fsm.fs.writeFile(`${h.fsm.HOME}\\a.txt`, "x");
    h.run("explorer a.txt");
    expect(h.calls).toEqual([`open:explorer:${h.fsm.HOME_VIEW}`]);
  });

  it("cmd는 새 터미널을 연다", () => {
    h.run("cmd");
    expect(h.calls).toEqual(["open:terminal"]);
  });
});

describe("start", () => {
  it("start notepad", () => {
    h.run("start notepad");
    expect(h.calls).toEqual(["open:notepad"]);
  });

  it("start cmd", () => {
    h.run("start cmd");
    expect(h.calls).toEqual(["open:terminal"]);
  });

  it("start explorer", () => {
    h.run("start explorer");
    expect(h.calls).toEqual([`open:explorer:${h.fsm.HOME_VIEW}`]);
  });

  it("인자 없는 start는 탐색기", () => {
    h.run("start");
    expect(h.calls).toEqual([`open:explorer:${h.fsm.HOME_VIEW}`]);
  });

  it("모르는 대상은 안내를 낸다", () => {
    h.run("start 없음");
    expect(h.out[0]).toContain("'없음'을(를) 찾을 수 없습니다");
    expect(h.calls).toEqual([]);
  });
});

describe("shutdown", () => {
  it("/s는 창을 모두 닫고 종료한다", () => {
    h.run("shutdown /s");
    expect(h.calls).toEqual(["closeAll", "shutdown"]);
  });

  it("-s도 같다", () => {
    h.run("shutdown -s");
    expect(h.calls).toEqual(["closeAll", "shutdown"]);
  });

  it("/r는 다시 시작", () => {
    h.run("shutdown /r");
    expect(h.calls).toEqual(["closeAll", "restart"]);
  });

  it("-r도 같다", () => {
    h.run("shutdown -r");
    expect(h.calls).toEqual(["closeAll", "restart"]);
  });

  it("플래그가 없으면 사용법만 낸다", () => {
    h.run("shutdown");
    expect(h.out[0]).toBe("사용법: shutdown [/s | /r]");
    expect(h.calls).toEqual([]);
  });
});

describe("format", () => {
  it("드라이브가 없으면 안내", () => {
    h.run("format");
    expect(h.out[0]).toContain("드라이브 문자를 지정하십시오");
    expect(h.calls).toEqual([]);
  });

  it("C: 외의 드라이브는 거부", () => {
    h.run("format d:");
    expect(h.out[0]).toBe("지정한 드라이브를 찾을 수 없습니다.");
    expect(h.calls).toEqual([]);
  });

  it("format c:는 경고 후 확인 상태로 넘긴다", () => {
    h.run("format c:");
    expect(h.out[0]).toContain("경고");
    expect(h.calls).toEqual(["confirmFormat"]);
  });

  it("대문자 C:도 받는다", () => {
    h.run("format C:");
    expect(h.calls).toEqual(["confirmFormat"]);
  });
});

describe("명령 이름 대소문자", () => {
  it("대문자로 써도 동작한다", () => {
    h.run("VER");
    expect(h.out[1]).toBe(h.cmds.VERSION_LINE);
  });

  it("섞어 써도 동작한다", () => {
    h.run("WhoAmI");
    expect(h.out[0]).toBe("desktop-smk94\\smkim94");
  });
});

describe("displayCwd", () => {
  it("드라이브 루트는 역슬래시를 붙여 보여준다", () => {
    expect(h.cmds.displayCwd("C:")).toBe("C:\\");
  });

  it("그 외에는 그대로", () => {
    expect(h.cmds.displayCwd("C:\\Users")).toBe("C:\\Users");
  });
});

describe("unquote", () => {
  it("감싼 큰따옴표를 벗긴다", () => {
    expect(h.cmds.unquote('"바탕 화면"')).toBe("바탕 화면");
  });

  it("따옴표가 없으면 그대로", () => {
    expect(h.cmds.unquote("문서")).toBe("문서");
  });
});
