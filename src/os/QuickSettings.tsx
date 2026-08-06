import { useState } from "react";
import { useSystem } from "./System";
import {
  AirplaneIcon,
  BluetoothIcon,
  LeafIcon,
  MoonIcon,
  NightIcon,
  SunIcon,
  VolumeIcon,
  WifiIcon,
} from "./icons";

/** 트레이에서 열리는 빠른 설정. 다크 모드·야간 모드·밝기는 실제로 동작한다. */
export function QuickSettings({ onClose }: { onClose: () => void }) {
  const sys = useSystem();
  const [volume, setVolume] = useState(67);

  const tiles = [
    {
      key: "wifi",
      label: "Wi-Fi",
      icon: <WifiIcon size={17} />,
      active: sys.toggles.wifi,
      onClick: () => sys.setToggle("wifi", !sys.toggles.wifi),
    },
    {
      key: "bluetooth",
      label: "Bluetooth",
      icon: <BluetoothIcon size={17} />,
      active: sys.toggles.bluetooth,
      onClick: () => sys.setToggle("bluetooth", !sys.toggles.bluetooth),
    },
    {
      key: "airplane",
      label: "비행기 모드",
      icon: <AirplaneIcon size={17} />,
      active: sys.toggles.airplane,
      onClick: () => sys.setToggle("airplane", !sys.toggles.airplane),
    },
    {
      key: "saver",
      label: "절전 모드",
      icon: <LeafIcon size={17} />,
      active: sys.toggles.saver,
      onClick: () => sys.setToggle("saver", !sys.toggles.saver),
    },
    {
      key: "night",
      label: "야간 모드",
      icon: <NightIcon size={17} />,
      active: sys.nightLight,
      onClick: () => sys.setNightLight(!sys.nightLight),
    },
    {
      key: "dark",
      label: "다크 모드",
      icon: <MoonIcon size={17} />,
      active: sys.theme === "dark",
      onClick: () => sys.setTheme(sys.theme === "dark" ? "light" : "dark"),
    },
  ];

  return (
    <>
      <div className="flyout-backdrop" onPointerDown={onClose} />
      <div className="quick-settings" role="dialog" aria-label="빠른 설정">
        <div className="qs-grid">
          {tiles.map((t) => (
            <button
              key={t.key}
              className={`qs-tile ${t.active ? "active" : ""}`}
              onClick={t.onClick}
            >
              <span className="qs-tile-icon">{t.icon}</span>
              <span className="qs-tile-label">{t.label}</span>
            </button>
          ))}
        </div>
        <div className="qs-slider">
          <SunIcon size={17} />
          <input
            type="range"
            min={40}
            max={100}
            value={sys.brightness}
            onChange={(e) => sys.setBrightness(Number(e.target.value))}
            aria-label="밝기"
          />
        </div>
        <div className="qs-slider">
          <VolumeIcon size={17} />
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="볼륨"
          />
        </div>
      </div>
    </>
  );
}
