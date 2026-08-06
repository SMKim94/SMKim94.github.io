import { useState, type MouseEvent } from "react";
import { ContextMenu, type MenuItem } from "./ContextMenu";
import { DESKTOP_DIR, RECYCLE_PATH, fs, useFsVersion } from "./filesystem";
import { openFile } from "./apps";
import { useWindows } from "./WindowManager";
import { ExeIcon, FileTextIcon, FolderIcon, RecycleBinIcon } from "./icons";

interface MenuState {
  x: number;
  y: number;
  items: MenuItem[];
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
    const items: MenuItem[] =
      name === null
        ? [
            {
              label: "열기",
              onClick: () => wm.open("explorer", { path: RECYCLE_PATH }),
            },
            {
              label: "휴지통 비우기",
              disabled: fs.recycle.length === 0,
              onClick: () => fs.emptyRecycle(),
            },
          ]
        : [
            { label: "열기", onClick: () => openDesktopNode(name, type) },
            { sep: true },
            {
              label: "삭제",
              onClick: () => fs.remove(`${DESKTOP_DIR}\\${name}`),
            },
          ];
    setSel(name ?? "$recycle");
    setMenu({ x: e.clientX, y: e.clientY, items });
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
          <RecycleBinIcon size={46} />
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
              <FolderIcon size={46} />
            ) : n.name.toLowerCase().endsWith(".exe") ? (
              <ExeIcon size={46} />
            ) : (
              <FileTextIcon size={46} />
            )}
            <span className="d-label">{n.name}</span>
          </button>
        ))}
      </div>
      {menu && <ContextMenu {...menu} onClose={() => setMenu(null)} />}
    </div>
  );
}
