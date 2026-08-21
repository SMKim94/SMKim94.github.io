import { beforeEach, describe, expect, it, vi } from "vitest";

type FsModule = typeof import("./filesystem");

/**
 * filesystem.ts는 모듈 로드 시점에 스토어 싱글턴을 만든다.
 * 테스트마다 모듈을 다시 불러 상태가 새지 않게 한다.
 */
async function freshFs(): Promise<FsModule> {
  localStorage.clear();
  vi.resetModules();
  return import("./filesystem");
}

let m: FsModule;
beforeEach(async () => {
  m = await freshFs();
});

describe("기본 트리", () => {
  it("사용자 폴더가 준비되어 있다", () => {
    expect(m.fs.exists(m.HOME)).toBe(true);
    expect(m.fs.exists(m.DESKTOP_DIR)).toBe(true);
    expect(m.fs.exists(m.DOCUMENTS_DIR)).toBe(true);
  });

  it("Windows 실행 파일들이 있다", () => {
    expect(m.fs.exists("C:\\Windows\\System32\\cmd.exe")).toBe(true);
    expect(m.fs.exists("C:\\Windows\\explorer.exe")).toBe(true);
  });

  it("없는 경로는 exists가 false", () => {
    expect(m.fs.exists("C:\\없는폴더")).toBe(false);
  });

  it("C: 이외의 드라이브는 인식하지 않는다", () => {
    expect(m.fs.getNode("D:\\Users")).toBeNull();
  });
});

describe("조회", () => {
  it("경로 대소문자를 가리지 않는다", () => {
    expect(m.fs.exists("c:\\windows\\system32\\CMD.EXE")).toBe(true);
  });

  it("getFolder는 파일에 대해 null", () => {
    expect(m.fs.getFolder("C:\\Windows\\explorer.exe")).toBeNull();
  });

  it("readFile은 폴더에 대해 null", () => {
    expect(m.fs.readFile("C:\\Windows")).toBeNull();
  });

  it("canonicalize는 실제 이름의 대소문자를 되살린다", () => {
    expect(m.fs.canonicalize("c:\\windows\\system32")).toBe(
      "C:\\Windows\\System32",
    );
  });

  it("canonicalize는 없는 경로에 null", () => {
    expect(m.fs.canonicalize("C:\\없음")).toBeNull();
  });

  it("list는 폴더를 파일보다 앞에 둔다", () => {
    m.fs.writeFile(`${m.DESKTOP_DIR}\\zzz.txt`, "");
    m.fs.mkdir(`${m.DESKTOP_DIR}\\hhh폴더`);
    const names = m.fs.list(m.DESKTOP_DIR);
    expect(names[0].type).toBe("folder");
    expect(names[names.length - 1].type).toBe("file");
  });

  it("list는 없는 폴더에 빈 배열", () => {
    expect(m.fs.list("C:\\없음")).toEqual([]);
  });
});

describe("writeFile", () => {
  it("새 파일을 만든다", () => {
    const path = `${m.DOCUMENTS_DIR}\\메모.txt`;
    expect(m.fs.writeFile(path, "안녕")).toBe(true);
    expect(m.fs.readFile(path)).toBe("안녕");
  });

  it("기존 파일을 덮어쓴다", () => {
    const path = `${m.DOCUMENTS_DIR}\\메모.txt`;
    m.fs.writeFile(path, "처음");
    m.fs.writeFile(path, "나중");
    expect(m.fs.readFile(path)).toBe("나중");
    expect(m.fs.list(m.DOCUMENTS_DIR)).toHaveLength(1);
  });

  it("부모 폴더가 없으면 실패한다", () => {
    expect(m.fs.writeFile("C:\\없는폴더\\a.txt", "x")).toBe(false);
  });

  it("같은 이름의 폴더가 있으면 실패한다", () => {
    m.fs.mkdir(`${m.DOCUMENTS_DIR}\\충돌`);
    expect(m.fs.writeFile(`${m.DOCUMENTS_DIR}\\충돌`, "x")).toBe(false);
  });
});

describe("mkdir", () => {
  it("폴더를 만든다", () => {
    expect(m.fs.mkdir(`${m.DOCUMENTS_DIR}\\새폴더`)).toEqual({ ok: true });
    expect(m.fs.exists(`${m.DOCUMENTS_DIR}\\새폴더`)).toBe(true);
  });

  it("이미 있으면 오류 메시지를 준다", () => {
    m.fs.mkdir(`${m.DOCUMENTS_DIR}\\중복`);
    const r = m.fs.mkdir(`${m.DOCUMENTS_DIR}\\중복`);
    expect(r.ok).toBe(false);
    expect(r.error).toContain("이미 있습니다");
  });

  it("부모가 없으면 오류", () => {
    const r = m.fs.mkdir("C:\\없는폴더\\하위");
    expect(r.ok).toBe(false);
    expect(r.error).toContain("찾을 수 없습니다");
  });
});

describe("createUnique", () => {
  it("겹치지 않으면 이름 그대로", () => {
    expect(m.fs.createUnique(m.DESKTOP_DIR, "새 폴더", "folder")).toBe(
      "새 폴더",
    );
  });

  it("겹치면 (2), (3)으로 번호를 올린다", () => {
    m.fs.createUnique(m.DESKTOP_DIR, "새 폴더", "folder");
    expect(m.fs.createUnique(m.DESKTOP_DIR, "새 폴더", "folder")).toBe(
      "새 폴더 (2)",
    );
    expect(m.fs.createUnique(m.DESKTOP_DIR, "새 폴더", "folder")).toBe(
      "새 폴더 (3)",
    );
  });

  it("확장자는 번호 뒤가 아니라 끝에 붙는다", () => {
    m.fs.createUnique(m.DESKTOP_DIR, "새 파일", "file", ".txt");
    expect(m.fs.createUnique(m.DESKTOP_DIR, "새 파일", "file", ".txt")).toBe(
      "새 파일 (2).txt",
    );
  });

  it("없는 폴더에는 null", () => {
    expect(m.fs.createUnique("C:\\없음", "새 폴더", "folder")).toBeNull();
  });
});

describe("휴지통", () => {
  const target = () => `${m.DESKTOP_DIR}\\지울것.txt`;

  it("삭제하면 원래 위치에서 사라지고 휴지통에 쌓인다", () => {
    m.fs.writeFile(target(), "내용");
    expect(m.fs.remove(target())).toBe(true);
    expect(m.fs.exists(target())).toBe(false);
    expect(m.fs.recycle).toHaveLength(1);
    expect(m.fs.recycle[0].node.name).toBe("지울것.txt");
  });

  it("없는 파일 삭제는 false", () => {
    expect(m.fs.remove(`${m.DESKTOP_DIR}\\없음.txt`)).toBe(false);
  });

  it("복원하면 원래 위치로 돌아오고 내용이 유지된다", () => {
    m.fs.writeFile(target(), "내용");
    m.fs.remove(target());
    expect(m.fs.restore(m.fs.recycle[0].id)).toBe(true);
    expect(m.fs.readFile(target())).toBe("내용");
    expect(m.fs.recycle).toHaveLength(0);
  });

  it("같은 이름이 다시 생겼으면 (복원)을 붙인다", () => {
    m.fs.writeFile(target(), "옛날");
    m.fs.remove(target());
    m.fs.writeFile(target(), "새것");
    m.fs.restore(m.fs.recycle[0].id);
    expect(m.fs.readFile(target())).toBe("새것");
    expect(m.fs.readFile(`${m.DESKTOP_DIR}\\지울것.txt (복원)`)).toBe("옛날");
  });

  it("원래 폴더가 사라졌으면 경로를 다시 만들어 복원한다", () => {
    const dir = `${m.DESKTOP_DIR}\\작업`;
    m.fs.mkdir(dir);
    m.fs.writeFile(`${dir}\\파일.txt`, "내용");
    m.fs.remove(`${dir}\\파일.txt`);
    m.fs.remove(dir);
    expect(m.fs.exists(dir)).toBe(false);

    const fileItem = m.fs.recycle.find((r) => r.node.name === "파일.txt");
    expect(fileItem).toBeDefined();
    expect(m.fs.restore(fileItem!.id)).toBe(true);
    expect(m.fs.readFile(`${dir}\\파일.txt`)).toBe("내용");
  });

  it("없는 id 복원은 false", () => {
    expect(m.fs.restore(99999)).toBe(false);
  });

  it("비우면 전부 사라진다", () => {
    m.fs.writeFile(target(), "x");
    m.fs.remove(target());
    m.fs.emptyRecycle();
    expect(m.fs.recycle).toHaveLength(0);
  });

  it("폴더를 지우면 하위 내용까지 함께 보관된다", () => {
    const dir = `${m.DESKTOP_DIR}\\묶음`;
    m.fs.mkdir(dir);
    m.fs.writeFile(`${dir}\\안쪽.txt`, "속내용");
    m.fs.remove(dir);
    m.fs.restore(m.fs.recycle[0].id);
    expect(m.fs.readFile(`${dir}\\안쪽.txt`)).toBe("속내용");
  });
});

describe("collectFiles", () => {
  it("하위 폴더의 파일까지 모은다", () => {
    m.fs.writeFile(`${m.DESKTOP_DIR}\\a.txt`, "");
    m.fs.mkdir(`${m.DESKTOP_DIR}\\하위`);
    m.fs.writeFile(`${m.DESKTOP_DIR}\\하위\\b.txt`, "");
    const found = m.fs.collectFiles(m.DESKTOP_DIR).map((f) => f.path);
    expect(found).toContain(`${m.DESKTOP_DIR}\\a.txt`);
    expect(found).toContain(`${m.DESKTOP_DIR}\\하위\\b.txt`);
  });

  it("limit을 넘기지 않는다", () => {
    for (let i = 0; i < 10; i++) {
      m.fs.writeFile(`${m.DESKTOP_DIR}\\f${i}.txt`, "");
    }
    expect(m.fs.collectFiles(m.DESKTOP_DIR, 4)).toHaveLength(4);
  });

  it("없는 폴더는 빈 배열", () => {
    expect(m.fs.collectFiles("C:\\없음")).toEqual([]);
  });
});

describe("구독", () => {
  it("변경이 있으면 구독자에게 알리고 버전이 오른다", () => {
    const spy = vi.fn();
    const unsubscribe = m.fs.subscribe(spy);
    const before = m.fs.getVersion();

    m.fs.mkdir(`${m.DESKTOP_DIR}\\알림`);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(m.fs.getVersion()).toBeGreaterThan(before);

    unsubscribe();
    m.fs.mkdir(`${m.DESKTOP_DIR}\\알림2`);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe("localStorage 영속화", () => {
  it("변경 후 잠시 뒤 저장된다", async () => {
    vi.useFakeTimers();
    try {
      m.fs.writeFile(`${m.DOCUMENTS_DIR}\\저장.txt`, "내용");
      expect(localStorage.getItem("smk-os.fs.v1")).toBeNull();
      vi.advanceTimersByTime(300);
      expect(localStorage.getItem("smk-os.fs.v1")).toContain("저장.txt");
    } finally {
      vi.useRealTimers();
    }
  });

  it("저장본이 손상됐으면 기본 트리로 시작한다", async () => {
    localStorage.setItem("smk-os.fs.v1", "{망가진 JSON");
    vi.resetModules();
    const reloaded = await import("./filesystem");
    expect(reloaded.fs.exists(reloaded.HOME)).toBe(true);
  });
});
