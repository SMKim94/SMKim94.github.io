import { useEffect, useState, type MouseEvent } from "react";
import { openFile } from "../os/apps";
import { ContextMenu, type MenuItem } from "../os/ContextMenu";
import {
  DESKTOP_DIR,
  DOCUMENTS_DIR,
  HOME,
  HOME_VIEW,
  RECYCLE_PATH,
  baseName,
  formatDateTime,
  fs,
  splitPath,
  useFsVersion,
  type FsNode,
} from "../os/filesystem";
import { useWindows, type WinState } from "../os/WindowManager";
import {
  BackIcon,
  BinMonoIcon,
  ChevronDownIcon,
  CopyIcon,
  CutIcon,
  DocMonoIcon,
  DownloadIcon,
  ExeIcon,
  FileTextIcon,
  FolderIcon,
  ForwardIcon,
  HouseIcon,
  ImageIcon,
  MonitorIcon,
  MoreIcon,
  MusicIcon,
  PasteIcon,
  PcIcon,
  PlusIcon,
  RenameIcon,
  RestoreArrowIcon,
  SearchIcon,
  TrashIcon,
  UpIcon,
  VideoIcon,
} from "../os/icons";

const QUICK = [
  { label: "바탕 화면", path: DESKTOP_DIR, Icon: MonitorIcon },
  { label: "문서", path: DOCUMENTS_DIR, Icon: DocMonoIcon },
  { label: "다운로드", path: `${HOME}\\다운로드`, Icon: DownloadIcon },
  { label: "사진", path: `${HOME}\\사진`, Icon: ImageIcon },
  { label: "음악", path: `${HOME}\\음악`, Icon: MusicIcon },
  { label: "동영상", path: `${HOME}\\동영상`, Icon: VideoIcon },
];

interface MenuState {
  x: number;
  y: number;
  items: MenuItem[];
}

function displayName(path: string): string {
  if (path === HOME_VIEW) return "홈";
  if (path === RECYCLE_PATH) return "휴지통";
  if (path === "C:") return "로컬 디스크 (C:)";
  return baseName(path);
}

function nodeIcon(n: FsNode, size: number) {
  if (n.type === "folder") return <FolderIcon size={size} />;
  if (n.name.toLowerCase().endsWith(".exe")) return <ExeIcon size={size} />;
  return <FileTextIcon size={size} />;
}

/** 파일 탐색기 */
export function Explorer({ win }: { win: WinState }) {
  useFsVersion();
  const wm = useWindows();
  const [hist, setHist] = useState<{ stack: string[]; idx: number }>(() => ({
    stack: [win.args?.path ?? HOME_VIEW],
    idx: 0,
  }));
  const path = hist.stack[hist.idx];
  const [sel, setSel] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [menu, setMenu] = useState<MenuState | null>(null);

  const title = displayName(path);
  useEffect(() => {
    wm.setTitle(win.id, title);
    // eslint 없음 — wm은 안정적이지 않지만 title 변경 시에만 실행되면 충분하다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, win.id]);

  function navigate(p: string) {
    setHist((h) => ({
      stack: [...h.stack.slice(0, h.idx + 1), p],
      idx: h.idx + 1,
    }));
    setSel(null);
    setQ("");
  }

  const canBack = hist.idx > 0;
  const canFwd = hist.idx < hist.stack.length - 1;
  const canUp = path !== HOME_VIEW;

  function goBack() {
    if (canBack) setHist((h) => ({ ...h, idx: h.idx - 1 }));
    setSel(null);
  }
  function goFwd() {
    if (canFwd) setHist((h) => ({ ...h, idx: h.idx + 1 }));
    setSel(null);
  }
  function goUp() {
    if (path === HOME_VIEW) return;
    if (path === RECYCLE_PATH || path === "C:") navigate(HOME_VIEW);
    else navigate(splitPath(path).slice(0, -1).join("\\"));
  }

  const rawItems: FsNode[] =
    path === HOME_VIEW || path === RECYCLE_PATH ? [] : fs.list(path);
  const items = q.trim()
    ? rawItems.filter((n) =>
        n.name.toLowerCase().includes(q.trim().toLowerCase()),
      )
    : rawItems;

  function openNode(n: FsNode) {
    const p = `${path}\\${n.name}`;
    if (n.type === "folder") navigate(p);
    else openFile(wm.open, p);
  }

  function newMenu(e: MouseEvent<HTMLButtonElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setMenu({
      x: r.left,
      y: r.bottom + 4,
      items: [
        {
          label: "폴더",
          icon: <FolderIcon size={16} />,
          onClick: () => fs.createUnique(path, "새 폴더", "folder"),
        },
        {
          label: "텍스트 문서",
          icon: <FileTextIcon size={16} />,
          onClick: () =>
            fs.createUnique(path, "새 텍스트 문서", "file", ".txt"),
        },
      ],
    });
  }

  function itemContext(e: MouseEvent, n: FsNode) {
    e.preventDefault();
    e.stopPropagation();
    setSel(n.name);
    setMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        { label: "열기", onClick: () => openNode(n) },
        { sep: true },
        {
          label: "삭제",
          icon: <TrashIcon size={14} />,
          onClick: () => fs.remove(`${path}\\${n.name}`),
        },
      ],
    });
  }

  function bodyContext(e: MouseEvent) {
    if (path === HOME_VIEW || path === RECYCLE_PATH) return;
    if (e.target !== e.currentTarget) return;
    e.preventDefault();
    setSel(null);
    setMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        { label: "새로 고침", onClick: () => {} },
        { sep: true },
        {
          label: "새로 만들기",
          sub: [
            {
              label: "폴더",
              icon: <FolderIcon size={16} />,
              onClick: () => fs.createUnique(path, "새 폴더", "folder"),
            },
            {
              label: "텍스트 문서",
              icon: <FileTextIcon size={16} />,
              onClick: () =>
                fs.createUnique(path, "새 텍스트 문서", "file", ".txt"),
            },
          ],
        },
      ],
    });
  }

  // ── 브레드크럼 ───────────────────────────────────────
  let crumbs: { label: string; path: string }[];
  if (path === HOME_VIEW) crumbs = [{ label: "홈", path: HOME_VIEW }];
  else if (path === RECYCLE_PATH)
    crumbs = [{ label: "휴지통", path: RECYCLE_PATH }];
  else {
    const segs = splitPath(path);
    crumbs = [
      { label: "내 PC", path: HOME_VIEW },
      ...segs.map((s, i) => ({
        label: i === 0 ? "로컬 디스크 (C:)" : s,
        path: segs.slice(0, i + 1).join("\\"),
      })),
    ];
  }

  const isVirtual = path === HOME_VIEW || path === RECYCLE_PATH;
  const statusCount =
    path === RECYCLE_PATH
      ? fs.recycle.length
      : path === HOME_VIEW
        ? QUICK.length + 1
        : items.length;

  return (
    <div className="explorer">
      {/* 도구 모음 */}
      <div className="ex-toolbar">
        <button
          className="ex-tool ex-tool-new"
          disabled={isVirtual}
          onClick={newMenu}
        >
          <PlusIcon size={15} />
          <span>새로 만들기</span>
          <ChevronDownIcon size={12} />
        </button>
        <div className="ex-toolbar-sep" />
        <button className="ex-tool" disabled aria-label="잘라내기">
          <CutIcon size={16} />
        </button>
        <button className="ex-tool" disabled aria-label="복사">
          <CopyIcon size={16} />
        </button>
        <button className="ex-tool" disabled aria-label="붙여넣기">
          <PasteIcon size={16} />
        </button>
        <button className="ex-tool" disabled aria-label="이름 바꾸기">
          <RenameIcon size={16} />
        </button>
        {path === RECYCLE_PATH ? (
          <>
            <button
              className="ex-tool"
              disabled={sel === null}
              onClick={() => {
                if (sel !== null) fs.restore(Number(sel));
                setSel(null);
              }}
            >
              <RestoreArrowIcon size={16} />
              <span>복원</span>
            </button>
            <button
              className="ex-tool"
              disabled={fs.recycle.length === 0}
              onClick={() => fs.emptyRecycle()}
            >
              <TrashIcon size={16} />
              <span>휴지통 비우기</span>
            </button>
          </>
        ) : (
          <button
            className="ex-tool"
            disabled={isVirtual || sel === null}
            aria-label="삭제"
            onClick={() => {
              if (sel !== null) fs.remove(`${path}\\${sel}`);
              setSel(null);
            }}
          >
            <TrashIcon size={16} />
          </button>
        )}
        <div className="ex-toolbar-sep" />
        <button className="ex-tool" disabled>
          <span>정렬</span>
          <ChevronDownIcon size={12} />
        </button>
        <button className="ex-tool" disabled>
          <span>보기</span>
          <ChevronDownIcon size={12} />
        </button>
        <button className="ex-tool" disabled aria-label="더 보기">
          <MoreIcon size={16} />
        </button>
      </div>

      {/* 주소 표시줄 */}
      <div className="ex-nav">
        <button className="ex-nav-btn" disabled={!canBack} onClick={goBack} aria-label="뒤로">
          <BackIcon size={16} />
        </button>
        <button className="ex-nav-btn" disabled={!canFwd} onClick={goFwd} aria-label="앞으로">
          <ForwardIcon size={16} />
        </button>
        <button className="ex-nav-btn" disabled={!canUp} onClick={goUp} aria-label="위로">
          <UpIcon size={16} />
        </button>
        <div className="ex-breadcrumb">
          {crumbs.map((c, i) => (
            <span key={c.path} className="ex-crumb-wrap">
              {i > 0 && <span className="ex-crumb-sep">›</span>}
              <button className="ex-crumb" onClick={() => navigate(c.path)}>
                {c.label}
              </button>
            </span>
          ))}
        </div>
        <div className="ex-search">
          <SearchIcon size={13} />
          <input
            placeholder={`${displayName(path)} 검색`}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            disabled={isVirtual}
          />
        </div>
      </div>

      <div className="ex-main">
        {/* 사이드바 */}
        <nav className="ex-sidebar">
          <button
            className={`ex-side ${path === HOME_VIEW ? "active" : ""}`}
            onClick={() => navigate(HOME_VIEW)}
          >
            <HouseIcon size={16} />
            <span>홈</span>
          </button>
          <div className="ex-side-sep" />
          {QUICK.map((qk) => (
            <button
              key={qk.path}
              className={`ex-side ${path === qk.path ? "active" : ""}`}
              onClick={() => navigate(qk.path)}
            >
              <qk.Icon size={16} />
              <span>{qk.label}</span>
            </button>
          ))}
          <div className="ex-side-sep" />
          <button
            className={`ex-side ${path === "C:" ? "active" : ""}`}
            onClick={() => navigate("C:")}
          >
            <PcIcon size={16} />
            <span>내 PC</span>
          </button>
          <button
            className={`ex-side ${path === RECYCLE_PATH ? "active" : ""}`}
            onClick={() => navigate(RECYCLE_PATH)}
          >
            <BinMonoIcon size={16} />
            <span>휴지통</span>
          </button>
        </nav>

        {/* 본문 */}
        <div
          className="ex-body"
          onContextMenu={bodyContext}
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) setSel(null);
          }}
        >
          {path === HOME_VIEW ? (
            <>
              <div className="ex-section-title">폴더</div>
              <div className="ex-home-grid">
                {QUICK.map((qk) => (
                  <button
                    key={qk.path}
                    className="ex-home-tile"
                    onDoubleClick={() => navigate(qk.path)}
                    onClick={() => setSel(qk.label)}
                  >
                    <FolderIcon size={40} />
                    <span>{qk.label}</span>
                  </button>
                ))}
                <button
                  className="ex-home-tile"
                  onDoubleClick={() => navigate("C:")}
                  onClick={() => setSel("내 PC")}
                >
                  <PcIcon size={38} />
                  <span>로컬 디스크 (C:)</span>
                </button>
              </div>
            </>
          ) : path === RECYCLE_PATH ? (
            fs.recycle.length === 0 ? (
              <div className="ex-empty">휴지통이 비어 있습니다.</div>
            ) : (
              <div className="ex-grid">
                {fs.recycle.map((r) => (
                  <button
                    key={r.id}
                    className={`ex-item ${sel === String(r.id) ? "selected" : ""}`}
                    onClick={() => setSel(String(r.id))}
                    onDoubleClick={() => fs.restore(r.id)}
                    title={`원래 위치: ${r.originalDir}`}
                  >
                    {nodeIcon(r.node, 44)}
                    <span className="ex-item-name">{r.node.name}</span>
                    <span className="ex-item-sub">{r.originalDir}</span>
                  </button>
                ))}
              </div>
            )
          ) : items.length === 0 ? (
            <div className="ex-empty">이 폴더는 비어 있습니다.</div>
          ) : (
            <div className="ex-grid">
              {items.map((n) => (
                <button
                  key={n.name}
                  className={`ex-item ${sel === n.name ? "selected" : ""}`}
                  onClick={() => setSel(n.name)}
                  onDoubleClick={() => openNode(n)}
                  onContextMenu={(e) => itemContext(e, n)}
                >
                  {nodeIcon(n, 44)}
                  <span className="ex-item-name">{n.name}</span>
                  <span className="ex-item-sub">
                    {formatDateTime(n.mtime)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 상태 표시줄 */}
      <div className="ex-status">
        <span>{statusCount}개 항목</span>
        {sel !== null && <span>1개 항목 선택</span>}
      </div>

      {menu && <ContextMenu {...menu} onClose={() => setMenu(null)} />}
    </div>
  );
}
