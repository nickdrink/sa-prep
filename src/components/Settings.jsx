import { useRef, useState } from 'react';
import { EVENTS, STARTER_TABLES } from '../data/defaults.js';
import { formatValue, parseTime } from '../lib/scoring.js';
import { defaultState, exportJson, importJson } from '../lib/store.js';

function ValueInput({ eventId, value, onChange, label }) {
  // Run times are edited as min:sec; everything else as a plain number.
  const [text, setText] = useState(eventId === 'run' ? formatValue('run', value) : String(value ?? ''));
  return (
    <input
      aria-label={label}
      value={text}
      inputMode={eventId === 'run' ? undefined : 'decimal'}
      onChange={(e) => {
        setText(e.target.value);
        const v = eventId === 'run' || eventId === 'sprint' ? parseTime(e.target.value) : Number(e.target.value);
        if (v !== null && Number.isFinite(v) && e.target.value.trim() !== '') onChange(v);
      }}
    />
  );
}

function TableEditor({ state, setState, gender }) {
  const update = (eventId, rows) =>
    setState((s) => ({
      ...s,
      tables: { ...s.tables, [gender]: { ...s.tables[gender], [eventId]: rows } }
    }));

  return EVENTS.map((ev) => {
    const rows = state.tables[gender][ev.id] ?? [];
    return (
      <div key={ev.id} className="table-block">
        <h3>{ev.name}</h3>
        <p className="muted small">
          {ev.kind === 'time'
            ? `Points earned if your time is at or under the value (${ev.id === 'run' ? 'min:sec' : 'seconds'}).`
            : 'Points earned if your reps are at or above the value.'}
        </p>
        <table className="score-table">
          <thead>
            <tr><th>{ev.kind === 'time' ? 'Time ≤' : 'Reps ≥'}</th><th>Points</th><th /></tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={`${ev.id}-${i}-${rows.length}`}>
                <td>
                  <ValueInput eventId={ev.id} value={row.value} label={`${ev.name} row ${i + 1} value`}
                    onChange={(v) => update(ev.id, rows.map((r, j) => (j === i ? { ...r, value: v } : r)))} />
                </td>
                <td>
                  <input type="number" step="1" aria-label={`${ev.name} row ${i + 1} points`} value={row.points}
                    onChange={(e) => update(ev.id, rows.map((r, j) => (j === i ? { ...r, points: Number(e.target.value) } : r)))} />
                </td>
                <td>
                  <button className="btn small danger" aria-label="Remove row"
                    onClick={() => update(ev.id, rows.filter((_, j) => j !== i))}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn small" onClick={() => {
          const last = rows[rows.length - 1];
          update(ev.id, [...rows, { value: last ? last.value : 0, points: last ? last.points + 1 : 1 }]);
        }}>+ Add row</button>
      </div>
    );
  });
}

export default function Settings({ state, setState }) {
  const fileRef = useRef(null);
  const [msg, setMsg] = useState('');
  const g = state.profile.gender;

  const setProfile = (patch) => setState((s) => ({ ...s, profile: { ...s.profile, ...patch } }));
  const setGoal = (eventId, v) =>
    setState((s) => ({ ...s, goals: { ...s.goals, [g]: { ...s.goals[g], [eventId]: v } } }));

  async function onImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importJson(file);
      if (!confirm('Replace all data on this device with the backup?')) return;
      setState(data);
      setMsg('Backup restored.');
    } catch (err) {
      setMsg(err.message || 'Could not read that file.');
    } finally {
      e.target.value = '';
    }
  }

  return (
    <div className="stack">
      <section className="card">
        <h2>Profile</h2>
        <div className="form-grid">
          <label>
            PFT scoring standard
            <select value={g} onChange={(e) => setProfile({ gender: e.target.value })}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
          <label>
            Target date (application or test)
            <input type="date" value={state.profile.targetDate} onChange={(e) => setProfile({ targetDate: e.target.value })} />
          </label>
        </div>
      </section>

      <section className="card">
        <h2>Your goals</h2>
        <p className="muted small">Starting values are a coach’s suggested competitive targets, not FBI standards. Set your own.</p>
        <div className="form-grid">
          {EVENTS.map((ev) => (
            <label key={`${g}-${ev.id}`}>
              {ev.name} ({ev.unit})
              <ValueInput eventId={ev.id} value={state.goals[g][ev.id]} label={`${ev.name} goal`} onChange={(v) => setGoal(ev.id, v)} />
            </label>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Scoring tables ({g})</h2>
        <p className="small">
          Starter tables hold only the reported <strong>1-point minimums</strong> from a third-party source.
          Get the official <em>PFT Self-Evaluation Form</em> from fbijobs.gov and enter every row here.
        </p>
        <label className="check">
          <input type="checkbox" checked={state.tablesVerified}
            onChange={(e) => setState((s) => ({ ...s, tablesVerified: e.target.checked }))} />
          <span>I’ve entered the official FBI tables</span>
        </label>
        <TableEditor key={g} state={state} setState={setState} gender={g} />
        <button className="btn small danger" onClick={() => {
          if (confirm(`Reset the ${g} tables to the starter values?`)) {
            setState((s) => ({ ...s, tablesVerified: false, tables: { ...s.tables, [g]: structuredClone(STARTER_TABLES[g]) } }));
          }
        }}>Reset {g} tables</button>
      </section>

      <section className="card">
        <h2>Your data</h2>
        <p className="muted small">
          Everything is stored only in this browser on this device. To move to another device, export a backup here
          and import it there.
        </p>
        <div className="row wrap">
          <button className="btn" onClick={() => exportJson(state)}>Export backup</button>
          <button className="btn" onClick={() => fileRef.current?.click()}>Import backup</button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={onImport} />
          <button className="btn danger" onClick={() => {
            if (confirm('Erase ALL data on this device? This cannot be undone unless you have a backup.')) setState(defaultState());
          }}>Erase all data</button>
        </div>
        {msg && <p className="small" role="status">{msg}</p>}
      </section>
    </div>
  );
}
