// ---------------------------------------------------------------------------
// FBI PFT: pull-ups/chin-ups, 300 m sprint, push-ups, 1.5 mi run, in that order,
// with no more than 5 minutes between events.
// Pass: at least 1 point in EVERY event and at least 10 points total.
// Source: FBI "Physical Fitness Test (PFT) Self-Evaluation Form",
// fbijobs.gov, last updated May 2026.
// ---------------------------------------------------------------------------

export const EVENTS = [
  { id: 'pullups', name: 'Pull-ups', short: 'Pull-ups', unit: 'reps', kind: 'reps', step: 1 },
  { id: 'sprint', name: '300 m sprint', short: '300 m', unit: 'sec', kind: 'time', step: 0.1 },
  { id: 'pushups', name: 'Push-ups', short: 'Push-ups', unit: 'reps', kind: 'reps', step: 1 },
  { id: 'run', name: '1.5 mile run', short: '1.5 mi', unit: 'min:sec', kind: 'time', step: 1 }
];

export const PASS_RULES = { minPointsPerEvent: 1, minTotal: 10, maxRestMinutes: 5 };

// Each row: { value, points }. The highest-points row you satisfy is your score.
// reps events: you earn `points` if your result is >= value (lower end of the range).
// time events: you earn `points` if your time (seconds) is <= value (upper end of the range).
// The -2 rows use a catch-all value (0 reps / a very slow time) so every result scores.
export const TABLES_SOURCE = 'FBI PFT Self-Evaluation Form (May 2026)';

const reps = (pairs) => pairs.map(([points, value]) => ({ value, points }));
const mmss = (s) => {
  const [m, sec] = s.split(':').map(Number);
  return m * 60 + sec;
};
const times = (pairs) => pairs.map(([points, v]) => ({ value: typeof v === 'string' ? mmss(v) : v, points }));

export const OFFICIAL_TABLES = {
  male: {
    pullups: reps([[0, 0], [1, 2], [2, 4], [3, 6], [4, 8], [5, 10], [6, 12], [7, 14], [8, 16], [9, 18], [10, 20]]),
    sprint: times([[-2, 999], [0, 55.0], [1, 52.4], [2, 51.0], [3, 49.4], [4, 47.9], [5, 46.0], [6, 44.9], [7, 43.9], [8, 42.9], [9, 41.9], [10, 40.9]]),
    pushups: reps([[-2, 0], [0, 20], [1, 30], [2, 33], [3, 40], [4, 44], [5, 50], [6, 54], [7, 57], [8, 61], [9, 65], [10, 71]]),
    run: times([[-2, '99:59'], [0, '13:29'], [1, '12:24'], [2, '12:14'], [3, '11:34'], [4, '11:09'], [5, '10:34'], [6, '10:14'], [7, '9:54'], [8, '9:34'], [9, '9:19'], [10, '8:59']])
  },
  female: {
    pullups: reps([[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10]]),
    sprint: times([[-2, 999], [0, 67.4], [1, 64.9], [2, 62.4], [3, 59.9], [4, 57.4], [5, 55.9], [6, 53.9], [7, 52.9], [8, 51.9], [9, 50.9], [10, 49.9]]),
    pushups: reps([[-2, 0], [0, 5], [1, 14], [2, 19], [3, 22], [4, 27], [5, 30], [6, 33], [7, 36], [8, 39], [9, 42], [10, 45]]),
    run: times([[-2, '99:59'], [0, '14:59'], [1, '13:59'], [2, '13:34'], [3, '12:59'], [4, '12:29'], [5, '11:56'], [6, '11:34'], [7, '11:14'], [8, '11:05'], [9, '10:44'], [10, '10:34']])
  }
};

// Personal targets. Defaults are a coach's suggested "competitive" targets
// (stewsmithfitness.com), NOT FBI standards. Edit them in Settings.
export const DEFAULT_GOALS = {
  male: { pullups: 10, sprint: 50, pushups: 50, run: 600 },
  female: { pullups: 5, sprint: 60, pushups: 30, run: 720 }
};

export const CHECKLIST = [
  {
    stage: 'Before you apply',
    items: [
      { id: 'elig', text: 'Read the Special Agent requirements on fbijobs.gov and confirm you are eligible (citizenship, age range, degree, work experience, driver’s license).' },
      { id: 'disq', text: 'Review the FBI’s automatic disqualifiers (e.g., drug-use policy, unfiled taxes, unpaid child support, defaulted federal student loans).' },
      { id: 'baseline', text: 'Do a practice PFT and log your baseline in this app.' },
      { id: 'plan', text: 'Start a structured training plan — aim for 12+ weeks before any official test.' },
      { id: 'tables', text: 'Download the official PFT Self-Evaluation Form from fbijobs.gov and read the test protocols (this app already uses its scoring tables).' },
      { id: 'history', text: 'Start collecting background history (addresses, employers, references, foreign travel). Keep this private and offline — not in this app.' },
      { id: 'credit', text: 'Pull your free credit reports and resolve anything unexpected.' },
      { id: 'resume', text: 'Write a detailed resume highlighting professional experience and any critical skills (languages, accounting, tech, law, etc.).' },
      { id: 'star', text: 'Write STAR stories (Situation, Task, Action, Result) for the FBI core competencies.' }
    ]
  },
  {
    stage: 'Apply',
    items: [
      { id: 'account', text: 'Create your account on the official FBI careers site (fbijobs.gov).' },
      { id: 'submit', text: 'Submit your Special Agent application.' },
      { id: 'selfeval', text: 'Complete and sign the PFT self-evaluation (required before the Meet & Greet). If you can’t reach 10 points yet, the FBI suggests withdrawing and re-applying when you can.' }
    ]
  },
  {
    stage: 'Phase I test',
    items: [
      { id: 'p1prep', text: 'Practice logical and figural reasoning under time pressure.' },
      { id: 'p1sched', text: 'Schedule your Phase I test.' },
      { id: 'p1take', text: 'Take the Phase I test.' }
    ]
  },
  {
    stage: 'Meet & Greet / Official PFT',
    items: [
      { id: 'meet', text: 'Attend the field office Meet & Greet.' },
      { id: 'pft', text: 'Pass the official PFT (≥1 point every event, ≥10 total).' }
    ]
  },
  {
    stage: 'Phase II',
    items: [
      { id: 'p2write', text: 'Prepare for and complete the Phase II written assessment.' },
      { id: 'p2int', text: 'Rehearse your STAR stories out loud; complete the structured panel interview.' }
    ]
  },
  {
    stage: 'Conditional offer & background',
    items: [
      { id: 'sf86', text: 'Complete the SF-86 security questionnaire (your collected history makes this much easier).' },
      { id: 'poly', text: 'Complete the polygraph examination.' },
      { id: 'medical', text: 'Complete the medical exam.' },
      { id: 'bi', text: 'Background investigation completed.' }
    ]
  },
  {
    stage: 'Academy',
    items: [
      { id: 'appoint', text: 'Receive your appointment to the FBI Academy at Quantico.' },
      { id: 'bftc', text: 'Keep training — the PFT is tested again at the Academy.' }
    ]
  }
];

export const CHECKLIST_NOTE =
  'The order of steps can change. Always follow the instructions from fbijobs.gov and your field office.';
