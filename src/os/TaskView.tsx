import { useEffect } from "react";
import { APPS } from "./apps";
import { useWindows } from "./WindowManager";

/**
 * 작업 보기 — 열려 있는 창을 한눈에 보고 고른다.
 * Win11처럼 배경을 흐리게 깔고 카드로 늘어놓는다.
 */
export function TaskView({ onClose }: { onClose: () => void }) {
  const wm = useWindows();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const wins = [...wm.windows].sort((a, b) => b.z - a.z);

  return (
    <div className="taskview" onClick={onClose}>
      {wins.length === 0 ? (
        <p className="taskview-empty">열려 있는 창이 없습니다</p>
      ) : (
        <div className="taskview-grid">
          {wins.map((w) => {
            const def = APPS[w.app];
            return (
              <button
                key={w.id}
                className="taskview-card"
                onClick={(e) => {
                  e.stopPropagation();
                  wm.focus(w.id);
                  onClose();
                }}
              >
                <div className="taskview-thumb">
                  <div className="taskview-thumb-bar">
                    <def.Icon size={12} />
                    <span>{w.title}</span>
                  </div>
                  <div className="taskview-thumb-body">
                    <def.Icon size={40} />
                  </div>
                </div>
                <div className="taskview-label">
                  <def.Icon size={16} />
                  <span>{w.title}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
