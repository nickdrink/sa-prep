# SA Prep

A free, installable web app (PWA) for preparing for the FBI Special Agent process:

- **PFT tracker**: log pull-ups, 300 m sprint, push-ups and 1.5 mile run; points per event, pass check, trend charts.
- **Timer**: stopwatch with laps, plus a rest countdown (the real test allows at most 5 minutes between events).
- **Steps**: checklist from "before you apply" through the Academy.
- **Settings**: goals, editable PFT scoring tables, backup export/import.

All data stays in your browser (localStorage). No account, no server, no cost.

## Scoring tables

Scoring uses the official scales from the FBI **PFT Self-Evaluation Form** (fbijobs.gov, last updated
May 2026), including the −2 point rows. They live in `src/data/defaults.js` and can be edited in
*Settings → Scoring tables* if the FBI publishes new scales.

## Run it on this computer

```bash
npm install
npm run dev
```

Open the address it prints (http://localhost:5173).

## Put it online for free (GitHub Pages)

1. Create a free GitHub account and a new **empty** repository (e.g. `sa-prep`).
2. In this folder:
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/sa-prep.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Source: GitHub Actions**.
4. After the workflow finishes, the app is live at `https://<your-username>.github.io/sa-prep/`.

## Install on your phone

- **iPhone (Safari):** open the site → Share → *Add to Home Screen*.
- **Android (Chrome):** open the site → ⋮ menu → *Install app*.

## Moving data between devices

Each device keeps its own data. Use *Settings → Export backup* on one device and *Import backup* on the other.

## Project layout

```
src/
  data/defaults.js     events, pass rules, starter tables, checklist content
  lib/scoring.js       scoring + time parsing
  lib/store.js         localStorage persistence, backup export/import
  components/          Dashboard, Pft, LineChart, Timer, Checklist, Settings
```
