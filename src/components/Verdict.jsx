import { EVENTS, PASS_RULES } from '../data/defaults.js';

const MESSAGES = {
  incomplete: { tone: 'neutral', icon: '•', text: 'Partial session — log all four events for a full PFT score.' },
  'fail-event': { tone: 'bad', icon: '✕', text: `Below the ${PASS_RULES.minPointsPerEvent}-point minimum in at least one event.` },
  'tables-missing': {
    tone: 'warn',
    icon: '!',
    text: `Every event meets the minimum. Enter the full official tables in Settings to check the ${PASS_RULES.minTotal}-point total.`
  },
  'fail-total': { tone: 'bad', icon: '✕', text: `Every event meets the minimum, but the total is under ${PASS_RULES.minTotal} points.` },
  pass: { tone: 'good', icon: '✓', text: 'Passing score.' }
};

export default function Verdict({ result }) {
  const m = MESSAGES[result.verdict];
  return (
    <div>
      <div className="points-row">
        {EVENTS.map((ev) => (
          <div key={ev.id} className="points-cell">
            <div className="points-num">{result.points[ev.id] ?? '—'}</div>
            <div className="points-label">{ev.short}</div>
          </div>
        ))}
        <div className="points-cell total">
          <div className="points-num">{result.total}</div>
          <div className="points-label">Total</div>
        </div>
      </div>
      <p className={`verdict ${m.tone}`}>
        <span aria-hidden="true">{m.icon}</span> {m.text}
      </p>
    </div>
  );
}
