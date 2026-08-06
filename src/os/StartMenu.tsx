import { useState } from "react";
import { APPS, PINNED, openFile } from "./apps";
import { HOME, RECYCLE_PATH, fs, useFsVersion, formatDateTime } from "./filesystem";
import { useSystem } from "./System";
import { useWindows } from "./WindowManager";
import {
  FileTextIcon,
  PowerIcon,
  RecycleBinIcon,
  SearchIcon,
  UserIcon,
} from "./icons";

/** Win11 시작 메뉴: 검색(실제 필터) + 고정 앱 + 최근 항목 + 전원 메뉴 */
export function StartMenu({ onClose }: { onClose: () => void }) {
  useFsVersion();
  const wm = useWindows();
  const sys = useSystem();
  const [q, setQ] = useState("");
  const [powerOpen, setPowerOpen] = useState(false);

  const apps = PINNED.map((id) => APPS[id]);
  const filtered = q.trim()
    ? apps.filter((a) => a.name.toLowerCase().includes(q.trim().toLowerCase()))
    : apps;
  const showRecycle =
    !q.trim() || "휴지통".includes(q.trim());

  const recents = fs
    .collectFiles(HOME)
    .filter((f) => !f.file.name.toLowerCase().endsWith(".exe"))
    .sort((a, b) => b.file.mtime - a.file.mtime)
    .slice(0, 6);

  function shutdown() {
    onClose();
    wm.closeAll();
    sys.shutdown();
  }

  function restart() {
    onClose();
    wm.closeAll();
    sys.restart();
  }

  return (
    <>
      <div className="flyout-backdrop" onPointerDown={onClose} />
      <div className="start-menu" role="dialog" aria-label="시작 메뉴">
        <div className="sm-search">
          <SearchIcon size={15} />
          <input
            autoFocus
            placeholder="앱, 설정 및 문서 검색"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="sm-section-title">고정됨</div>
        <div className="sm-grid">
          {filtered.map((a) => (
            <button
              key={a.id}
              className="sm-tile"
              onClick={() => {
                onClose();
                wm.open(a.id);
              }}
            >
              <a.Icon size={34} />
              <span>{a.name}</span>
            </button>
          ))}
          {showRecycle && (
            <button
              className="sm-tile"
              onClick={() => {
                onClose();
                wm.open("explorer", { path: RECYCLE_PATH });
              }}
            >
              <RecycleBinIcon size={34} />
              <span>휴지통</span>
            </button>
          )}
          {filtered.length === 0 && !showRecycle && (
            <div className="sm-empty">'{q}'에 대한 결과가 없습니다.</div>
          )}
        </div>

        <div className="sm-section-title">맞춤</div>
        <div className="sm-recents">
          {recents.length === 0 ? (
            <div className="sm-empty">최근에 연 항목이 없습니다.</div>
          ) : (
            recents.map((r) => (
              <button
                key={r.path}
                className="sm-recent"
                onClick={() => {
                  onClose();
                  openFile(wm.open, r.path);
                }}
              >
                <FileTextIcon size={26} />
                <span className="sm-recent-name">{r.file.name}</span>
                <span className="sm-recent-time">
                  {formatDateTime(r.file.mtime)}
                </span>
              </button>
            ))
          )}
        </div>

        <div className="sm-footer">
          <div className="sm-user">
            <span className="sm-avatar">
              <UserIcon size={16} />
            </span>
            <span>SMKim94</span>
          </div>
          <div className="sm-power-wrap">
            {powerOpen && (
              <div className="sm-power-menu">
                <button disabled>절전</button>
                <button onClick={shutdown}>시스템 종료</button>
                <button onClick={restart}>다시 시작</button>
              </div>
            )}
            <button
              className="sm-power-btn"
              aria-label="전원"
              onClick={() => setPowerOpen((v) => !v)}
            >
              <PowerIcon size={17} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
