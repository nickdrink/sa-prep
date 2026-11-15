import { useState } from 'react';
import { useStore } from './lib/store.js';
import Dashboard from './components/Dashboard.jsx';
import Pft from './components/Pft.jsx';
import Timer from './components/Timer.jsx';
import Checklist from './components/Checklist.jsx';
import Settings from './components/Settings.jsx';

const TABS = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'pft', label: 'PFT', icon: '▲' },
  { id: 'timer', label: 'Timer', icon: '◷' },
  { id: 'steps', label: 'Steps', icon: '✓' },
  { id: 'settings', label: 'Settings', icon: '⚙' }
];

export default function App() {
  const [state, setState] = useStore();
  const [tab, setTab] = useState('home');

  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">
          <span className="brand-star" aria-hidden="true">★</span> SA Prep
        </span>
      </header>

      <main className="content">
        {tab === 'home' && <Dashboard state={state} go={setTab} />}
        {tab === 'pft' && <Pft state={state} setState={setState} />}
        {/* Timer stays mounted so a running stopwatch survives tab switches. */}
        <div hidden={tab !== 'timer'}><Timer /></div>
        {tab === 'steps' && <Checklist state={state} setState={setState} />}
        {tab === 'settings' && <Settings state={state} setState={setState} />}
      </main>

      <nav className="tabbar" aria-label="Main">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? 'tab active' : 'tab'}
            aria-current={tab === t.id ? 'page' : undefined}
            onClick={() => setTab(t.id)}
          >
            <span className="tab-icon" aria-hidden="true">{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
