import { describe, expect, it } from "vitest";
import {
  HOME,
  HOME_VIEW,
  PC_VIEW,
  RECYCLE_PATH,
  type FsNode,
} from "../os/filesystem";
import {
  back,
  canBack,
  canFwd,
  canUp,
  crumbsFor,
  currentPath,
  displayName,
  filterItems,
  forward,
  initHistory,
  isVirtualPath,
  navigate,
  upFrom,
} from "./explorerNav";

function file(name: string): FsNode {
  return { type: "file", name, content: "", mtime: 0 };
}
function folder(name: string): FsNode {
  return { type: "folder", name, children: [], mtime: 0 };
}

describe("initHistory", () => {
  it("주어진 경로 하나로 시작한다", () => {
    const h = initHistory(HOME_VIEW);
    expect(h.stack).toEqual([HOME_VIEW]);
    expect(h.idx).toBe(0);
    expect(currentPath(h)).toBe(HOME_VIEW);
  });

  it("시작 지점에서는 뒤로도 앞으로도 못 간다", () => {
    const h = initHistory(HOME);
    expect(canBack(h)).toBe(false);
    expect(canFwd(h)).toBe(false);
  });
});

describe("navigate", () => {
  it("새 위치를 쌓고 그리로 옮긴다", () => {
    const h = navigate(initHistory("A"), "B");
    expect(h.stack).toEqual(["A", "B"]);
    expect(currentPath(h)).toBe("B");
  });

  it("이동하면 뒤로 갈 수 있게 된다", () => {
    const h = navigate(initHistory("A"), "B");
    expect(canBack(h)).toBe(true);
    expect(canFwd(h)).toBe(false);
  });

  it("같은 곳으로 다시 가도 이력에 쌓인다", () => {
    const h = navigate(navigate(initHistory("A"), "B"), "B");
    expect(h.stack).toEqual(["A", "B", "B"]);
  });

  it("원본을 바꾸지 않는다", () => {
    const a = initHistory("A");
    navigate(a, "B");
    expect(a.stack).toEqual(["A"]);
    expect(a.idx).toBe(0);
  });
});

describe("back / forward", () => {
  const abc = navigate(navigate(initHistory("A"), "B"), "C");

  it("뒤로 가면 이전 위치", () => {
    expect(currentPath(back(abc))).toBe("B");
  });

  it("두 번 뒤로 가면 처음", () => {
    expect(currentPath(back(back(abc)))).toBe("A");
  });

  it("뒤로 간 뒤 앞으로 가면 되돌아온다", () => {
    expect(currentPath(forward(back(abc)))).toBe("C");
  });

  it("처음에서 더 뒤로 가려 하면 그대로 둔다", () => {
    const first = back(back(abc));
    expect(back(first)).toBe(first);
  });

  it("끝에서 더 앞으로 가려 하면 그대로 둔다", () => {
    expect(forward(abc)).toBe(abc);
  });

  it("스택 자체는 이동해도 유지된다", () => {
    expect(back(abc).stack).toEqual(["A", "B", "C"]);
  });
});

describe("뒤로 간 뒤 새 곳으로 이동", () => {
  // 브라우저와 같은 규칙: 앞쪽 이력을 버린다.
  const abc = navigate(navigate(initHistory("A"), "B"), "C");

  it("앞쪽 이력을 잘라낸다", () => {
    const h = navigate(back(abc), "D"); // A B [C] → A [B] → A B D
    expect(h.stack).toEqual(["A", "B", "D"]);
    expect(currentPath(h)).toBe("D");
  });

  it("잘라낸 뒤에는 앞으로 갈 수 없다", () => {
    const h = navigate(back(abc), "D");
    expect(canFwd(h)).toBe(false);
  });

  it("맨 처음까지 돌아가서 이동하면 하나만 남는다", () => {
    const h = navigate(back(back(abc)), "Z");
    expect(h.stack).toEqual(["A", "Z"]);
  });

  it("잘라낸 뒤에도 뒤로는 갈 수 있다", () => {
    const h = navigate(back(abc), "D");
    expect(currentPath(back(h))).toBe("B");
  });
});

describe("canUp / upFrom", () => {
  it("홈 화면에서는 올라갈 수 없다", () => {
    expect(canUp(HOME_VIEW)).toBe(false);
    expect(upFrom(HOME_VIEW)).toBeNull();
  });

  it("휴지통에서는 홈 화면으로", () => {
    expect(canUp(RECYCLE_PATH)).toBe(true);
    expect(upFrom(RECYCLE_PATH)).toBe(HOME_VIEW);
  });

  it("내 PC에서는 홈 화면으로", () => {
    expect(canUp(PC_VIEW)).toBe(true);
    expect(upFrom(PC_VIEW)).toBe(HOME_VIEW);
  });

  // Win11 계층: C:\\... 의 위는 드라이브 루트, 그 위는 내 PC, 그 위가 홈이다
  it("드라이브 루트의 위는 내 PC", () => {
    expect(upFrom("C:")).toBe(PC_VIEW);
  });

  it("보통 폴더는 상위 폴더로", () => {
    expect(upFrom(HOME)).toBe("C:\\Users");
  });

  it("한 단계씩 올라가 드라이브 루트까지 간다", () => {
    expect(upFrom("C:\\Users")).toBe("C:");
  });

  it("깊은 경로에서도 한 단계만 올라간다", () => {
    expect(upFrom("C:\\Users\\SMKim94\\문서\\가")).toBe(
      "C:\\Users\\SMKim94\\문서",
    );
  });
});

describe("displayName", () => {
  it("홈 화면", () => {
    expect(displayName(HOME_VIEW)).toBe("홈");
  });

  it("휴지통", () => {
    expect(displayName(RECYCLE_PATH)).toBe("휴지통");
  });

  it("드라이브 루트", () => {
    expect(displayName("C:")).toBe("로컬 디스크 (C:)");
  });

  it("내 PC", () => {
    expect(displayName(PC_VIEW)).toBe("내 PC");
  });

  it("보통 폴더는 마지막 이름", () => {
    expect(displayName(HOME)).toBe("SMKim94");
  });

  it("파일도 마지막 이름", () => {
    expect(displayName("C:\\Users\\메모.txt")).toBe("메모.txt");
  });
});

describe("crumbsFor", () => {
  it("홈 화면은 한 조각", () => {
    expect(crumbsFor(HOME_VIEW)).toEqual([{ label: "홈", path: HOME_VIEW }]);
  });

  it("휴지통도 한 조각", () => {
    expect(crumbsFor(RECYCLE_PATH)).toEqual([
      { label: "휴지통", path: RECYCLE_PATH },
    ]);
  });

  it("보통 경로는 내 PC로 시작한다", () => {
    expect(crumbsFor(HOME)[0]).toEqual({ label: "내 PC", path: PC_VIEW });
  });

  it("내 PC 화면은 한 조각", () => {
    expect(crumbsFor(PC_VIEW)).toEqual([{ label: "내 PC", path: PC_VIEW }]);
  });

  it("첫 세그먼트는 로컬 디스크로 적는다", () => {
    expect(crumbsFor(HOME)[1]).toEqual({
      label: "로컬 디스크 (C:)",
      path: "C:",
    });
  });

  it("각 조각이 그 지점까지의 경로를 가리킨다", () => {
    expect(crumbsFor(HOME)).toEqual([
      { label: "내 PC", path: PC_VIEW },
      { label: "로컬 디스크 (C:)", path: "C:" },
      { label: "Users", path: "C:\\Users" },
      { label: "SMKim94", path: "C:\\Users\\SMKim94" },
    ]);
  });

  it("드라이브 루트는 두 조각", () => {
    expect(crumbsFor("C:")).toHaveLength(2);
  });
});

describe("filterItems", () => {
  const items = [folder("문서"), file("메모.txt"), file("Report.PDF")];

  it("빈 검색어면 그대로 돌려준다", () => {
    expect(filterItems(items, "")).toBe(items);
  });

  it("공백만 입력해도 거르지 않는다", () => {
    expect(filterItems(items, "   ")).toBe(items);
  });

  it("이름 일부로 거른다", () => {
    expect(filterItems(items, "메모").map((n) => n.name)).toEqual(["메모.txt"]);
  });

  it("대소문자를 가리지 않는다", () => {
    expect(filterItems(items, "report").map((n) => n.name)).toEqual([
      "Report.PDF",
    ]);
  });

  it("검색어 앞뒤 공백은 무시한다", () => {
    expect(filterItems(items, "  메모  ")).toHaveLength(1);
  });

  it("맞는 게 없으면 빈 배열", () => {
    expect(filterItems(items, "없음")).toEqual([]);
  });

  it("확장자로도 걸린다", () => {
    expect(filterItems(items, ".txt")).toHaveLength(1);
  });

  it("폴더도 걸린다", () => {
    expect(filterItems(items, "문서").map((n) => n.name)).toEqual(["문서"]);
  });
});

describe("isVirtualPath", () => {
  it("홈 화면·내 PC·휴지통은 가상 경로", () => {
    expect(isVirtualPath(HOME_VIEW)).toBe(true);
    expect(isVirtualPath(PC_VIEW)).toBe(true);
    expect(isVirtualPath(RECYCLE_PATH)).toBe(true);
  });

  it("실제 폴더는 아니다", () => {
    expect(isVirtualPath(HOME)).toBe(false);
    expect(isVirtualPath("C:")).toBe(false);
  });
});
