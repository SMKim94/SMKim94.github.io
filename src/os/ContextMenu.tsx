import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronRightIcon } from "./icons";

export interface MenuItem {
  label?: string;
  icon?: ReactNode;
  /** 오른쪽에 회색으로 표시 (예: "F5") */
  shortcut?: string;
  disabled?: boolean;
  sep?: boolean;
  onClick?: () => void;
  sub?: MenuItem[];
}

/** Win11 스타일 컨텍스트 메뉴. 바깥 클릭/Esc로 닫힌다. */
export function ContextMenu({
  x,
  y,
  items,
  onClose,
}: {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x, y });
  const [subOpen, setSubOpen] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    let nx = x;
    let ny = y;
    if (x + r.width > window.innerWidth - 8) nx = Math.max(8, x - r.width);
    if (y + r.height > window.innerHeight - 8) ny = Math.max(8, y - r.height);
    setPos({ x: nx, y: ny });
  }, [x, y]);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="ctx-menu"
      style={{ left: pos.x, top: pos.y }}
      role="menu"
    >
      {items.map((item, i) =>
        item.sep ? (
          <div key={i} className="ctx-sep" />
        ) : (
          <div
            key={i}
            className="ctx-item-wrap"
            onMouseEnter={() => setSubOpen(item.sub ? i : null)}
          >
            <button
              className="ctx-item"
              disabled={item.disabled}
              role="menuitem"
              onClick={() => {
                if (item.sub) return;
                item.onClick?.();
                onClose();
              }}
            >
              <span className="ctx-icon">{item.icon}</span>
              <span className="ctx-label">{item.label}</span>
              {item.shortcut && (
                <span className="ctx-shortcut">{item.shortcut}</span>
              )}
              {item.sub && (
                <span className="ctx-sub-arrow">
                  <ChevronRightIcon size={12} />
                </span>
              )}
            </button>
            {item.sub && subOpen === i && (
              <div className="ctx-menu ctx-submenu">
                {item.sub.map((s, j) =>
                  s.sep ? (
                    <div key={j} className="ctx-sep" />
                  ) : (
                    <button
                      key={j}
                      className="ctx-item"
                      disabled={s.disabled}
                      role="menuitem"
                      onClick={() => {
                        s.onClick?.();
                        onClose();
                      }}
                    >
                      <span className="ctx-icon">{s.icon}</span>
                      <span className="ctx-label">{s.label}</span>
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        ),
      )}
    </div>
  );
}
