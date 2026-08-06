import type { ComponentType } from "react";
import { Explorer } from "../apps/Explorer";
import { Notepad } from "../apps/Notepad";
import { Terminal } from "../apps/Terminal";
import { ExplorerIcon, NotepadIcon, TerminalIcon } from "./icons";
import { baseName, isTextFile } from "./filesystem";
import { APP_META, type AppArgs, type AppId } from "./appMeta";
import type { WinState } from "./WindowManager";

export { PINNED } from "./appMeta";
export type { AppArgs, AppId } from "./appMeta";

export interface AppDef {
  id: AppId;
  name: string;
  w: number;
  h: number;
  bodyClass?: string;
  Icon: ComponentType<{ size?: number }>;
  Component: ComponentType<{ win: WinState }>;
}

export const APPS: Record<AppId, AppDef> = {
  explorer: {
    id: "explorer",
    ...APP_META.explorer,
    Icon: ExplorerIcon,
    Component: Explorer,
  },
  notepad: {
    id: "notepad",
    ...APP_META.notepad,
    Icon: NotepadIcon,
    Component: Notepad,
  },
  terminal: {
    id: "terminal",
    ...APP_META.terminal,
    Icon: TerminalIcon,
    Component: Terminal,
  },
};

/**
 * 파일을 알맞은 앱으로 연다. (폴더는 호출한 쪽에서 처리)
 * .exe는 대응하는 앱 실행, 텍스트류는 메모장.
 */
export function openFile(
  open: (app: AppId, args?: AppArgs) => void,
  path: string,
): void {
  const name = baseName(path).toLowerCase();
  if (name.endsWith(".exe")) {
    if (name === "cmd.exe") open("terminal");
    else if (name === "notepad.exe") open("notepad");
    else if (name === "explorer.exe") open("explorer");
    return;
  }
  if (isTextFile(name) || !name.includes(".")) {
    open("notepad", { path });
    return;
  }
  // 연결 프로그램이 없는 확장자도 일단 메모장으로 (텍스트 기반 세계관)
  open("notepad", { path });
}
