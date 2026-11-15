export default function Segmented({ options, value, onChange, label }) {
  return (
    <div className="segmented" role="tablist" aria-label={label}>
      {options.map(([id, text]) => (
        <button
          key={id}
          role="tab"
          aria-selected={value === id}
          className={value === id ? 'seg active' : 'seg'}
          onClick={() => onChange(id)}
        >
          {text}
        </button>
      ))}
    </div>
  );
}
