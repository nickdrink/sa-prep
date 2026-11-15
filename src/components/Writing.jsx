import { useEffect, useRef, useState } from 'react';
import { WRITING_PROMPTS, WRITING_RUBRIC, WRITING_TIPS } from '../data/phase2.js';
import { newId } from '../lib/store.js';
import { beep, mmss, useTick } from './Timer.jsx';

const wordCount = (t) => t.trim().split(/\s+/).filter(Boolean).length;
const promptFor = (item) => WRITING_PROMPTS.find((p) => p.id === item.promptId) ?? null;

export function avgRating(ratings) {
  const vals = Object.values(ratings ?? {}).filter((v) => v > 0);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
}

function Materials({ prompt, customPrompt }) {
  if (!prompt) {
    return (
      <div className="materials">
        <h3>Your prompt</h3>
        <p className="pre">{customPrompt}</p>
      </div>
    );
  }
  return (
    <div className="materials">
      <h3>{prompt.title}</h3>
      <p><strong>Task:</strong> {prompt.task}</p>
      {prompt.materials.map((m) => (
        <div key={m.heading} className="doc">
          <div className="doc-head">{m.heading}</div>
          <p>{m.body}</p>
        </div>
      ))}
    </div>
  );
}

function WriteView({ draft, setState }) {
  useTick(true, 1000);
  const fired = useRef(false);
  const prompt = promptFor(draft);
  const elapsed = (Date.now() - draft.startedAt) / 1000;
  const remaining = draft.limitMin * 60 - elapsed;
  const over = remaining < 0;

  useEffect(() => {
    if (over && !fired.current) {
      fired.current = true;
      beep();
    }
  }, [over]);

  const setText = (text) => setState((s) => ({ ...s, writingDraft: { ...s.writingDraft, text } }));

  function finish() {
    const attempt = {
      id: newId(),
      date: new Date().toLocaleDateString('en-CA'),
      promptId: draft.promptId,
      customPrompt: draft.customPrompt ?? '',
      title: prompt ? prompt.title : 'Custom prompt',
      text: draft.text,
      words: wordCount(draft.text),
      secondsUsed: Math.round(elapsed),
      limitMin: draft.limitMin,
      ratings: {},
      factsHit: [],
      notes: ''
    };
    setState((s) => ({ ...s, writingDraft: null, writingAttempts: [...s.writingAttempts, attempt], writingReviewId: attempt.id }));
  }

  function discard() {
    if (confirm('Discard this draft? Your text will be lost.')) setState((s) => ({ ...s, writingDraft: null }));
  }

  return (
    <div className="write-layout">
      <section className="card">
        <Materials prompt={prompt} customPrompt={draft.customPrompt} />
      </section>
      <section className="card write-pane">
        <div className="card-head sticky-head">
          <span className={over ? 'clock-sm bad' : remaining < 300 ? 'clock-sm warn' : 'clock-sm'} aria-live="off">
            {over ? `Over by ${mmss(-remaining)}` : `${mmss(remaining)} left`}
          </span>
          <span className="muted small">{wordCount(draft.text)} words</span>
        </div>
        <textarea
          className="editor"
          value={draft.text}
          onChange={(e) => setText(e.target.value)}
          placeholder="TO: Supervisor&#10;FROM: &#10;SUBJECT: &#10;&#10;Bottom line: …"
          spellCheck={false}
          aria-label="Your response"
        />
        <p className="muted small">Spell-check is off, like it may be on a real test. Your draft saves automatically.</p>
        <div className="row wrap">
          <button className="btn primary" onClick={finish} disabled={!draft.text.trim()}>Finish & self-review</button>
          <button className="btn danger" onClick={discard}>Discard</button>
        </div>
      </section>
    </div>
  );
}

function ReviewView({ attempt, setState, close }) {
  const prompt = promptFor(attempt);
  const [copied, setCopied] = useState(false);
  const update = (patch) =>
    setState((s) => ({ ...s, writingAttempts: s.writingAttempts.map((a) => (a.id === attempt.id ? { ...a, ...patch } : a)) }));
  const avg = avgRating(attempt.ratings);
  const over = attempt.secondsUsed > attempt.limitMin * 60;

  async function copyForFeedback() {
    const material = prompt
      ? `TASK: ${prompt.task}\n\n${prompt.materials.map((m) => `${m.heading}\n${m.body}`).join('\n\n')}`
      : attempt.customPrompt;
    const text = `Please critique my practice response for the FBI Phase II writing assessment. Grade it 1-5 on: bottom line up front, facts vs. assumptions, organization, recommendation, conciseness, grammar. Then list specific improvements.\n\n--- PROMPT ---\n${material}\n\n--- MY RESPONSE (${attempt.words} words, ${mmss(attempt.secondsUsed)} of ${attempt.limitMin}:00) ---\n${attempt.text}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      alert('Copy failed. Select the text manually.');
    }
  }

  function remove() {
    if (!confirm('Delete this attempt?')) return;
    setState((s) => ({ ...s, writingAttempts: s.writingAttempts.filter((a) => a.id !== attempt.id) }));
    close();
  }

  return (
    <div className="stack">
      <div className="row"><button className="btn small" onClick={close}>← All prompts</button></div>
      <section className="card">
        <h2>{attempt.title}</h2>
        <p className="muted small">
          {attempt.date} · {attempt.words} words · {mmss(attempt.secondsUsed)} used of {attempt.limitMin}:00
          {over && <span className="bad"> · over time</span>}
        </p>
        <details>
          <summary>Show prompt</summary>
          <Materials prompt={prompt} customPrompt={attempt.customPrompt} />
        </details>
        <h3>Your response</h3>
        <div className="response">{attempt.text}</div>
      </section>

      {prompt && (
        <section className="card">
          <h2>Did you cover the key facts?</h2>
          <ul className="checklist">
            {prompt.keyFacts.map((f, i) => (
              <li key={i}>
                <label className={attempt.factsHit.includes(i) ? 'check done-plain' : 'check'}>
                  <input
                    type="checkbox"
                    checked={attempt.factsHit.includes(i)}
                    onChange={(e) =>
                      update({ factsHit: e.target.checked ? [...attempt.factsHit, i] : attempt.factsHit.filter((x) => x !== i) })
                    }
                  />
                  <span>{f}</span>
                </label>
              </li>
            ))}
          </ul>
          <p className="small"><strong>{attempt.factsHit.length}</strong> of {prompt.keyFacts.length} covered</p>
        </section>
      )}

      <section className="card">
        <div className="card-head">
          <h2>Rate yourself</h2>
          <span className="muted small">{avg ? `Average ${avg.toFixed(1)} / 5` : 'Not rated'}</span>
        </div>
        {WRITING_RUBRIC.map((c) => (
          <div key={c.id} className="rubric-row">
            <div>
              <strong>{c.label}</strong>
              <div className="muted small">{c.hint}</div>
            </div>
            <div className="rating" role="radiogroup" aria-label={c.label}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  role="radio"
                  aria-checked={attempt.ratings[c.id] === n}
                  className={attempt.ratings[c.id] === n ? 'rate active' : 'rate'}
                  onClick={() => update({ ratings: { ...attempt.ratings, [c.id]: n } })}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        ))}
        <label className="stack-label">
          Notes to self
          <textarea className="notes" value={attempt.notes} onChange={(e) => update({ notes: e.target.value })}
            placeholder="What would you do differently next time?" />
        </label>
      </section>

      <section className="card">
        <h2>Want a second opinion?</h2>
        <p className="small muted">
          Copy the prompt and your response, then paste it into a chat with Claude for detailed feedback.
        </p>
        <div className="row wrap">
          <button className="btn" onClick={copyForFeedback}>{copied ? 'Copied ✓' : 'Copy for feedback'}</button>
          <button className="btn danger" onClick={remove}>Delete attempt</button>
        </div>
      </section>
    </div>
  );
}

function PromptList({ state, setState, openReview }) {
  const [minutes, setMinutes] = useState({});
  const [custom, setCustom] = useState('');
  const [customMin, setCustomMin] = useState(30);

  const start = (promptId, limitMin, customPrompt) =>
    setState((s) => ({ ...s, writingDraft: { promptId, customPrompt, text: '', startedAt: Date.now(), limitMin } }));

  const attempts = [...state.writingAttempts].reverse();

  return (
    <div className="stack">
      <section className="card notice" role="note">
        Original practice scenarios, not actual FBI test content. Check the current Phase II writing format and time
        limit on fbijobs.gov or with your applicant coordinator, and set the timer to match.
      </section>

      <section className="card">
        <h2>Tips</h2>
        <ul className="tips">{WRITING_TIPS.map((t) => <li key={t}>{t}</li>)}</ul>
      </section>

      {WRITING_PROMPTS.map((p) => {
        const done = state.writingAttempts.filter((a) => a.promptId === p.id).length;
        const m = minutes[p.id] ?? p.minutes;
        return (
          <section className="card" key={p.id}>
            <div className="card-head">
              <h2>{p.title}</h2>
              {done > 0 && <span className="chip">{done}× done</span>}
            </div>
            <p className="muted small">{p.skill}</p>
            <div className="row wrap">
              <button className="btn primary" onClick={() => start(p.id, m)}>Start</button>
              <label className="inline">
                Minutes
                <select value={m} onChange={(e) => setMinutes({ ...minutes, [p.id]: Number(e.target.value) })}>
                  {[15, 20, 25, 30, 45, 60, 90].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
            </div>
          </section>
        );
      })}

      <section className="card">
        <h2>Your own prompt</h2>
        <p className="muted small">Paste any scenario, e.g. a new one you asked Claude to write for you.</p>
        <textarea className="notes" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Paste a scenario and task…" />
        <div className="row wrap">
          <button className="btn primary" disabled={!custom.trim()} onClick={() => { start('custom', customMin, custom.trim()); setCustom(''); }}>Start</button>
          <label className="inline">
            Minutes
            <select value={customMin} onChange={(e) => setCustomMin(Number(e.target.value))}>
              {[15, 20, 25, 30, 45, 60, 90].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        </div>
      </section>

      <section className="card">
        <h2>History</h2>
        {attempts.length === 0 && <p className="muted">No attempts yet.</p>}
        <ul className="history">
          {attempts.map((a) => {
            const avg = avgRating(a.ratings);
            return (
              <li key={a.id} className="history-item">
                <button className="history-btn" onClick={() => openReview(a.id)}>
                  <span><strong>{a.title}</strong><br /><span className="muted small">{a.date} · {a.words} words · {mmss(a.secondsUsed)}</span></span>
                  <span className="chip">{avg ? `${avg.toFixed(1)}/5` : 'Rate'}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

export default function Writing({ state, setState }) {
  const reviewId = state.writingReviewId;
  const setReview = (id) => setState((s) => ({ ...s, writingReviewId: id }));

  if (state.writingDraft) return <WriteView draft={state.writingDraft} setState={setState} />;
  const attempt = reviewId && state.writingAttempts.find((a) => a.id === reviewId);
  if (attempt) return <ReviewView attempt={attempt} setState={setState} close={() => setReview(null)} />;
  return <PromptList state={state} setState={setState} openReview={setReview} />;
}
