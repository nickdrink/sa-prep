import Segmented from './Segmented.jsx';
import Writing from './Writing.jsx';
import Interview from './Interview.jsx';

export default function Phase2({ state, setState, view, setView }) {
  return (
    <div className="stack">
      <Segmented label="Phase II" value={view} onChange={setView}
        options={[['writing', 'Writing test'], ['interview', 'Interview']]} />
      {view === 'writing' ? <Writing state={state} setState={setState} /> : <Interview state={state} setState={setState} />}
    </div>
  );
}
