import { useEffect, useRef, useState } from 'react';
import { formatValue } from '../lib/scoring.js';

// Single-series line chart with a dashed goal line, a crosshair and a tooltip.
// Width follows the container; height is fixed.
const H = 220;
const PAD = { top: 16, right: 16, bottom: 28, left: 48 };

export default function LineChart({ data, goal, eventId }) {
  const wrapRef = useRef(null);
  const [w, setW] = useState(600);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setW(Math.max(260, entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [data.length === 0]); // re-attach when the empty placeholder swaps for the chart

  if (data.length === 0) {
    return <div ref={wrapRef} className="chart-empty muted">Log a session to see your trend.</div>;
  }

  const values = data.map((d) => d.value).concat(goal != null ? [goal] : []);
  let lo = Math.min(...values);
  let hi = Math.max(...values);
  if (lo === hi) { lo -= 1; hi += 1; }
  const span = hi - lo;
  lo -= span * 0.1;
  hi += span * 0.1;
  if (eventId !== 'run' && eventId !== 'sprint') lo = Math.max(0, lo);

  const innerW = w - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const x = (i) => PAD.left + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
  const y = (v) => PAD.top + (1 - (v - lo) / (hi - lo)) * innerH;

  const ticks = Array.from({ length: 4 }, (_, i) => lo + ((hi - lo) * i) / 3);
  const path = data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(' ');

  function onMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * w;
    let best = 0;
    for (let i = 1; i < data.length; i++) {
      if (Math.abs(x(i) - px) < Math.abs(x(best) - px)) best = i;
    }
    setHover(best);
  }

  const h = hover != null ? data[hover] : null;
  const tipLeft = h ? Math.min(Math.max(x(hover), 70), w - 70) : 0;

  return (
    <div ref={wrapRef} className="chart-wrap">
      <svg
        width={w}
        height={H}
        role="img"
        aria-label={`Trend chart, ${data.length} sessions`}
        onPointerMove={onMove}
        onPointerDown={onMove}
        onPointerLeave={() => setHover(null)}
      >
        {ticks.map((t, i) => (
          <g key={i}>
            <line className="grid" x1={PAD.left} x2={w - PAD.right} y1={y(t)} y2={y(t)} />
            <text className="axis" x={PAD.left - 8} y={y(t) + 4} textAnchor="end">
              {formatValue(eventId, eventId === 'sprint' ? t : Math.round(t)).replace(' s', '')}
            </text>
          </g>
        ))}
        <text className="axis" x={PAD.left} y={H - 8} textAnchor="start">{data[0].date}</text>
        {data.length > 1 && (
          <text className="axis" x={w - PAD.right} y={H - 8} textAnchor="end">{data[data.length - 1].date}</text>
        )}
        {goal != null && (
          <line className="goal-line" x1={PAD.left} x2={w - PAD.right} y1={y(goal)} y2={y(goal)} />
        )}
        <path className="series" d={path} />
        {h && <line className="crosshair" x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={H - PAD.bottom} />}
        {data.map((d, i) => (
          <circle key={i} className="dot" cx={x(i)} cy={y(d.value)} r={hover === i ? 6 : 4} />
        ))}
      </svg>
      {h && (
        <div className="tooltip" style={{ left: tipLeft }}>
          <div className="muted small">{h.date}</div>
          <strong>{formatValue(eventId, h.value)}</strong>
        </div>
      )}
    </div>
  );
}
