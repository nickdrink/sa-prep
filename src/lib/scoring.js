import { EVENTS, PASS_RULES } from '../data/defaults.js';

/** "12:15" -> 735, "735" -> 735, "51.3" -> 51.3. Returns null if empty/invalid. */
export function parseTime(input) {
  if (input === null || input === undefined) return null;
  const s = String(input).trim();
  if (!s) return null;
  if (s.includes(':')) {
    const [m, sec] = s.split(':');
    const mi = Number(m);
    const se = Number(sec);
    if (!Number.isFinite(mi) || !Number.isFinite(se) || se >= 60 || mi < 0 || se < 0) return null;
    return mi * 60 + se;
  }
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** 735 -> "12:15"; 51.3 -> "51.3" when short (sprints). */
export function formatValue(eventId, value) {
  if (value === null || value === undefined || value === '') return '—';
  if (eventId === 'run') {
    const total = Math.round(value);
    const m = Math.floor(total / 60);
    const s = String(total % 60).padStart(2, '0');
    return `${m}:${s}`;
  }
  if (eventId === 'sprint') return `${Number(value).toFixed(1)} s`;
  return String(value);
}

export function eventById(id) {
  return EVENTS.find((e) => e.id === id);
}

/** Points for one event result, or null if no result. */
export function scoreEvent(eventId, value, table) {
  if (value === null || value === undefined || value === '') return null;
  const ev = eventById(eventId);
  const rows = table?.[eventId] ?? [];
  let best = 0;
  for (const row of rows) {
    const ok = ev.kind === 'time' ? value <= row.value : value >= row.value;
    if (ok && row.points > best) best = row.points;
  }
  return best;
}

export function maxPointsInTables(table) {
  return EVENTS.reduce((sum, ev) => {
    const rows = table?.[ev.id] ?? [];
    return sum + rows.reduce((m, r) => Math.max(m, r.points), 0);
  }, 0);
}

/**
 * Score a full session. Returns per-event points, total, and a verdict:
 *  - 'incomplete'      : not all four events logged
 *  - 'fail-event'      : some event under the per-event minimum
 *  - 'tables-missing'  : events OK but tables can't produce a 10-point total yet
 *  - 'fail-total'      : events OK, total under minimum
 *  - 'pass'
 */
export function scoreSession(session, table) {
  const points = {};
  let total = 0;
  let logged = 0;
  let allMeetMin = true;
  for (const ev of EVENTS) {
    const p = scoreEvent(ev.id, session[ev.id], table);
    points[ev.id] = p;
    if (p !== null) {
      logged += 1;
      total += p;
      if (p < PASS_RULES.minPointsPerEvent) allMeetMin = false;
    }
  }
  let verdict;
  if (logged < EVENTS.length) verdict = 'incomplete';
  else if (!allMeetMin) verdict = 'fail-event';
  else if (maxPointsInTables(table) < PASS_RULES.minTotal) verdict = 'tables-missing';
  else if (total < PASS_RULES.minTotal) verdict = 'fail-total';
  else verdict = 'pass';
  return { points, total, verdict };
}

/** 0..1 progress toward a goal, from a starting baseline. */
export function goalProgress(eventId, value, goal, baseline) {
  if (value == null || goal == null) return null;
  const ev = eventById(eventId);
  const better = ev.kind === 'time' ? value <= goal : value >= goal;
  if (better) return 1;
  if (baseline == null || baseline === goal) return 0;
  const p = (value - baseline) / (goal - baseline);
  return Math.max(0, Math.min(1, p));
}
