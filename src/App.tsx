import { useState } from "react";
import { APPS } from "./os/apps";
import { Desktop } from "./os/Desktop";
import { PowerOverlays } from "./os/Overlays";
import { QuickSettings } from "./os/QuickSettings";
import { StartMenu } from "./os/StartMenu";
import { SystemProvider, useSystem } from "./os/System";
import { Taskbar, type Flyout } from "./os/Taskbar";
import { Window } from "./os/Window";
import { WindowsProvider, useWindows } from "./os/WindowManager";

function Shell() {
  const sys = useSystem();
  const wm = useWindows();
  const [flyout, setFlyout] = useState<Flyout>(null);

  const filter =
    `brightness(${sys.brightness / 100})` +
    (sys.nightLight ? " sepia(0.28) saturate(1.15)" : "");

  return (
    <div className="os-root" style={{ filter }}>
      <Desktop />
      {wm.windows.map((w) => {
        const def = APPS[w.app];
        return (
          <Window key={w.id} win={w} focused={w.id === wm.focusedId}>
            <def.Component win={w} />
          </Window>
        );
      })}
      <Taskbar flyout={flyout} setFlyout={setFlyout} />
      {flyout === "start" && <StartMenu onClose={() => setFlyout(null)} />}
      {flyout === "quick" && <QuickSettings onClose={() => setFlyout(null)} />}
      <PowerOverlays />
    </div>
  );
}

export default function App() {
  return (
    <SystemProvider>
      <WindowsProvider>
        <Shell />
      </WindowsProvider>
    </SystemProvider>
  );
}
