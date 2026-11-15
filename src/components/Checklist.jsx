import { CHECKLIST, CHECKLIST_NOTE } from '../data/defaults.js';

export default function Checklist({ state, setState }) {
  const toggle = (id) =>
    setState((s) => ({ ...s, checklist: { ...s.checklist, [id]: !s.checklist[id] } }));

  return (
    <div className="stack">
      <section className="card notice" role="note">{CHECKLIST_NOTE}</section>
      {CHECKLIST.map((stage) => {
        const done = stage.items.filter((i) => state.checklist[i.id]).length;
        return (
          <section className="card" key={stage.stage}>
            <div className="card-head">
              <h2>{stage.stage}</h2>
              <span className="muted small">{done}/{stage.items.length}</span>
            </div>
            <ul className="checklist">
              {stage.items.map((item) => (
                <li key={item.id}>
                  <label className={state.checklist[item.id] ? 'check done' : 'check'}>
                    <input type="checkbox" checked={!!state.checklist[item.id]} onChange={() => toggle(item.id)} />
                    <span>{item.text}</span>
                  </label>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
