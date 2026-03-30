export function TypeSelector({ value, onChange }) {
  return (
    <div className="space-y-3">
      <label className="text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-slate-400">
        Select Type
      </label>
      <div className="grid grid-cols-2 gap-2 rounded-[1.35rem] bg-white/[0.04] p-1.5 ring-1 ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <button
          type="button"
          className={`flex items-center justify-center gap-2 rounded-[1rem] px-4 py-3.5 text-sm font-semibold transition ${
            value === 'place'
              ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-[0_16px_36px_rgba(99,102,241,0.28)]'
              : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
          }`.trim()}
          onClick={() => onChange('place')}
        >
          <span className="material-symbols-outlined text-lg" aria-hidden="true">location_on</span>
          <span>Place</span>
        </button>
        <button
          type="button"
          className={`flex items-center justify-center gap-2 rounded-[1rem] px-4 py-3.5 text-sm font-semibold transition ${
            value === 'event'
              ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-[0_16px_36px_rgba(99,102,241,0.28)]'
              : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
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
