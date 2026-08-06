import { useEffect, useState } from "react";
import { useSystem } from "./System";
import { useWindows } from "./WindowManager";

/** Win11 풍 점 스피너 */
function Spinner() {
  return (
    <div className="spin-ring" aria-hidden>
      {Array.from({ length: 6 }, (_, i) => (
        <span key={i} style={{ animationDelay: `${i * 0.12}s` }} />
      ))}
    </div>
  );
}

function ShutdownScreen({ onWake }: { onWake: () => void }) {
  const [phase, setPhase] = useState<"closing" | "off">("closing");
  const [hint, setHint] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("off"), 1600);
    const t2 = setTimeout(() => setHint(true), 4200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div
      className="power-screen"
      onClick={() => {
        if (phase === "off") onWake();
      }}
    >
      {phase === "closing" ? (
        <div className="power-center">
          <Spinner />
          <p>종료 중</p>
        </div>
      ) : (
        hint && <p className="power-hint">아무 곳이나 클릭하면 전원이 켜집니다.</p>
      )}
    </div>
  );
}

function RestartScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="power-screen">
      <div className="power-center">
        <Spinner />
        <p>다시 시작하는 중</p>
      </div>
    </div>
  );
}

function BsodScreen({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setPct((p) => {
        if (p >= 100) return p;
        return Math.min(100, p + Math.ceil(Math.random() * 4));
      });
    }, 120);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (pct >= 100) {
      const t = setTimeout(onDone, 900);
      return () => clearTimeout(t);
    }
  }, [pct, onDone]);

  return (
    <div className="bsod">
      <div className="bsod-inner">
        <div className="bsod-face">:(</div>
        <p className="bsod-text">
          디바이스에 문제가 발생하여 다시 시작해야 합니다.
          <br />
          오류 정보를 수집하고 있습니다. 자동으로 다시 시작됩니다.
        </p>
        <p className="bsod-pct">{pct}% 완료</p>
        <p className="bsod-code">중지 코드: CRITICAL_PROCESS_DIED</p>
      </div>
    </div>
  );
}

/** 전원 상태에 따른 전체 화면 오버레이 */
export function PowerOverlays() {
  const sys = useSystem();
  const wm = useWindows();

  if (sys.power === "off") return <ShutdownScreen onWake={sys.powerOn} />;
  if (sys.power === "restarting") return <RestartScreen onDone={sys.powerOn} />;
  if (sys.power === "bsod")
    return (
      <BsodScreen
        onDone={() => {
          wm.closeAll();
          sys.restart();
        }}
      />
    );
  return null;
}
