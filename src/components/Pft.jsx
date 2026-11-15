import { useState } from 'react';
import { EVENTS } from '../data/defaults.js';
import { formatValue, parseTime, scoreSession } from '../lib/scoring.js';
import { newId } from '../lib/store.js';
import LineChart from './LineChart.jsx';
import Verdict from './Verdict.jsx';

const today = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD, local time

const emptyForm = () => ({ id: null, date: today(), pullups: '', sprint: '', pushups: '', run: '', notes: '' });

function toNumber(eventId, raw) {
  if (eventId === 'run' || eventId === 'sprint') return parseTime(raw);
  if (String(raw).trim() === '') return null;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

export default function Pft({ state, setState }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [chartEvent, setChartEvent] = useState('pushups');
  const g = state.profile.gender;
  const table = state.tables[g];

  const sorted = [...state.sessions].sort((a, b) => a.date.localeCompare(b.date));

  function save(e) {
    e.preventDefault();
    const session = { id: form.id ?? newId(), date: form.date, notes: form.notes.trim() };
    for (const ev of EVENTS) {
      const raw = form[ev.id];
      const val = toNumber(ev.id, raw);
      if (String(raw).trim() !== '' && val === null) {
        setError(`Check your ${ev.name} value${ev.id === 'run' ? ' (use min:sec, e.g. 12:05)' : ''}.`);
        return;
      }
      session[ev.id] = val;
    }
    if (EVENTS.every((ev) => session[ev.id] === null)) {
      setError('Enter at least one event.');
      return;
    }
    setError('');
    setState((s) => ({
      ...s,
      sessions: form.id ? s.sessions.map((x) => (x.id === form.id ? session : x)) : [...s.sessions, session]
    }));
    setForm(emptyForm());
  }

  function edit(s) {
    setForm({
      id: s.id,
      date: s.date,
      pullups: s.pullups ?? '',
      sprint: s.sprint ?? '',
      pushups: s.pushups ?? '',
      run: s.run == null ? '' : formatValue('run', s.run),
      notes: s.notes ?? ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function remove(id) {
    if (!confirm('Delete this session?')) return;
    setState((s) => ({ ...s, sessions: s.sessions.filter((x) => x.id !== id) }));
  }

  const chartEv = EVENTS.find((e) => e.id === chartEvent);
  const chartData = sorted.filter((s) => s[chartEvent] != null).map((s) => ({ date: s.date, value: s[chartEvent] }));

  return (
    <div className="stack">
      <section className="card">
        <h2>{form.id ? 'Edit session' : 'Log a PFT session'}</h2>
        <p className="muted small">
          Real test order: pull-ups → 300 m sprint → push-ups → 1.5 mi run, max 5 min rest between events.
          Leave a field blank if you didn’t do that event.
        </p>
        <form onSubmit={save} className="form-grid">
          <label>
            Date
            <input type="date" value={form.date} required onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </label>
          <label>
            Pull-ups (reps)
            <input inputMode="numeric" placeholder="e.g. 8" value={form.pullups} onChange={(e) => setForm({ ...form, pullups: e.target.value })} />
          </label>
          <label>
            300 m sprint (seconds)
            <input inputMode="decimal" placeholder="e.g. 52.4" value={form.sprint} onChange={(e) => setForm({ ...form, sprint: e.target.value })} />
          </label>
          <label>
            Push-ups (reps)
            <input inputMode="numeric" placeholder="e.g. 40" value={form.pushups} onChange={(e) => setForm({ ...form, pushups: e.target.value })} />
          </label>
          <label>
            1.5 mile run (min:sec)
            <input placeholder="e.g. 11:45" value={form.run} onChange={(e) => setForm({ ...form, run: e.target.value })} />
          </label>
          <label className="span-2">
            Notes
            <input placeholder="Conditions, how you felt…" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </label>
          {error && <p className="verdict bad span-2" role="alert">✕ {error}</p>}
          <div className="span-2 row">
            <button className="btn primary" type="submit">{form.id ? 'Save changes' : 'Save session'}</button>
            {form.id && (
              <button className="btn" type="button" onClick={() => setForm(emptyForm())}>Cancel</button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <div className="card-head">
          <h2>{chartEv.name}</h2>
          <select value={chartEvent} onChange={(e) => setChartEvent(e.target.value)} aria-label="Event to chart">
            {EVENTS.map((ev) => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
          </select>
        </div>
        <p className="muted small">
          {chartEv.kind === 'time' ? 'Lower is better.' : 'Higher is better.'} Dashed line = your goal.
        </p>
        <LineChart data={chartData} goal={state.goals[g][chartEvent]} eventId={chartEvent} />
      </section>

      <section className="card">
        <h2>History</h2>
        {sorted.length === 0 && <p className="muted">No sessions yet.</p>}
        <ul className="history">
          {[...sorted].reverse().map((s) => (
            <li key={s.id} className="history-item">
              <div className="card-head">
                <strong>{s.date}</strong>
                <span className="row">
                  <button className="btn small" onClick={() => edit(s)}>Edit</button>
                  <button className="btn small danger" onClick={() => remove(s.id)}>Delete</button>
                </span>
              </div>
              <p className="small">
                {EVENTS.map((ev) => `${ev.short}: ${formatValue(ev.id, s[ev.id])}`).join(' · ')}
              </p>
              {s.notes && <p className="muted small">{s.notes}</p>}
              <Verdict result={scoreSession(s, table)} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
