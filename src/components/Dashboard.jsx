import { EVENTS, CHECKLIST } from '../data/defaults.js';
import { formatValue, goalProgress, scoreSession } from '../lib/scoring.js';
import Verdict from './Verdict.jsx';

export default function Dashboard({ state, go }) {
  const { profile, sessions, goals, tables, checklist } = state;
  const g = profile.gender;
  const sorted = [...sessions].sort((a, b) => a.date.localeCompare(b.date));
  const latest = sorted[sorted.length - 1];
  const latestScore = latest ? scoreSession(latest, tables[g]) : null;

  // First and most recent logged value per event (for progress bars).
  const first = {};
  const last = {};
  for (const s of sorted) {
    for (const ev of EVENTS) {
      if (s[ev.id] == null) continue;
      if (first[ev.id] == null) first[ev.id] = s[ev.id];
      last[ev.id] = s[ev.id];
    }
  }

  const allItems = CHECKLIST.flatMap((st) => st.items.map((i) => ({ ...i, stage: st.stage })));
  const doneCount = allItems.filter((i) => checklist[i.id]).length;
  const nextItem = allItems.find((i) => !checklist[i.id]);

  let daysLeft = null;
  if (profile.targetDate) {
    const ms = new Date(profile.targetDate + 'T00:00:00') - new Date(new Date().toDateString());
    daysLeft = Math.round(ms / 86400000);
  }

  return (
    <div className="stack">
      {daysLeft !== null && (
        <section className="card hero">
          <div className="hero-number">{daysLeft >= 0 ? daysLeft : 0}</div>
          <div className="muted">days until your target date ({profile.targetDate})</div>
        </section>
      )}

      {!state.tablesVerified && (
        <section className="card notice" role="note">
          <strong>Scoring uses unverified starter tables.</strong> Download the official PFT
          Self-Evaluation Form from fbijobs.gov and enter its point tables in{' '}
          <button className="link" onClick={() => go('settings')}>Settings</button>.
        </section>
      )}

      <section className="card">
        <div className="card-head">
          <h2>Latest PFT</h2>
          <button className="btn small" onClick={() => go('pft')}>Log a session</button>
        </div>
        {latest ? (
          <>
            <p className="muted">{latest.date}</p>
            <Verdict result={latestScore} />
          </>
        ) : (
          <p className="muted">No sessions yet. Do a practice test and log your baseline.</p>
        )}
      </section>

      <section className="card">
        <h2>Progress toward your goals</h2>
        <ul className="goal-list">
          {EVENTS.map((ev) => {
            const p = goalProgress(ev.id, last[ev.id], goals[g][ev.id], first[ev.id]);
            return (
              <li key={ev.id}>
                <div className="goal-row">
                  <span>{ev.name}</span>
                  <span className="muted">
                    {formatValue(ev.id, last[ev.id])} / goal {formatValue(ev.id, goals[g][ev.id])}
                  </span>
                </div>
                <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100}
                  aria-valuenow={p == null ? 0 : Math.round(p * 100)} aria-label={`${ev.name} progress`}>
                  <div className="bar-fill" style={{ width: `${p == null ? 0 : p * 100}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card">
        <div className="card-head">
          <h2>Application steps</h2>
          <button className="btn small" onClick={() => go('steps')}>Open</button>
        </div>
        <p>
          <strong>{doneCount}</strong> of {allItems.length} done
        </p>
        <div className="bar"><div className="bar-fill" style={{ width: `${(doneCount / allItems.length) * 100}%` }} /></div>
        {nextItem && (
          <p className="next">
            <span className="muted">Next · {nextItem.stage}</span>
            <br />
            {nextItem.text}
          </p>
        )}
      </section>
    </div>
  );
}
