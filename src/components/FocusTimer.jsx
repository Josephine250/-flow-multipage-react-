import { useState, useEffect, useRef } from "react";
import TimerControls from "./TimerControls";
import Badge from "./Badge";

const RADIUS = 96;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const format = (total) => {
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
};

// Timer state lives HERE, not in App: each tick re-renders only this component.
export default function FocusTimer({ mode, minutes }) {
  if (import.meta.env.DEV) console.log("render FocusTimer", mode);

  const total = minutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(total);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null); // stores the interval ID without causing re-renders

  const finished = secondsLeft <= 0;
  const active = running && !finished; // derived, so no extra Effect is needed to stop at 0

  useEffect(() => {
    if (!active) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => s - 1); // functional update: always uses the latest value
    }, 1000);
    // Cleanup runs on pause, reset, finish, and when leaving /focus:
    // the old interval is always cleared, so intervals never duplicate or leak.
    return () => clearInterval(intervalRef.current);
  }, [active]);

  const reset = () => {
    setRunning(false);
    setSecondsLeft(total);
  };

  let status = "Ready";
  let tone = "slate";
  if (finished) { status = "Session complete!"; tone = "teal"; }
  else if (running) { status = "Running"; tone = "green"; }
  else if (secondsLeft < total) { status = "Paused"; tone = "amber"; }

  const fraction = Math.max(secondsLeft, 0) / total;
  const stroke = mode === "study" ? "stroke-teal-600" : "stroke-sky-600";

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative h-56 w-56">
        <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="110" cy="110" r={RADIUS} fill="none" strokeWidth="12" className="stroke-slate-200" />
          <circle
            cx="110" cy="110" r={RADIUS} fill="none" strokeWidth="12" strokeLinecap="round"
            className={stroke}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-extrabold tabular-nums text-slate-900">{format(Math.max(secondsLeft, 0))}</span>
          <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-600">{mode} session</span>
        </div>
      </div>
      <div role="status">
        <Badge tone={tone}>{status}</Badge>
      </div>
      <TimerControls
        running={running}
        finished={finished}
        onStart={() => setRunning(true)}
        onPause={() => setRunning(false)}
        onReset={reset}
      />
    </div>
  );
}