import { describe, expect, it } from "vitest";
import {
  baseName,
  byteSize,
  formatDateTime,
  isTextFile,
  parentPath,
  resolvePath,
  splitPath,
} from "./filesystem";

describe("splitPath", () => {
  it("역슬래시 경로를 세그먼트로 나눈다", () => {
    expect(splitPath("C:\\Users\\SMKim94")).toEqual(["C:", "Users", "SMKim94"]);
  });

  it("슬래시도 역슬래시처럼 받아준다", () => {
    expect(splitPath("C:/Users/SMKim94")).toEqual(["C:", "Users", "SMKim94"]);
  });

  it("연속 구분자와 끝 구분자로 생긴 빈 세그먼트를 버린다", () => {
    expect(splitPath("C:\\\\Users\\")).toEqual(["C:", "Users"]);
  });

  it("빈 문자열은 빈 배열", () => {
    expect(splitPath("")).toEqual([]);
  });
});

describe("resolvePath", () => {
  it("상대 경로를 base 기준으로 붙인다", () => {
    expect(resolvePath("C:\\Users", "SMKim94")).toBe("C:\\Users\\SMKim94");
  });

  it("절대 경로가 오면 base를 무시한다", () => {
    expect(resolvePath("C:\\Users", "C:\\Windows")).toBe("C:\\Windows");
  });

  it("역슬래시로 시작하면 드라이브 루트 기준", () => {
    expect(resolvePath("C:\\Users\\SMKim94", "\\Windows")).toBe("C:\\Windows");
  });

  it("..은 한 단계 올라간다", () => {
    expect(resolvePath("C:\\Users\\SMKim94", "..")).toBe("C:\\Users");
  });

  it(".은 제자리", () => {
    expect(resolvePath("C:\\Users", ".")).toBe("C:\\Users");
  });

  it("..을 아무리 써도 드라이브 루트 위로는 못 간다", () => {
    expect(resolvePath("C:\\Users", "..\\..\\..\\..")).toBe("C:");
  });

  it("루트 위로 넘친 뒤 이어지는 경로도 드라이브 루트 기준으로 붙는다", () => {
    // ..이 깊이보다 많아도 세그먼트를 잃지 않아야 한다
    expect(resolvePath("C:\\Users", "..\\..\\..\\Windows")).toBe("C:\\Windows");
  });

  it("드라이브 문자는 대문자로 정규화한다", () => {
    expect(resolvePath("C:", "c:\\users")).toBe("C:\\users");
  });

  it("여러 단계와 ..을 섞어도 정리된다", () => {
    expect(resolvePath("C:\\Users\\SMKim94", "..\\..\\Windows\\System32")).toBe(
      "C:\\Windows\\System32",
    );
  });

  it("앞뒤 공백을 무시한다", () => {
    expect(resolvePath("C:\\Users", "  SMKim94  ")).toBe("C:\\Users\\SMKim94");
  });
});

describe("parentPath", () => {
  it("한 단계 위 경로를 준다", () => {
    expect(parentPath("C:\\Users\\SMKim94")).toBe("C:\\Users");
  });

  it("드라이브 루트의 부모는 자기 자신", () => {
    expect(parentPath("C:")).toBe("C:");
  });
});

describe("baseName", () => {
  it("마지막 세그먼트를 준다", () => {
    expect(baseName("C:\\Users\\메모.txt")).toBe("메모.txt");
  });

  it("빈 경로는 C:로 떨어진다", () => {
    expect(baseName("")).toBe("C:");
  });
});

describe("isTextFile", () => {
  it.each(["a.txt", "b.MD", "c.log", "d.ini", "e.json", "f.bat", "g.csv"])(
    "%s는 텍스트로 본다",
    (name) => {
      expect(isTextFile(name)).toBe(true);
    },
  );

  it.each(["a.exe", "b.png", "확장자없음", "c.txt.exe"])(
    "%s는 텍스트가 아니다",
    (name) => {
      expect(isTextFile(name)).toBe(false);
    },
  );
});

describe("formatDateTime", () => {
  // 로컬 시각으로 만들고 로컬 시각으로 포맷하므로 타임존과 무관하게 성립한다.
  it("오후 시각을 12시간제로 적는다", () => {
    const d = new Date(2026, 7, 7, 21, 41);
    expect(formatDateTime(d.getTime())).toBe("2026-08-07 오후 09:41");
  });

  it("오전 시각", () => {
    const d = new Date(2026, 0, 3, 9, 5);
    expect(formatDateTime(d.getTime())).toBe("2026-01-03 오전 09:05");
  });

  it("자정은 오전 12시", () => {
    const d = new Date(2026, 7, 7, 0, 0);
    expect(formatDateTime(d.getTime())).toBe("2026-08-07 오전 12:00");
  });

  it("정오는 오후 12시", () => {
    const d = new Date(2026, 7, 7, 12, 0);
    expect(formatDateTime(d.getTime())).toBe("2026-08-07 오후 12:00");
  });
});

describe("byteSize", () => {
  it("아스키는 글자당 1바이트", () => {
    expect(byteSize("hello")).toBe(5);
  });

  it("한글은 글자당 3바이트(UTF-8)", () => {
    expect(byteSize("한글")).toBe(6);
  });

  it("빈 문자열은 0", () => {
    expect(byteSize("")).toBe(0);
  });
});
