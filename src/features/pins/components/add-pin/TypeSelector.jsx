export function TypeSelector({ value, onChange }) {
  return (
    <div className="space-y-3">
      <label className="text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-slate-400">
        Select Type
      </label>
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white/5 p-1 ring-1 ring-white/10">
        <button
          type="button"
          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            value === 'place'
              ? 'bg-indigo-500 text-white shadow-[0_16px_36px_rgba(99,102,241,0.32)]'
              : 'text-slate-400 hover:text-white'
          }`.trim()}
          onClick={() => onChange('place')}
        >
          <span className="material-symbols-outlined text-lg" aria-hidden="true">location_on</span>
          <span>Place</span>
        </button>
        <button
          type="button"
          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            value === 'event'
              ? 'bg-indigo-500 text-white shadow-[0_16px_36px_rgba(99,102,241,0.32)]'
              : 'text-slate-400 hover:text-white'
          }`.trim()}
          onClick={() => onChange('event')}
        >
          <span className="material-symbols-outlined text-lg" aria-hidden="true">event</span>
          <span>Event</span>
        </button>
      </div>
    </div>
  );
}
