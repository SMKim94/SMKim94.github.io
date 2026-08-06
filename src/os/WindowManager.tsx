import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { APP_META, type AppArgs, type AppId } from "./appMeta";

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WinState extends Rect {
  id: number;
  app: AppId;
  args?: AppArgs;
  title: string;
  minimized: boolean;
  maximized: boolean;
  /** 최대화 이전의 위치·크기 */
  prevRect: Rect | null;
  z: number;
}

interface WMState {
  windows: WinState[];
  nextId: number;
  zTop: number;
}

type Action =
  | { type: "OPEN"; app: AppId; args?: AppArgs }
  | { type: "CLOSE"; id: number }
  | { type: "FOCUS"; id: number }
  | { type: "MINIMIZE"; id: number }
  | { type: "TOGGLE_MAX"; id: number }
  | { type: "SET_RECT"; id: number; rect: Partial<Rect> }
  | { type: "SET_TITLE"; id: number; title: string }
  | { type: "CLOSE_ALL" }
  | { type: "MINIMIZE_ALL" };

export function isMobile(): boolean {
  return window.innerWidth < 768;
}

const TASKBAR_H = 48;

function patch(
  state: WMState,
  id: number,
  fn: (w: WinState) => WinState,
): WMState {
  return {
    ...state,
    windows: state.windows.map((w) => (w.id === id ? fn(w) : w)),
  };
}

function reducer(state: WMState, action: Action): WMState {
  switch (action.type) {
    case "OPEN": {
      const def = APP_META[action.app];
      const vw = window.innerWidth;
      const vh = window.innerHeight - TASKBAR_H;
      const w = Math.min(def.w, vw - 24);
      const h = Math.min(def.h, vh - 16);
      const off = (state.windows.length % 7) * 28;
      const x = Math.max(12, Math.round((vw - w) / 2 - 90 + off));
      const y = Math.max(8, Math.round((vh - h) / 2 - 30 + off * 0.7));
      const win: WinState = {
        id: state.nextId,
        app: action.app,
        args: action.args,
        title: def.name,
        x,
        y,
        w,
        h,
        minimized: false,
        maximized: isMobile(),
        prevRect: null,
        z: state.zTop + 1,
      };
      return {
        windows: [...state.windows, win],
        nextId: state.nextId + 1,
        zTop: state.zTop + 1,
      };
    }
    case "CLOSE":
      return {
        ...state,
        windows: state.windows.filter((w) => w.id !== action.id),
      };
    case "FOCUS": {
      const next = patch(state, action.id, (w) => ({
        ...w,
        minimized: false,
        z: state.zTop + 1,
      }));
      return { ...next, zTop: state.zTop + 1 };
    }
    case "MINIMIZE":
      return patch(state, action.id, (w) => ({ ...w, minimized: true }));
    case "TOGGLE_MAX": {
      const next = patch(state, action.id, (w) => {
        if (w.maximized) {
          const r = w.prevRect ?? { x: 80, y: 60, w: 800, h: 560 };
          return { ...w, maximized: false, prevRect: null, ...r, z: state.zTop + 1 };
        }
        return {
          ...w,
          maximized: true,
          prevRect: { x: w.x, y: w.y, w: w.w, h: w.h },
          z: state.zTop + 1,
        };
      });
      return { ...next, zTop: state.zTop + 1 };
    }
    case "SET_RECT":
      return patch(state, action.id, (w) => ({ ...w, ...action.rect }));
    case "SET_TITLE":
      return patch(state, action.id, (w) => ({ ...w, title: action.title }));
    case "CLOSE_ALL":
      return { ...state, windows: [] };
    case "MINIMIZE_ALL":
      return {
        ...state,
        windows: state.windows.map((w) => ({ ...w, minimized: true })),
      };
  }
}

interface WMApi {
  windows: WinState[];
  /** 최소화되지 않은 창 중 가장 위(z)의 id. 없으면 null */
  focusedId: number | null;
  open: (app: AppId, args?: AppArgs) => void;
  close: (id: number) => void;
  focus: (id: number) => void;
  minimize: (id: number) => void;
  toggleMax: (id: number) => void;
  setRect: (id: number, rect: Partial<Rect>) => void;
  setTitle: (id: number, title: string) => void;
  closeAll: () => void;
  minimizeAll: () => void;
}

const Ctx = createContext<WMApi | null>(null);

export function WindowsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    windows: [],
    nextId: 1,
    zTop: 10,
  });

  const focusedId = useMemo(() => {
    let top: WinState | null = null;
    for (const w of state.windows) {
      if (w.minimized) continue;
      if (!top || w.z > top.z) top = w;
    }
    return top?.id ?? null;
  }, [state.windows]);

  const value = useMemo<WMApi>(
    () => ({
      windows: state.windows,
      focusedId,
      open: (app, args) => dispatch({ type: "OPEN", app, args }),
      close: (id) => dispatch({ type: "CLOSE", id }),
      focus: (id) => dispatch({ type: "FOCUS", id }),
      minimize: (id) => dispatch({ type: "MINIMIZE", id }),
      toggleMax: (id) => dispatch({ type: "TOGGLE_MAX", id }),
      setRect: (id, rect) => dispatch({ type: "SET_RECT", id, rect }),
      setTitle: (id, title) => dispatch({ type: "SET_TITLE", id, title }),
      closeAll: () => dispatch({ type: "CLOSE_ALL" }),
      minimizeAll: () => dispatch({ type: "MINIMIZE_ALL" }),
    }),
    [state.windows, focusedId],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWindows(): WMApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useWindows must be used within WindowsProvider");
  return v;
}
