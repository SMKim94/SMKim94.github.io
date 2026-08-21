import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { ContextMenu, type MenuItem } from "../os/ContextMenu";
import { DOCUMENTS_DIR, baseName, fs } from "../os/filesystem";
import { useWindows, type WinState } from "../os/WindowManager";

/** 메모장: 실제로 편집·저장되는 텍스트 에디터 (가짜 FS 연동) */
export function Notepad({ win }: { win: WinState }) {
  const wm = useWindows();
  const [path, setPath] = useState<string | null>(win.args?.path ?? null);
  const [text, setText] = useState<string>(() =>
    win.args?.path ? (fs.readFile(win.args.path) ?? "") : "",
  );
  const [dirty, setDirty] = useState(false);
  const [menu, setMenu] = useState<{ x: number; y: number; items: MenuItem[] } | null>(null);
  const [saveAs, setSaveAs] = useState<string | null>(null);
  const [cursor, setCursor] = useState({ ln: 1, col: 1 });
  const taRef = useRef<HTMLTextAreaElement>(null);

  const fileName = path ? baseName(path) : "제목 없음";

  useEffect(() => {
    wm.setTitle(win.id, `${dirty ? "*" : ""}${fileName} - 메모장`);
    // wm은 렌더마다 새로 만들어져 의존성에 넣으면 매번 다시 실행된다.
    // 제목이 바뀔 때만 돌면 충분하므로 의도적으로 뺀다.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, fileName, win.id]);

  function save() {
    if (path) {
      fs.writeFile(path, text);
      setDirty(false);
    } else {
      setSaveAs("제목 없음.txt");
    }
  }

  function confirmSaveAs(name: string) {
    let n = name.trim() || "제목 없음.txt";
    if (!/\.[^.\\/]+$/.test(n)) n += ".txt";
    const p = `${DOCUMENTS_DIR}\\${n}`;
    fs.writeFile(p, text);
    setPath(p);
    setDirty(false);
    setSaveAs(null);
  }

  function newDoc() {
    setPath(null);
    setText("");
    setDirty(false);
  }

  function updateCursor() {
    const ta = taRef.current;
    if (!ta) return;
    const upto = ta.value.slice(0, ta.selectionStart ?? 0);
    const lines = upto.split("\n");
    setCursor({ ln: lines.length, col: (lines[lines.length - 1]?.length ?? 0) + 1 });
  }

  function onChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
    setDirty(true);
    updateCursor();
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      save();
    }
  }

  function openMenu(e: MouseEvent<HTMLButtonElement>, kind: "file" | "edit" | "view") {
    const r = e.currentTarget.getBoundingClientRect();
    const items: MenuItem[] =
      kind === "file"
        ? [
            { label: "새로 만들기", shortcut: "Ctrl+N", onClick: newDoc },
            { label: "새 창", shortcut: "Ctrl+Shift+N", onClick: () => wm.open("notepad") },
            { label: "열기", shortcut: "Ctrl+O", disabled: true },
            { label: "저장", shortcut: "Ctrl+S", onClick: save },
            {
              label: "다른 이름으로 저장",
              shortcut: "Ctrl+Shift+S",
              onClick: () => setSaveAs(path ? baseName(path) : "제목 없음.txt"),
            },
            { sep: true },
            { label: "끝", onClick: () => wm.close(win.id) },
          ]
        : kind === "edit"
          ? [
              { label: "실행 취소", shortcut: "Ctrl+Z", disabled: true },
              { sep: true },
              { label: "잘라내기", shortcut: "Ctrl+X", disabled: true },
              { label: "복사", shortcut: "Ctrl+C", disabled: true },
              { label: "붙여넣기", shortcut: "Ctrl+V", disabled: true },
              { sep: true },
              { label: "찾기", shortcut: "Ctrl+F", disabled: true },
              { label: "바꾸기", shortcut: "Ctrl+H", disabled: true },
            ]
          : [
              { label: "확대", shortcut: "Ctrl+더하기", disabled: true },
              { label: "축소", shortcut: "Ctrl+빼기", disabled: true },
              { label: "상태 표시줄", disabled: true },
              { label: "자동 줄 바꿈", disabled: true },
            ];
    setMenu({ x: r.left, y: r.bottom + 2, items });
  }

  return (
    <div className="notepad">
      <div className="np-menubar">
        <button onClick={(e) => openMenu(e, "file")}>파일</button>
        <button onClick={(e) => openMenu(e, "edit")}>편집</button>
        <button onClick={(e) => openMenu(e, "view")}>보기</button>
      </div>
      <textarea
        ref={taRef}
        className="np-text"
        value={text}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onKeyUp={updateCursor}
        onClick={updateCursor}
        spellCheck={false}
        autoFocus
      />
      <div className="np-status">
        <span>
          줄 {cursor.ln}, 열 {cursor.col}
        </span>
        <span className="np-status-right">
          <span>100%</span>
          <span>Windows (CRLF)</span>
          <span>UTF-8</span>
        </span>
      </div>

      {saveAs !== null && (
        <div className="np-dialog-backdrop">
          <div className="np-dialog" role="dialog" aria-label="다른 이름으로 저장">
            <div className="np-dialog-title">다른 이름으로 저장</div>
            <label>
              파일 이름
              <input
                autoFocus
                value={saveAs}
                onChange={(e) => setSaveAs(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmSaveAs(saveAs);
                  if (e.key === "Escape") setSaveAs(null);
                }}
              />
            </label>
            <div className="np-dialog-loc">위치: 문서</div>
            <div className="np-dialog-btns">
              <button className="primary" onClick={() => confirmSaveAs(saveAs)}>
                저장
              </button>
              <button onClick={() => setSaveAs(null)}>취소</button>
            </div>
          </div>
        </div>
      )}

      {menu && <ContextMenu {...menu} onClose={() => setMenu(null)} />}
    </div>
  );
}
