import { useEffect, useState } from 'react';
import { OFFICIAL_TABLES, TABLES_SOURCE, DEFAULT_GOALS } from '../data/defaults.js';

// All data lives in this browser's localStorage. Nothing is sent to a server.
// Use Settings → Export / Import to move data between devices.
const KEY = 'saprep:v1';

export function defaultState() {
  return {
    version: 1,
    profile: { gender: 'male', targetDate: '' },
    goals: structuredClone(DEFAULT_GOALS),
    tables: structuredClone(OFFICIAL_TABLES),
    tablesSource: TABLES_SOURCE,
    tablesVerified: true,
    sessions: [], // { id, date, pullups, sprint, pushups, run, notes }
    checklist: {} // { [itemId]: true }
  };
}

// Older saves carry the unverified starter tables. Swap in the official tables
// unless the user had already entered and confirmed their own.
export function migrate(data) {
  const merged = { ...defaultState(), ...data };
  if (data.tablesSource !== TABLES_SOURCE && !data.tablesVerified) {
    merged.tables = structuredClone(OFFICIAL_TABLES);
    merged.tablesSource = TABLES_SOURCE;
    merged.tablesVerified = true;
  }
  return merged;
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    return migrate(JSON.parse(raw));
  } catch {
    return defaultState();
  }
}

export function useStore() {
  const [state, setState] = useState(load);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage full or blocked; app still works for this visit */
    }
  }, [state]);
  return [state, setState];
}

export function exportJson(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sa-prep-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importJson(file) {
  const text = await file.text();
  const data = JSON.parse(text);
  if (!data || typeof data !== 'object' || !Array.isArray(data.sessions)) {
    throw new Error('That file is not an SA Prep backup.');
  }
  return migrate(data);
}

export const newId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
