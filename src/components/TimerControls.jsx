import Button from "./Button";

export default function TimerControls({ running, finished, onStart, onPause, onReset }) {
  return (
    // functional rendering 
    <div className="flex justify-center gap-3">
      {running ? (
        <Button icon="pause" onClick={onPause}>Pause</Button>
      ) : (
        <Button icon="play" onClick={onStart} disabled={finished}>Start</Button>
      )}
      <Button variant="secondary" icon="reset" onClick={onReset}>Reset</Button>
    </div>
  );
}