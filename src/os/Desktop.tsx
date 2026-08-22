import { useState, type MouseEvent } from "react";
import {
  ContextMenu,
  type MenuCommand,
  type MenuItem,
} from "./ContextMenu";
import { DESKTOP_DIR, RECYCLE_PATH, fs, useFsVersion } from "./filesystem";
import { openFile } from "./apps";
import { ICON } from "./iconSizes";
import { useWindows } from "./WindowManager";
import {
  CopyIcon,
  CopyPathIcon,
  CutIcon,
  ExeIcon,
  FileTextIcon,
  FolderIcon,
  MoreOptionsIcon,
  OpenIcon,
  PinIcon,
  RecycleBinIcon,
  RenameIcon,
  TrashIcon,
  WrenchIcon,
  ZipIcon,
} from "./icons";

interface MenuState {
  x: number;
  y: number;
  items: MenuItem[];
  commands?: MenuCommand[];
}

/** 바탕화면: 월페이퍼 + 아이콘("바탕 화면" 폴더 내용) + 우클릭 메뉴 */
export function Desktop() {
  useFsVersion();
  const wm = useWindows();
  const [sel, setSel] = useState<string | null>(null);
  const [menu, setMenu] = useState<MenuState | null>(null);
  const items = fs.list(DESKTOP_DIR);

  function openDesktopNode(name: string, type: "file" | "folder") {
    const path = `${DESKTOP_DIR}\\${name}`;
    if (type === "folder") wm.open("explorer", { path });
    else openFile(wm.open, path);
  }

  function onDesktopContext(e: MouseEvent) {
    e.preventDefault();
    setSel(null);
    setMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        { label: "보기", disabled: true },
        { label: "정렬 기준", disabled: true },
        { label: "새로 고침", onClick: () => {} },
        { sep: true },
        {
          label: "새로 만들기",
          sub: [
            {
              label: "폴더",
              icon: <FolderIcon size={16} />,
              onClick: () => fs.createUnique(DESKTOP_DIR, "새 폴더", "folder"),
            },
            {
              label: "텍스트 문서",
              icon: <FileTextIcon size={16} />,
              onClick: () =>
                fs.createUnique(DESKTOP_DIR, "새 텍스트 문서", "file", ".txt"),
            },
          ],
        },
        { sep: true },
        { label: "디스플레이 설정", disabled: true },
        { label: "개인 설정", disabled: true },
      ],
    });
  }

  function onIconContext(
    e: MouseEvent,
    name: string | null,
    type: "file" | "folder",
  ) {
    e.preventDefault();
    e.stopPropagation();
    if (name === null) {
      setSel("$recycle");
      setMenu({
        x: e.clientX,
        y: e.clientY,
        items: [
          {
            label: "열기",
            icon: <OpenIcon size={15} />,
            shortcut: "Enter",
            onClick: () => wm.open("explorer", { path: RECYCLE_PATH }),
          },
          {
            label: "휴지통 비우기",
            icon: <TrashIcon size={15} />,
            disabled: fs.recycle.length === 0,
            onClick: () => fs.emptyRecycle(),
          },
          { sep: true },
          {
            label: "속성",
            icon: <WrenchIcon size={15} />,
            shortcut: "Alt+Enter",
            disabled: true,
          },
        ],
      });
      return;
    }

    const path = `${DESKTOP_DIR}\\${name}`;
    setSel(name);
    setMenu({
      x: e.clientX,
      y: e.clientY,
      // Win11은 자주 쓰는 넷을 위쪽 아이콘 줄로 뺀다
      commands: [
        { label: "잘라내기", icon: <CutIcon size={16} />, disabled: true },
        { label: "복사", icon: <CopyIcon size={16} />, disabled: true },
        { label: "이름 바꾸기", icon: <RenameIcon size={16} />, disabled: true },
        {
          label: "삭제",
          icon: <TrashIcon size={16} />,
          onClick: () => fs.remove(path),
        },
      ],
      items: [
        {
          label: "열기",
          icon: <OpenIcon size={15} />,
          shortcut: "Enter",
          onClick: () => openDesktopNode(name, type),
        },
        { label: "즐겨찾기에 고정", icon: <PinIcon size={15} />, disabled: true },
        { label: "시작 화면에 고정", icon: <PinIcon size={15} />, disabled: true },
        { label: "압축...", icon: <ZipIcon size={15} />, disabled: true },
        {
          label: "경로로 복사",
          icon: <CopyPathIcon size={15} />,
          shortcut: "Ctrl+Shift+C",
          onClick: () => void navigator.clipboard?.writeText(path),
        },
        {
          label: "속성",
          icon: <WrenchIcon size={15} />,
          shortcut: "Alt+Enter",
          disabled: true,
        },
        { sep: true },
        {
          label: "추가 옵션 표시",
          icon: <MoreOptionsIcon size={15} />,
          disabled: true,
        },
      ],
    });
  }

  return (
    <div
      className="desktop"
      onContextMenu={onDesktopContext}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) setSel(null);
      }}
    >
      <div className="desktop-icons">
        <button
          className={`d-icon ${sel === "$recycle" ? "selected" : ""}`}
          onClick={() => setSel("$recycle")}
          onDoubleClick={() => wm.open("explorer", { path: RECYCLE_PATH })}
          onContextMenu={(e) => onIconContext(e, null, "folder")}
        >
          <RecycleBinIcon size={ICON.extraLarge} />
          <span className="d-label">휴지통</span>
        </button>
        {items.map((n) => (
          <button
            key={n.name}
            className={`d-icon ${sel === n.name ? "selected" : ""}`}
            onClick={() => setSel(n.name)}
            onDoubleClick={() => openDesktopNode(n.name, n.type)}
            onContextMenu={(e) => onIconContext(e, n.name, n.type)}
          >
            {n.type === "folder" ? (
              <FolderIcon size={ICON.extraLarge} />
            ) : n.name.toLowerCase().endsWith(".exe") ? (
              <ExeIcon size={ICON.extraLarge} />
            ) : (
              <FileTextIcon size={ICON.extraLarge} />
            )}
            <span className="d-label">{n.name}</span>
          </button>
        ))}
      </div>
      {menu && <ContextMenu {...menu} onClose={() => setMenu(null)} />}
    </div>
  );
}
