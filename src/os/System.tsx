import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/** 전원·테마·퀵 설정 등 OS 전역 상태 */
export type PowerState = "on" | "off" | "restarting" | "bsod";
export type Theme = "light" | "dark";

interface SystemCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  power: PowerState;
  shutdown: () => void;
  restart: () => void;
  bsod: () => void;
  powerOn: () => void;
  brightness: number; // 40~100
  setBrightness: (n: number) => void;
  nightLight: boolean;
  setNightLight: (b: boolean) => void;
  /** 장식용 토글(Wi-Fi 등) — 상태만 기억한다 */
  toggles: Record<string, boolean>;
  setToggle: (key: string, on: boolean) => void;
}

const THEME_KEY = "smk-os.theme";

function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    /* ignore */
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

const Ctx = createContext<SystemCtx | null>(null);

export function SystemProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [power, setPower] = useState<PowerState>("on");
  const [brightness, setBrightness] = useState(100);
  const [nightLight, setNightLight] = useState(false);
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    wifi: true,
    bluetooth: false,
    airplane: false,
    saver: false,
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const value = useMemo<SystemCtx>(
    () => ({
      theme,
      setTheme,
      power,
      shutdown: () => setPower("off"),
      restart: () => setPower("restarting"),
      bsod: () => setPower("bsod"),
      powerOn: () => setPower("on"),
      brightness,
      setBrightness,
      nightLight,
      setNightLight,
      toggles,
      setToggle: (key, on) =>
        setToggles((t) => {
          const next = { ...t, [key]: on };
          // 비행기 모드를 켜면 무선이 꺼진다 (재현 디테일)
          if (key === "airplane" && on) {
            next.wifi = false;
            next.bluetooth = false;
          }
          return next;
        }),
    }),
    [theme, power, brightness, nightLight, toggles],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSystem(): SystemCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSystem must be used within SystemProvider");
  return v;
}
