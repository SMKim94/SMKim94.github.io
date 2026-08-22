import { useEffect, useState, type MouseEvent } from "react";
import { openFile } from "../os/apps";
import { ContextMenu, type MenuItem } from "../os/ContextMenu";
import {
  DESKTOP_DIR,
  DOCUMENTS_DIR,
  HOME,
  DRIVE_FREE_BYTES,
  DRIVE_TOTAL_BYTES,
  HOME_VIEW,
  PC_VIEW,
  RECYCLE_PATH,
  formatDateTime,
  fs,
  useFsVersion,
  type FsNode,
} from "../os/filesystem";
import { ICON } from "../os/iconSizes";
import { useWindows, type WinState } from "../os/WindowManager";
import {
  type History,
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
  navigate as navigateTo,
  upFrom,
} from "./explorerNav";
import {
  BackIcon,
  BinMonoIcon,
  ChevronDownIcon,
  CopyIcon,
  CutIcon,
  DocMonoIcon,
  DownloadIcon,
  DriveIcon,
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

/** 바이트를 "952GB"처럼 적는다 (Win11 탐색기 표기) */
function gb(bytes: number): string {
  return `${Math.round(bytes / 1024 ** 3)}GB`;
}

/** 드라이브 사용률(%) — 막대 길이에 쓴다 */
const drivePercentUsed = Math.round(
  ((DRIVE_TOTAL_BYTES - DRIVE_FREE_BYTES) / DRIVE_TOTAL_BYTES) * 100,
);

function nodeIcon(n: FsNode, size: number) {
  if (n.type === "folder") return <FolderIcon size={size} />;
  if (n.name.toLowerCase().endsWith(".exe")) return <ExeIcon size={size} />;
  return <FileTextIcon size={size} />;
}

/** 파일 탐색기 */
export function Explorer({ win }: { win: WinState }) {
  useFsVersion();
  const wm = useWindows();
  const [hist, setHist] = useState<History>(() =>
    initHistory(win.args?.path ?? HOME_VIEW),
  );
  const path = currentPath(hist);
  const [sel, setSel] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [menu, setMenu] = useState<MenuState | null>(null);

  const title = displayName(path);
  useEffect(() => {
    wm.setTitle(win.id, title);
    // wm은 렌더마다 새로 만들어져 의존성에 넣으면 매번 다시 실행된다.
    // 제목이 바뀔 때만 돌면 충분하므로 의도적으로 뺀다.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [title, win.id]);

  function navigate(p: string) {
    setHist((h) => navigateTo(h, p));
    setSel(null);
    setQ("");
  }

  const backEnabled = canBack(hist);
  const fwdEnabled = canFwd(hist);
  const upEnabled = canUp(path);

  function goBack() {
    setHist(back);
    setSel(null);
  }
  function goFwd() {
    setHist(forward);
    setSel(null);
  }
  function goUp() {
    const target = upFrom(path);
    if (target !== null) navigate(target);
  }

  const rawItems: FsNode[] =
    path === HOME_VIEW || path === RECYCLE_PATH ? [] : fs.list(path);
  const items = filterItems(rawItems, q);

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

  const crumbs = crumbsFor(path);

  const isVirtual = isVirtualPath(path);
  const statusCount =
    path === RECYCLE_PATH
      ? fs.recycle.length
      : path === PC_VIEW
        ? 1
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
        <button className="ex-nav-btn" disabled={!backEnabled} onClick={goBack} aria-label="뒤로">
          <BackIcon size={16} />
        </button>
        <button className="ex-nav-btn" disabled={!fwdEnabled} onClick={goFwd} aria-label="앞으로">
          <ForwardIcon size={16} />
        </button>
        <button className="ex-nav-btn" disabled={!upEnabled} onClick={goUp} aria-label="위로">
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
            className={`ex-side ${path === PC_VIEW ? "active" : ""}`}
            onClick={() => navigate(PC_VIEW)}
          >
            <PcIcon size={16} />
            <span>내 PC</span>
          </button>
          <button
            className={`ex-side ex-side-child ${path === "C:" ? "active" : ""}`}
            onClick={() => navigate("C:")}
          >
            <DriveIcon size={16} />
            <span>로컬 디스크 (C:)</span>
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
                    <FolderIcon size={ICON.large} />
                    <span>{qk.label}</span>
                  </button>
                ))}
                <button
                  className="ex-home-tile"
                  onDoubleClick={() => navigate(PC_VIEW)}
                  onClick={() => setSel("내 PC")}
                >
                  <PcIcon size={ICON.large} />
                  <span>내 PC</span>
                </button>
              </div>
            </>
          ) : path === PC_VIEW ? (
            <>
              <div className="ex-section-title ex-group-title">
                <ChevronDownIcon size={12} />
                <span>장치 및 드라이브</span>
              </div>
              <div className="ex-drive-grid">
                <button
                  className={`ex-drive ${sel === "C:" ? "selected" : ""}`}
                  onClick={() => setSel("C:")}
                  onDoubleClick={() => navigate("C:")}
                >
                  <DriveIcon size={ICON.extraLarge} />
                  <div className="ex-drive-info">
                    <span className="ex-drive-name">로컬 디스크 (C:)</span>
                    <span className="ex-drive-bar">
                      <span
                        className="ex-drive-fill"
                        style={{ width: `${drivePercentUsed}%` }}
                      />
                    </span>
                    <span className="ex-drive-sub">
                      {gb(DRIVE_TOTAL_BYTES)} 중 {gb(DRIVE_FREE_BYTES)} 사용 가능
                    </span>
                  </div>
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
                    {nodeIcon(r.node, ICON.extraLarge)}
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
                  {nodeIcon(n, ICON.extraLarge)}
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
