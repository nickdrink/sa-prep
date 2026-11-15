// ---------------------------------------------------------------------------
// Phase II practice content. All scenarios and questions are ORIGINAL practice
// material written for this app. They are not actual FBI test content.
// Confirm the current Phase II format and time limits on fbijobs.gov.
// ---------------------------------------------------------------------------

export const WRITING_RUBRIC = [
  { id: 'bluf', label: 'Bottom line up front', hint: 'Main conclusion or purpose stated in the first paragraph.' },
  { id: 'facts', label: 'Facts vs. assumptions', hint: 'Clearly separates what is known from what is inferred.' },
  { id: 'org', label: 'Organization', hint: 'Logical order, one idea per paragraph, easy to scan.' },
  { id: 'recommend', label: 'Recommendation', hint: 'Clear, specific, justified next steps.' },
  { id: 'concise', label: 'Concise', hint: 'No filler, repetition or vague wording.' },
  { id: 'mechanics', label: 'Grammar & spelling', hint: 'Clean sentences, correct punctuation and spelling.' }
];

export const WRITING_TIPS = [
  'Spend the first few minutes reading and outlining. Don’t start writing immediately.',
  'Lead with your conclusion, then support it.',
  'Use exact names, times and amounts from the material.',
  'Flag inconsistencies between sources. Don’t resolve them by guessing.',
  'Leave 3–5 minutes at the end to proofread.'
];

export const WRITING_PROMPTS = [
  {
    id: 'warehouse',
    title: 'Overnight warehouse break-in',
    skill: 'Summarize & spot inconsistencies',
    minutes: 30,
    task:
      'Write a memo to your supervisor summarizing what happened, identifying any inconsistencies between the sources, and recommending three investigative next steps.',
    materials: [
      {
        heading: 'Incident report: Harbor Supply Co., 1400 Dock Rd.',
        body:
          'Alarm received 02:14 on Tuesday. Officers arrived 02:31. Rear roll-up door pried open. Manager reports 40 boxed tablet computers missing, estimated value $18,000. Security camera at the rear door was found unplugged. No injuries.'
      },
      {
        heading: 'Witness 1: night-shift worker at the bakery next door',
        body:
          '“Around two o’clock I took my break outside and saw a dark blue pickup backed up to the warehouse door. Two men were loading boxes. I didn’t think anything of it because deliveries happen at night sometimes.”'
      },
      {
        heading: 'Witness 2: rideshare driver waiting at the corner',
        body:
          '“I saw a black pickup with a ladder rack pull out of the lot fast, maybe 1:50 or so. Only one person in the cab as far as I could tell. It turned left onto Route 9.”'
      },
      {
        heading: 'Manager statement',
        body:
          '“Only three employees have the alarm code. One of them, a shift lead, quit last Friday after an argument about overtime. The camera was working on Monday because I checked footage of a delivery.”'
      }
    ],
    keyFacts: [
      'Alarm at 02:14; officers arrived 02:31',
      '40 tablets, about $18,000',
      'Rear camera unplugged (working the day before)',
      'Vehicle color conflict: dark blue vs. black pickup',
      'Time and headcount conflict: ~2:00 with two men vs. ~1:50 with one person',
      'Former shift lead with alarm code quit last Friday',
      'Specific next steps (e.g., neighboring cameras, Route 9 footage, interview former employee)'
    ]
  },
  {
    id: 'vendor',
    title: 'Suspicious vendor payments',
    skill: 'Analyze financial red flags',
    minutes: 30,
    task:
      'Write a memo to the agency’s inspector general assessing whether the material shows indicators of fraud. Separate facts from assumptions and recommend next steps.',
    materials: [
      {
        heading: 'Accounts payable summary: Brightline Facilities LLC',
        body:
          'Vendor added to the system 14 months ago. 22 invoices paid, totaling $96,400. Every invoice is between $4,000 and $4,950. Invoices are for “consulting and maintenance services” with no itemized detail.'
      },
      {
        heading: 'Agency policy excerpt',
        body: 'Purchases of $5,000 or more require a second approver and three competitive quotes.'
      },
      {
        heading: 'Vendor record',
        body:
          'Brightline’s mailing address is 77 Alder Court, Unit 3. Approving official on all 22 invoices: procurement specialist R. Hale.'
      },
      {
        heading: 'HR record (excerpt)',
        body: 'Employee R. Hale, home address on file: 77 Alder Court, Unit 3. Hired 4 years ago.'
      },
      {
        heading: 'Facilities manager email',
        body: '“I’ve never heard of Brightline. All our maintenance goes through the building contractor.”'
      }
    ],
    keyFacts: [
      '22 invoices, $96,400 over 14 months',
      'All invoices just under the $5,000 approval threshold',
      'No itemized detail on invoices',
      'Vendor address matches approving employee’s home address',
      'Same official approved every invoice',
      'Facilities manager doesn’t recognize the vendor',
      'Avoids stating guilt as fact (indicators, not proof)'
    ]
  },
  {
    id: 'laptop',
    title: 'Missing contractor laptop',
    skill: 'Build a timeline from conflicting records',
    minutes: 25,
    task:
      'Write a summary for the security officer establishing a timeline, noting where records conflict with the employee’s account, and listing what should be verified next.',
    materials: [
      {
        heading: 'Employee statement: J. Ortiz, systems analyst',
        body:
          '“I left the office around 5:30 Thursday with the laptop in my backpack. I stopped at the gym until about 7 and went straight home. Friday morning I realized the laptop wasn’t in my bag. I think it was stolen at the gym.”'
      },
      {
        heading: 'Building badge log (Thursday)',
        body: 'J. Ortiz: badge in 08:02 · badge out 17:28 · badge in 18:40 · badge out 18:55.'
      },
      {
        heading: 'Gym check-in system',
        body: 'J. Ortiz: no check-in recorded Thursday. Last check-in: Tuesday 18:10.'
      },
      {
        heading: 'IT asset system',
        body:
          'Laptop last connected to the company network Thursday 18:47 from the office Wi-Fi. Laptop contains contract documents marked sensitive. Disk encryption: enabled.'
      }
    ],
    keyFacts: [
      'Employee says left 5:30 and went to the gym',
      'Badge log shows return to office 18:40–18:55',
      'Laptop on office Wi-Fi at 18:47',
      'No gym check-in Thursday',
      'Sensitive documents; encryption enabled',
      'Neutral tone: discrepancies, not accusations',
      'Verification steps (office cameras, interview, gym staff, remote wipe/lock)'
    ]
  },
  {
    id: 'leads',
    title: 'Prioritizing three tips',
    skill: 'Judgment & prioritization',
    minutes: 30,
    task:
      'You can only assign one investigator this week. Write a memo recommending which tip to pursue first, ranking all three, and justifying your reasoning.',
    materials: [
      {
        heading: 'Tip A: anonymous phone call',
        body:
          'Caller says a neighbor “seems like he could be dangerous” and “has a lot of visitors at night.” No specific threat, names or dates given. Caller hung up when asked for details.'
      },
      {
        heading: 'Tip B: bank compliance referral',
        body:
          'A bank reports a customer made 11 cash deposits of $9,500–$9,900 at different branches over 3 weeks, then wired $98,000 overseas. Account opened 5 weeks ago. Documentation attached.'
      },
      {
        heading: 'Tip C: school administrator email',
        body:
          'A high school vice principal forwards a student’s social media post that names the school, says “Friday everyone will finally see,” and includes a photo of a handgun. Received Wednesday afternoon.'
      }
    ],
    keyFacts: [
      'Tip C ranked first: specific location, timeframe (Friday) and weapon. Imminent threat to life',
      'Tip C needs immediate action and coordination with school/local police',
      'Tip B: structuring pattern under $10,000 and an overseas wire, well documented',
      'Tip B is serious but not time-critical to life safety',
      'Tip A: vague, unverifiable, lowest priority. Document it',
      'Clear ranking with reasons for each'
    ]
  },
  {
    id: 'schedule',
    title: 'Training schedule recommendation',
    skill: 'Use data to support a recommendation',
    minutes: 25,
    task:
      'The office must choose a firearms-training schedule. Write a recommendation memo to the office head choosing Option 1 or 2, using the data to support your choice and acknowledging trade-offs.',
    materials: [
      {
        heading: 'Option 1: monthly half-day sessions',
        body:
          'Staff off duty 4 hours per month (48 hrs/yr). Last year under this model: qualification pass rate 91%, 6 sessions cancelled for operational needs.'
      },
      {
        heading: 'Option 2: quarterly two-day sessions',
        body:
          'Staff off duty 16 hours per quarter (64 hrs/yr). Pilot at another office: qualification pass rate 97%, 1 session cancelled. Requires renting an outside range: $12,000/yr.'
      },
      {
        heading: 'Staff survey (n = 40)',
        body: '58% prefer monthly sessions. 30% prefer quarterly. 12% no preference. Most common complaint: cancelled sessions.'
      },
      {
        heading: 'Budget note',
        body: 'Training budget has $8,000 unallocated this year.'
      }
    ],
    keyFacts: [
      'Pass rate 91% vs 97%',
      'Time off duty 48 vs 64 hrs/yr',
      'Option 2 costs $12,000 but only $8,000 is available',
      'Cancellations 6 vs 1; cancellations are the top complaint',
      'Staff prefer monthly (58%)',
      'Pilot data is from a different office (comparability caveat)',
      'A clear choice with trade-offs acknowledged'
    ]
  }
];

// FBI Special Agent core competencies (verify the current list on fbijobs.gov).
export const COMPETENCIES = [
  { id: 'collab', name: 'Collaboration', desc: 'Working with others toward shared goals.' },
  { id: 'comm', name: 'Communication', desc: 'Clear, effective speaking, writing and listening.' },
  { id: 'flex', name: 'Flexibility / Adaptability', desc: 'Adjusting to change and new information.' },
  { id: 'init', name: 'Initiative', desc: 'Acting without being told; going beyond requirements.' },
  { id: 'interp', name: 'Interpersonal Ability', desc: 'Building rapport and handling difficult people.' },
  { id: 'lead', name: 'Leadership', desc: 'Guiding, motivating and taking responsibility.' },
  { id: 'obj', name: 'Objectivity & Fair Judgment', desc: 'Impartial, ethical, evidence-based decisions.' },
  { id: 'plan', name: 'Organizing & Planning', desc: 'Prioritizing and managing time and resources.' },
  { id: 'solve', name: 'Problem Solving / Judgment', desc: 'Analyzing problems and making sound decisions.' }
];

// Original practice questions in a behavioral ("Tell me about a time…") style.
export const INTERVIEW_QUESTIONS = [
  { id: 'q1', comp: 'collab', text: 'Tell me about a time you worked with others to reach a goal you couldn’t have reached alone.' },
  { id: 'q2', comp: 'collab', text: 'Describe a time you had to work closely with someone whose style was very different from yours.' },
  { id: 'q3', comp: 'collab', text: 'Tell me about a time a team you were on disagreed. What was your role in resolving it?' },
  { id: 'q4', comp: 'comm', text: 'Describe a time you had to explain something complex to someone unfamiliar with the topic.' },
  { id: 'q5', comp: 'comm', text: 'Tell me about a time a miscommunication caused a problem. What did you do?' },
  { id: 'q6', comp: 'comm', text: 'Describe a piece of writing you produced that had a real impact.' },
  { id: 'q7', comp: 'flex', text: 'Tell me about a time plans changed at the last minute. How did you adapt?' },
  { id: 'q8', comp: 'flex', text: 'Describe a situation where you had to learn something new very quickly.' },
  { id: 'q9', comp: 'flex', text: 'Tell me about a time you received criticism. What did you change?' },
  { id: 'q10', comp: 'init', text: 'Tell me about a time you went beyond what your role required.' },
  { id: 'q11', comp: 'init', text: 'Describe a problem you noticed and fixed before anyone asked you to.' },
  { id: 'q12', comp: 'init', text: 'Tell me about a goal you set for yourself and how you achieved it.' },
  { id: 'q13', comp: 'interp', text: 'Tell me about a time you dealt with an upset or hostile person.' },
  { id: 'q14', comp: 'interp', text: 'Describe how you built trust with someone who was skeptical of you.' },
  { id: 'q15', comp: 'interp', text: 'Tell me about a time you had to deliver bad news.' },
  { id: 'q16', comp: 'lead', text: 'Tell me about a time you led a group without formal authority.' },
  { id: 'q17', comp: 'lead', text: 'Describe a time you had to motivate someone who was underperforming.' },
  { id: 'q18', comp: 'lead', text: 'Tell me about a decision you made as a leader that was unpopular.' },
  { id: 'q19', comp: 'obj', text: 'Tell me about a time you had to make a decision despite pressure from others.' },
  { id: 'q20', comp: 'obj', text: 'Describe a time you changed your mind after considering new facts.' },
  { id: 'q21', comp: 'obj', text: 'Tell me about a time you saw someone do something unethical. What did you do?' },
  { id: 'q22', comp: 'plan', text: 'Describe a time you managed several competing deadlines.' },
  { id: 'q23', comp: 'plan', text: 'Tell me about a complex project you planned from start to finish.' },
  { id: 'q24', comp: 'plan', text: 'Tell me about a time you missed a deadline. What did you learn?' },
  { id: 'q25', comp: 'solve', text: 'Tell me about a time you had to decide with incomplete information.' },
  { id: 'q26', comp: 'solve', text: 'Describe the most difficult problem you’ve solved at work or school.' },
  { id: 'q27', comp: 'solve', text: 'Tell me about a time your first solution didn’t work. What did you do next?' }
];

export const STAR_TIPS = [
  'Situation & Task: about 20% of your answer. Set the scene briefly.',
  'Action: about 60%. Say “I”, not “we”. What did YOU do, and why?',
  'Result: about 20%. Use numbers when you can. What did you learn?',
  'Aim for about 2–3 minutes per answer.',
  'Prepare 2+ stories per competency, and use your strongest stories for several competencies.'
];
