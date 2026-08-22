import {
  HOME_VIEW,
  PC_VIEW,
  RECYCLE_PATH,
  baseName,
  splitPath,
  type FsNode,
} from "../os/filesystem";

/**
 * 파일 탐색기의 순수 로직 — 주소 이력, 브레드크럼, 검색 필터.
 *
 * 컴포넌트에 두면 검사할 방법이 없는데, 특히 이력 스택은 브라우저처럼
 * "뒤로 간 뒤 새 곳으로 가면 앞쪽을 잘라낸다"는 규칙이 있어 조용히 깨지기 쉽다.
 * 렌더링과 무관한 부분만 여기로 뺀다.
 */

/** 주소 이력: stack[idx]가 현재 위치 */
export interface History {
  readonly stack: readonly string[];
  readonly idx: number;
}

export function initHistory(path: string): History {
  return { stack: [path], idx: 0 };
}

export function currentPath(h: History): string {
  return h.stack[h.idx];
}

/**
 * 새 위치로 이동. 뒤로 간 상태였다면 앞쪽 이력은 버린다(브라우저와 같다).
 */
export function navigate(h: History, path: string): History {
  return {
    stack: [...h.stack.slice(0, h.idx + 1), path],
    idx: h.idx + 1,
  };
}

export function canBack(h: History): boolean {
  return h.idx > 0;
}

export function canFwd(h: History): boolean {
  return h.idx < h.stack.length - 1;
}

/** 뒤로. 갈 곳이 없으면 그대로 둔다. */
export function back(h: History): History {
  return canBack(h) ? { ...h, idx: h.idx - 1 } : h;
}

/** 앞으로. 갈 곳이 없으면 그대로 둔다. */
export function forward(h: History): History {
  return canFwd(h) ? { ...h, idx: h.idx + 1 } : h;
}

/** 홈 화면에서는 더 올라갈 곳이 없다 */
export function canUp(path: string): boolean {
  return path !== HOME_VIEW;
}

/**
 * 위로 갈 대상 경로. 올라갈 곳이 없으면 null.
 * 휴지통과 드라이브 루트에서는 홈 화면으로 돌아간다.
 */
export function upFrom(path: string): string | null {
  if (path === HOME_VIEW) return null;
  if (path === RECYCLE_PATH || path === PC_VIEW) return HOME_VIEW;
  // 드라이브 루트의 위는 "내 PC"다 (Win11과 같은 계층)
  if (path === "C:") return PC_VIEW;
  return splitPath(path).slice(0, -1).join("\\");
}

/** 창 제목과 브레드크럼에 쓰는 이름 */
export function displayName(path: string): string {
  if (path === HOME_VIEW) return "홈";
  if (path === PC_VIEW) return "내 PC";
  if (path === RECYCLE_PATH) return "휴지통";
  if (path === "C:") return "로컬 디스크 (C:)";
  return baseName(path);
}

export interface Crumb {
  label: string;
  path: string;
}

/** 주소 표시줄의 조각들 */
export function crumbsFor(path: string): Crumb[] {
  if (path === HOME_VIEW) return [{ label: "홈", path: HOME_VIEW }];
  if (path === PC_VIEW) return [{ label: "내 PC", path: PC_VIEW }];
  if (path === RECYCLE_PATH) return [{ label: "휴지통", path: RECYCLE_PATH }];
  const segs = splitPath(path);
  return [
    { label: "내 PC", path: PC_VIEW },
    ...segs.map((s, i) => ({
      label: i === 0 ? "로컬 디스크 (C:)" : s,
      path: segs.slice(0, i + 1).join("\\"),
    })),
  ];
}

/** 검색 상자 필터. 대소문자를 가리지 않고, 공백만 입력하면 거르지 않는다. */
export function filterItems(items: FsNode[], q: string): FsNode[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return items;
  return items.filter((n) => n.name.toLowerCase().includes(needle));
}

/** 홈 화면·내 PC·휴지통에는 폴더 목록이 없다 (각자 다른 화면을 그린다) */
export function isVirtualPath(path: string): boolean {
  return path === HOME_VIEW || path === PC_VIEW || path === RECYCLE_PATH;
}
