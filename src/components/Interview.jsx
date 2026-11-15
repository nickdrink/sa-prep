import { useState } from 'react';
import { COMPETENCIES, INTERVIEW_QUESTIONS, STAR_TIPS } from '../data/phase2.js';
import { newId } from '../lib/store.js';
import Segmented from './Segmented.jsx';
import { mmss, useTick } from './Timer.jsx';

const compName = (id) => COMPETENCIES.find((c) => c.id === id)?.name ?? id;
const emptyStory = () => ({ id: null, title: '', comps: [], situation: '', task: '', action: '', result: '' });

/* ----------------------------- STAR stories ----------------------------- */

function StoryEditor({ story, onSave, onCancel, onDelete }) {
  const [f, setF] = useState(story);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const toggle = (id) => setF({ ...f, comps: f.comps.includes(id) ? f.comps.filter((c) => c !== id) : [...f.comps, id] });
  const field = (k, label, hint) => (
    <label className="stack-label">
      {label} <span className="muted small">{hint}</span>
      <textarea className="notes" value={f[k]} onChange={set(k)} />
    </label>
  );

  return (
    <section className="card">
      <h2>{story.id ? 'Edit story' : 'New STAR story'}</h2>
      <label className="stack-label">
        Short title
        <input value={f.title} onChange={set('title')} placeholder="e.g. Fixed the inventory audit at my warehouse job" />
      </label>
      <fieldset className="comp-pick">
        <legend>Competencies this story shows</legend>
        {COMPETENCIES.map((c) => (
          <label key={c.id} className="check compact">
            <input type="checkbox" checked={f.comps.includes(c.id)} onChange={() => toggle(c.id)} />
            <span>{c.name}</span>
          </label>
        ))}
      </fieldset>
      {field('situation', 'Situation', 'Where and when? What was the context?')}
      {field('task', 'Task', 'What was your responsibility or the challenge?')}
      {field('action', 'Action', 'What did YOU do, step by step, and why?')}
      {field('result', 'Result', 'Outcome, ideally with numbers. What did you learn?')}
      <div className="row wrap">
        <button className="btn primary" disabled={!f.title.trim()} onClick={() => onSave({ ...f, id: f.id ?? newId() })}>Save story</button>
        <button className="btn" onClick={onCancel}>Cancel</button>
        {story.id && <button className="btn danger" onClick={onDelete}>Delete</button>}
      </div>
    </section>
  );
}

function StoryCard({ story, onEdit }) {
  return (
    <li className="history-item">
      <div className="card-head">
        <strong>{story.title}</strong>
        {onEdit && <button className="btn small" onClick={onEdit}>Edit</button>}
      </div>
      <div className="chips">{story.comps.map((c) => <span key={c} className="chip">{compName(c)}</span>)}</div>
      <details>
        <summary>Show STAR</summary>
        <dl className="star">
          <dt>S</dt><dd>{story.situation || '—'}</dd>
          <dt>T</dt><dd>{story.task || '—'}</dd>
          <dt>A</dt><dd>{story.action || '—'}</dd>
          <dt>R</dt><dd>{story.result || '—'}</dd>
        </dl>
      </details>
    </li>
  );
}

function Stories({ state, setState }) {
  const [editing, setEditing] = useState(null);
  const counts = Object.fromEntries(COMPETENCIES.map((c) => [c.id, state.stories.filter((s) => s.comps.includes(c.id)).length]));
  const covered = COMPETENCIES.filter((c) => counts[c.id] > 0).length;

  if (editing) {
    return (
      <StoryEditor
        story={editing}
        onCancel={() => setEditing(null)}
        onSave={(s) => {
          setState((st) => ({
            ...st,
            stories: st.stories.some((x) => x.id === s.id) ? st.stories.map((x) => (x.id === s.id ? s : x)) : [...st.stories, s]
          }));
          setEditing(null);
        }}
        onDelete={() => {
          if (!confirm('Delete this story?')) return;
          setState((st) => ({ ...st, stories: st.stories.filter((x) => x.id !== editing.id) }));
          setEditing(null);
        }}
      />
    );
  }

  return (
    <div className="stack">
      <section className="card">
        <div className="card-head">
          <h2>Coverage</h2>
          <span className="muted small">{covered} of {COMPETENCIES.length} competencies</span>
        </div>
        <p className="muted small">Aim for at least 2 stories per competency. One strong story can cover several.</p>
        <ul className="coverage">
          {COMPETENCIES.map((c) => (
            <li key={c.id} className={counts[c.id] === 0 ? 'gap' : counts[c.id] === 1 ? 'thin' : 'ok'}>
              <span>
                <strong>{c.name}</strong>
                <br />
                <span className="muted small">{c.desc}</span>
              </span>
              <span className="count" aria-label={`${counts[c.id]} stories`}>
                {counts[c.id] === 0 ? '✕ 0' : counts[c.id] === 1 ? '! 1' : `✓ ${counts[c.id]}`}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <div className="card-head">
          <h2>My stories</h2>
          <button className="btn small primary" onClick={() => setEditing(emptyStory())}>+ New story</button>
        </div>
        {state.stories.length === 0 && (
          <p className="muted">No stories yet. Think of times at work, school, sports, volunteering or the military when you made a difference.</p>
        )}
        <ul className="history">
          {state.stories.map((s) => <StoryCard key={s.id} story={s} onEdit={() => setEditing(s)} />)}
        </ul>
      </section>

      <section className="card">
        <h2>STAR tips</h2>
        <ul className="tips">{STAR_TIPS.map((t) => <li key={t}>{t}</li>)}</ul>
      </section>
    </div>
  );
}

/* ------------------------------- Practice -------------------------------- */

function pickQuestion(filter, state, excludeId) {
  let pool = INTERVIEW_QUESTIONS;
  if (filter === 'weak') {
    // Competencies with the fewest stories, then fewest practices.
    const score = (c) => state.stories.filter((s) => s.comps.includes(c)).length * 100 + state.interviewLog.filter((l) => l.comp === c).length;
    const min = Math.min(...COMPETENCIES.map((c) => score(c.id)));
    const weak = COMPETENCIES.filter((c) => score(c.id) === min).map((c) => c.id);
    pool = pool.filter((q) => weak.includes(q.comp));
  } else if (filter !== 'all') {
    pool = pool.filter((q) => q.comp === filter);
  }
  const options = pool.length > 1 ? pool.filter((q) => q.id !== excludeId) : pool;
  return options[Math.floor(Math.random() * options.length)];
}

function Practice({ state, setState }) {
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState(() => pickQuestion('all', state));
  const [startAt, setStartAt] = useState(Date.now());
  const [showStories, setShowStories] = useState(false);
  useTick(true, 1000);
  const secs = (Date.now() - startAt) / 1000;

  function next(f = filter) {
    setQ(pickQuestion(f, state, q.id));
    setStartAt(Date.now());
    setShowStories(false);
  }

  function rate(n) {
    setState((s) => ({
      ...s,
      interviewLog: [...s.interviewLog, { id: newId(), date: new Date().toLocaleDateString('en-CA'), qid: q.id, comp: q.comp, rating: n, seconds: Math.round(secs) }]
    }));
    next();
  }

  const related = state.stories.filter((s) => s.comps.includes(q.comp));
  const log = state.interviewLog;
  const recent = log.slice(-20);
  const avg = recent.length ? recent.reduce((a, l) => a + l.rating, 0) / recent.length : null;

  return (
    <div className="stack">
      <section className="card">
        <div className="card-head">
          <label className="inline full">
            Questions
            <select value={filter} onChange={(e) => { setFilter(e.target.value); next(e.target.value); }}>
              <option value="all">All competencies</option>
              <option value="weak">My weakest areas</option>
              {COMPETENCIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
        </div>
      </section>

      <section className="card question-card">
        <span className="chip">{compName(q.comp)}</span>
        <p className="question">{q.text}</p>
        <p className="muted small">Answer out loud, as if to a panel. Use STAR. Aim for 2–3 minutes.</p>
        <div className={secs > 180 ? 'clock-sm warn center' : 'clock-sm center'}>{mmss(secs)}</div>

        <button className="link" onClick={() => setShowStories(!showStories)}>
          {showStories ? 'Hide' : 'Show'} my stories for {compName(q.comp)} ({related.length})
        </button>
        {showStories && (
          related.length ? <ul className="history">{related.map((s) => <StoryCard key={s.id} story={s} />)}</ul>
            : <p className="muted small">No stories tagged with this competency yet. Add one under “STAR stories”.</p>
        )}

        <p className="small"><strong>How did that answer go?</strong></p>
        <div className="rating wide" role="group" aria-label="Rate your answer">
          {[['1', 'Rough'], ['2', ''], ['3', 'OK'], ['4', ''], ['5', 'Strong']].map(([n, l]) => (
            <button key={n} className="rate" onClick={() => rate(Number(n))}>
              {n}{l && <span className="rate-label">{l}</span>}
            </button>
          ))}
        </div>
        <button className="btn small" onClick={() => next()}>Skip question</button>
      </section>

      <section className="card">
        <h2>Your practice</h2>
        <p className="small">
          <strong>{log.length}</strong> answers practiced{avg ? ` · last ${recent.length} average ${avg.toFixed(1)} / 5` : ''}
        </p>
        <ul className="coverage">
          {COMPETENCIES.map((c) => {
            const l = log.filter((x) => x.comp === c.id);
            const a = l.length ? l.reduce((s, x) => s + x.rating, 0) / l.length : null;
            return (
              <li key={c.id} className={l.length ? 'ok' : 'gap'}>
                <span>{c.name}</span>
                <span className="count">{l.length ? `${l.length}× · ${a.toFixed(1)}` : '—'}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

export default function Interview({ state, setState }) {
  const [view, setView] = useState('practice');
  return (
    <div className="stack">
      <Segmented label="Interview prep" value={view} onChange={setView}
        options={[['practice', 'Practice'], ['stories', 'STAR stories']]} />
      {view === 'practice' ? <Practice state={state} setState={setState} /> : <Stories state={state} setState={setState} />}
    </div>
  );
}
