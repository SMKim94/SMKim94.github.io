import { useSyncExternalStore } from "react";

/**
 * 가짜 파일시스템.
 * 파일 탐색기·메모장·명령 프롬프트가 이 트리 하나를 공유해서,
 * 어디서 바꾸든 서로에게 즉시 반영된다. localStorage에 영속화.
 */

export interface FsFile {
  type: "file";
  name: string;
  content: string;
  mtime: number;
}

export interface FsFolder {
  type: "folder";
  name: string;
  children: FsNode[];
  mtime: number;
}

export type FsNode = FsFile | FsFolder;

export interface RecycleItem {
  id: number;
  node: FsNode;
  /** 삭제 전에 있던 폴더 경로 */
  originalDir: string;
  deletedAt: number;
}

export const HOME = "C:\\Users\\SMKim94";
export const DESKTOP_DIR = `${HOME}\\바탕 화면`;
export const DOCUMENTS_DIR = `${HOME}\\문서`;
/** 탐색기에서 휴지통을 나타내는 가상 경로 */
export const RECYCLE_PATH = "recycle:";
/** 탐색기 홈(빠른 액세스) 가상 경로 */
export const HOME_VIEW = "home:";

const STORAGE_KEY = "smk-os.fs.v1";

function folder(name: string, children: FsNode[] = []): FsFolder {
  return { type: "folder", name, children, mtime: Date.now() };
}

function file(name: string, content = ""): FsFile {
  return { type: "file", name, content, mtime: Date.now() };
}

function defaultRoot(): FsFolder {
  return folder("C:", [
    folder("Program Files"),
    folder("Windows", [
      file("explorer.exe"),
      folder("System32", [file("cmd.exe"), file("notepad.exe")]),
    ]),
    folder("Users", [
      folder("SMKim94", [
        folder("바탕 화면"),
        folder("문서"),
        folder("다운로드"),
        folder("사진"),
        folder("음악"),
        folder("동영상"),
      ]),
    ]),
  ]);
}

/** 경로 문자열 → 세그먼트 배열 ("C:\Users\A" → ["C:","Users","A"]) */
export function splitPath(path: string): string[] {
  return path
    .replace(/\//g, "\\")
    .split("\\")
    .filter((s) => s.length > 0);
}

/** base(절대 경로) 기준으로 input(상대/절대)을 절대 경로로 해석 */
export function resolvePath(base: string, input: string): string {
  const norm = input.replace(/\//g, "\\").trim();
  let segs: string[];
  if (/^[a-z]:/i.test(norm)) segs = splitPath(norm);
  else if (norm.startsWith("\\")) segs = ["C:", ...splitPath(norm)];
  else segs = [...splitPath(base), ...splitPath(norm)];

  const out: string[] = [];
  for (const s of segs) {
    if (s === ".") continue;
    if (s === "..") {
      if (out.length > 1) out.pop();
      continue;
    }
    out.push(s);
  }
  if (out.length === 0) return "C:";
  out[0] = out[0].toUpperCase();
  return out.join("\\");
}

export function parentPath(path: string): string {
  const segs = splitPath(path);
  if (segs.length <= 1) return "C:";
  return segs.slice(0, -1).join("\\");
}

export function baseName(path: string): string {
  const segs = splitPath(path);
  return segs[segs.length - 1] ?? "C:";
}

export function isTextFile(name: string): boolean {
  return /\.(txt|md|log|ini|json|bat|csv)$/i.test(name);
}

/** "2026-08-07 오후 09:41" 형태 (탐색기·dir 출력용) */
export function formatDateTime(ms: number): string {
  const d = new Date(ms);
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  let h = d.getHours();
  const ampm = h < 12 ? "오전" : "오후";
  h = h % 12 === 0 ? 12 : h % 12;
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${mo}-${da} ${ampm} ${String(h).padStart(2, "0")}:${mi}`;
}

export function byteSize(content: string): number {
  return new TextEncoder().encode(content).length;
}

interface Persisted {
  root: FsFolder;
  recycle: RecycleItem[];
  recycleSeq: number;
}

type Listener = () => void;

class FsStore {
  root: FsFolder;
  recycle: RecycleItem[] = [];
  private recycleSeq = 1;
  private listeners = new Set<Listener>();
  private version = 0;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.root = defaultRoot();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as Persisted;
        if (data.root?.type === "folder") {
          this.root = data.root;
          this.recycle = data.recycle ?? [];
          this.recycleSeq = data.recycleSeq ?? 1;
        }
      }
    } catch {
      /* 손상된 저장본은 무시하고 기본값 사용 */
    }
  }

  subscribe = (fn: Listener): (() => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };

  getVersion = (): number => this.version;

  private commit() {
    this.version++;
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => {
      try {
        const data: Persisted = {
          root: this.root,
          recycle: this.recycle,
          recycleSeq: this.recycleSeq,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        /* 저장 실패(용량 등)는 무시 */
      }
    }, 250);
    for (const fn of this.listeners) fn();
  }

  // ── 조회 ──────────────────────────────────────────────

  getNode(path: string): FsNode | null {
    const segs = splitPath(path);
    if (segs.length === 0) return null;
    if (segs[0].toUpperCase() !== "C:") return null;
    let cur: FsNode = this.root;
    for (const seg of segs.slice(1)) {
      if (cur.type !== "folder") return null;
      const next: FsNode | undefined = cur.children.find(
        (c) => c.name.toLowerCase() === seg.toLowerCase(),
      );
      if (!next) return null;
      cur = next;
    }
    return cur;
  }

  getFolder(path: string): FsFolder | null {
    const n = this.getNode(path);
    return n && n.type === "folder" ? n : null;
  }

  exists(path: string): boolean {
    return this.getNode(path) !== null;
  }

  /** 정렬된 목록: 폴더 먼저, 이름순 */
  list(path: string): FsNode[] {
    const f = this.getFolder(path);
    if (!f) return [];
    return [...f.children].sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name, "ko");
    });
  }

  readFile(path: string): string | null {
    const n = this.getNode(path);
    return n && n.type === "file" ? n.content : null;
  }

  /** 실제 노드 이름 대소문자로 경로를 재구성 (cd 등에서 사용) */
  canonicalize(path: string): string | null {
    const segs = splitPath(path);
    if (segs.length === 0 || segs[0].toUpperCase() !== "C:") return null;
    const out: string[] = ["C:"];
    let cur: FsNode = this.root;
    for (const seg of segs.slice(1)) {
      if (cur.type !== "folder") return null;
      const next: FsNode | undefined = cur.children.find(
        (c) => c.name.toLowerCase() === seg.toLowerCase(),
      );
      if (!next) return null;
      out.push(next.name);
      cur = next;
    }
    return out.join("\\");
  }

  /** 하위 파일 전체 수집 (최근 항목 등에 사용) */
  collectFiles(path = "C:", limit = 200): { path: string; file: FsFile }[] {
    const result: { path: string; file: FsFile }[] = [];
    const walk = (dir: FsFolder, dirPath: string) => {
      for (const child of dir.children) {
        if (result.length >= limit) return;
        const childPath = `${dirPath}\\${child.name}`;
        if (child.type === "file") result.push({ path: childPath, file: child });
        else walk(child, childPath);
      }
    };
    const start = this.getFolder(path);
    if (start) walk(start, splitPath(path).join("\\"));
    return result;
  }

  // ── 변경 ──────────────────────────────────────────────

  /** 파일 저장(없으면 생성). 부모 폴더가 없으면 실패. */
  writeFile(path: string, content: string): boolean {
    const parent = this.getFolder(parentPath(path));
    if (!parent) return false;
    const name = baseName(path);
    const existing = parent.children.find(
      (c) => c.name.toLowerCase() === name.toLowerCase(),
    );
    if (existing) {
      if (existing.type !== "file") return false;
      existing.content = content;
      existing.mtime = Date.now();
    } else {
      parent.children.push(file(name, content));
      parent.mtime = Date.now();
    }
    this.commit();
    return true;
  }

  mkdir(path: string): { ok: boolean; error?: string } {
    const parent = this.getFolder(parentPath(path));
    if (!parent) return { ok: false, error: "지정된 경로를 찾을 수 없습니다." };
    const name = baseName(path);
    if (
      parent.children.some((c) => c.name.toLowerCase() === name.toLowerCase())
    ) {
      return {
        ok: false,
        error: `하위 디렉터리 또는 파일 ${name}이(가) 이미 있습니다.`,
      };
    }
    parent.children.push(folder(name));
    parent.mtime = Date.now();
    this.commit();
    return { ok: true };
  }

  /** "새 폴더", "새 폴더 (2)" … 처럼 겹치지 않는 이름으로 생성 */
  createUnique(
    dirPath: string,
    base: string,
    kind: "folder" | "file",
    ext = "",
  ): string | null {
    const parent = this.getFolder(dirPath);
    if (!parent) return null;
    const taken = new Set(parent.children.map((c) => c.name.toLowerCase()));
    let name = `${base}${ext}`;
    for (let i = 2; taken.has(name.toLowerCase()); i++) {
      name = `${base} (${i})${ext}`;
    }
    parent.children.push(kind === "folder" ? folder(name) : file(name));
    parent.mtime = Date.now();
    this.commit();
    return name;
  }

  /** 휴지통으로 이동 */
  remove(path: string): boolean {
    const dir = parentPath(path);
    const parent = this.getFolder(dir);
    if (!parent) return false;
    const name = baseName(path);
    const idx = parent.children.findIndex(
      (c) => c.name.toLowerCase() === name.toLowerCase(),
    );
    if (idx < 0) return false;
    const [node] = parent.children.splice(idx, 1);
    parent.mtime = Date.now();
    this.recycle.unshift({
      id: this.recycleSeq++,
      node,
      originalDir: this.canonicalize(dir) ?? dir,
      deletedAt: Date.now(),
    });
    this.commit();
    return true;
  }

  restore(id: number): boolean {
    const idx = this.recycle.findIndex((r) => r.id === id);
    if (idx < 0) return false;
    const item = this.recycle[idx];
    // 원래 폴더가 사라졌으면 경로를 다시 만들어준다
    let dir = this.getFolder(item.originalDir);
    if (!dir) {
      const segs = splitPath(item.originalDir);
      let cur: FsFolder = this.root;
      for (const seg of segs.slice(1)) {
        let next: FsFolder | undefined = cur.children.find(
          (c): c is FsFolder =>
            c.type === "folder" &&
            c.name.toLowerCase() === seg.toLowerCase(),
        );
        if (!next) {
          next = folder(seg);
          cur.children.push(next);
        }
        cur = next;
      }
      dir = cur;
    }
    // 이름 충돌 시 " (복원)" 붙이기
    if (
      dir.children.some(
        (c) => c.name.toLowerCase() === item.node.name.toLowerCase(),
      )
    ) {
      item.node.name = `${item.node.name} (복원)`;
    }
    dir.children.push(item.node);
    dir.mtime = Date.now();
    this.recycle.splice(idx, 1);
    this.commit();
    return true;
  }

  emptyRecycle(): void {
    if (this.recycle.length === 0) return;
    this.recycle = [];
    this.commit();
  }
}

export const fs = new FsStore();

/** FS 변경 시 리렌더를 유발하는 훅 — 반환값(버전)은 무시해도 된다 */
export function useFsVersion(): number {
  return useSyncExternalStore(fs.subscribe, fs.getVersion);
}
