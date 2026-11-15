import { useState } from 'react';
import { useStore } from './lib/store.js';
import Dashboard from './components/Dashboard.jsx';
import Pft from './components/Pft.jsx';
import Timer from './components/Timer.jsx';
import Phase2 from './components/Phase2.jsx';
import Checklist from './components/Checklist.jsx';
import Settings from './components/Settings.jsx';
import Segmented from './components/Segmented.jsx';

const TABS = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'pft', label: 'PFT', icon: '▲' },
  { id: 'phase2', label: 'Phase II', icon: '✎' },
  { id: 'steps', label: 'Steps', icon: '✓' },
  { id: 'settings', label: 'Settings', icon: '⚙' }
];

export default function App() {
  const [state, setState] = useStore();
  const [tab, setTab] = useState('home');
  const [pftView, setPftView] = useState('log');
  const [p2View, setP2View] = useState('writing');

  const go = (target) => {
    if (target === 'writing' || target === 'interview') {
      setP2View(target);
      target = 'phase2';
    }
    setTab(target);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">
          <span className="brand-star" aria-hidden="true">★</span> SA Prep
        </span>
      </header>

      <main className="content">
        {tab === 'home' && <Dashboard state={state} go={go} />}
        {tab === 'pft' && (
          <div className="stack-gap">
            <Segmented label="PFT" value={pftView} onChange={setPftView}
              options={[['log', 'Log & scores'], ['timer', 'Timers']]} />
          </div>
        )}
        {tab === 'pft' && pftView === 'log' && <Pft state={state} setState={setState} />}
        {/* Timer stays mounted so a running stopwatch survives tab switches. */}
        <div hidden={!(tab === 'pft' && pftView === 'timer')}><Timer /></div>
        {tab === 'phase2' && <Phase2 state={state} setState={setState} view={p2View} setView={setP2View} />}
        {tab === 'steps' && <Checklist state={state} setState={setState} />}
        {tab === 'settings' && <Settings state={state} setState={setState} />}
      </main>

      <nav className="tabbar" aria-label="Main">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? 'tab active' : 'tab'}
            aria-current={tab === t.id ? 'page' : undefined}
            onClick={() => go(t.id)}
          >
            <span className="tab-icon" aria-hidden="true">{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
