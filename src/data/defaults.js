// ---------------------------------------------------------------------------
// FBI PFT (format effective Nov 2025): pull-ups, 300 m sprint, push-ups, 1.5 mi run.
// Pass rule reported by multiple sources: at least 1 point in EVERY event and
// at least 10 points total. Max 5 minutes rest between events.
//
// IMPORTANT: The full official point tables live in the FBI "PFT Self-Evaluation
// Form" on fbijobs.gov. The starter tables below contain ONLY the 1-point
// minimums reported by a third-party source (stewsmithfitness.com, Oct 2025),
// using the stricter end of each reported range. They are UNVERIFIED.
// Replace them in Settings → Scoring tables with the official numbers.
// ---------------------------------------------------------------------------

export const EVENTS = [
  { id: 'pullups', name: 'Pull-ups', short: 'Pull-ups', unit: 'reps', kind: 'reps', step: 1 },
  { id: 'sprint', name: '300 m sprint', short: '300 m', unit: 'sec', kind: 'time', step: 0.1 },
  { id: 'pushups', name: 'Push-ups', short: 'Push-ups', unit: 'reps', kind: 'reps', step: 1 },
  { id: 'run', name: '1.5 mile run', short: '1.5 mi', unit: 'min:sec', kind: 'time', step: 1 }
];

export const PASS_RULES = { minPointsPerEvent: 1, minTotal: 10, maxRestMinutes: 5 };

// Each row: { value, points }.
// reps events: you earn `points` if your result is >= value.
// time events: you earn `points` if your time (seconds) is <= value.
export const STARTER_TABLES = {
  male: {
    pullups: [{ value: 3, points: 1 }],
    sprint: [{ value: 51.1, points: 1 }],
    pushups: [{ value: 32, points: 1 }],
    run: [{ value: 735, points: 1 }] // 12:15
  },
  female: {
    pullups: [{ value: 1, points: 1 }],
    sprint: [{ value: 62.5, points: 1 }],
    pushups: [{ value: 18, points: 1 }],
    run: [{ value: 815, points: 1 }] // 13:35
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
      { id: 'tables', text: 'Download the official PFT Self-Evaluation Form from fbijobs.gov and enter its point tables in Settings.' },
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
      { id: 'selfeval', text: 'Complete the PFT self-evaluation if requested.' }
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
