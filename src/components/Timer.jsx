import { useEffect, useRef, useState } from 'react';

function fmt(ms) {
  const total = Math.max(0, ms);
  const m = Math.floor(total / 60000);
  const s = Math.floor((total % 60000) / 1000);
  const t = Math.floor((total % 1000) / 100);
  return `${m}:${String(s).padStart(2, '0')}.${t}`;
}

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.35, 0.7].forEach((offset) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = 880;
      o.connect(g);
      g.connect(ctx.destination);
      g.gain.setValueAtTime(0.2, ctx.currentTime + offset);
      o.start(ctx.currentTime + offset);
      o.stop(ctx.currentTime + offset + 0.2);
    });
  } catch { /* audio unavailable */ }
  navigator.vibrate?.([300, 150, 300]);
}

function useTick(active) {
  const [, force] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => force((n) => n + 1), 100);
    return () => clearInterval(id);
  }, [active]);
}

function Stopwatch() {
  const [start, setStart] = useState(null); // timestamp when running
  const [carry, setCarry] = useState(0); // ms accumulated before last start
  const [laps, setLaps] = useState([]);
  useTick(start !== null);
  const elapsed = carry + (start !== null ? Date.now() - start : 0);

  return (
    <section className="card">
      <h2>Stopwatch</h2>
      <p className="muted small">For the 300 m sprint and 1.5 mile run. Tap Lap at each lap (6 laps on a 400 m track).</p>
      <div className="clock" aria-live="off">{fmt(elapsed)}</div>
      <div className="row center">
        {start === null ? (
          <button className="btn primary big" onClick={() => setStart(Date.now())}>{elapsed ? 'Resume' : 'Start'}</button>
        ) : (
          <button className="btn primary big" onClick={() => { setCarry(elapsed); setStart(null); }}>Stop</button>
        )}
        <button className="btn big" disabled={start === null} onClick={() => setLaps((l) => [...l, elapsed])}>Lap</button>
        <button className="btn big" disabled={start !== null || !elapsed} onClick={() => { setCarry(0); setLaps([]); }}>Reset</button>
      </div>
      {laps.length > 0 && (
        <ol className="laps">
          {laps.map((t, i) => (
            <li key={i}>
              <span>Lap {i + 1}</span>
              <span>{fmt(t - (laps[i - 1] ?? 0))}</span>
              <span className="muted">{fmt(t)}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function RestTimer() {
  const [minutes, setMinutes] = useState(5);
  const [endAt, setEndAt] = useState(null);
  const fired = useRef(false);
  useTick(endAt !== null);
  const remaining = endAt !== null ? endAt - Date.now() : minutes * 60000;

  useEffect(() => {
    if (endAt !== null && remaining <= 0 && !fired.current) {
      fired.current = true;
      beep();
      setEndAt(null);
    }
  });

  return (
    <section className="card">
      <h2>Rest timer</h2>
      <p className="muted small">The real test allows at most 5 minutes between events. Practice with the same (or less) rest.</p>
      <div className="clock">{fmt(remaining)}</div>
      <div className="row center">
        {endAt === null ? (
          <button className="btn primary big" onClick={() => { fired.current = false; setEndAt(Date.now() + minutes * 60000); }}>Start rest</button>
        ) : (
          <button className="btn big" onClick={() => setEndAt(null)}>Cancel</button>
        )}
        <label className="inline">
          Minutes
          <select value={minutes} disabled={endAt !== null} onChange={(e) => setMinutes(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
      </div>
    </section>
  );
}

export default function Timer() {
  return (
    <div className="stack">
      <Stopwatch />
      <RestTimer />
    </div>
  );
}
