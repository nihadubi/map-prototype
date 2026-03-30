export function CategoryChips({ categories, value, onChange }) {
  return (
    <div className="space-y-3 rounded-[1.4rem] bg-white/[0.02] p-4 ring-1 ring-white/8">
      <label className="text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-slate-400">
        Category
      </label>
      <div className="flex flex-wrap gap-2.5">
        {categories.map((category) => {
          const isActive = value === category;
          return (
            <button
              key={category}
              type="button"
              className={`rounded-full px-4 py-2.5 text-xs font-semibold capitalize transition ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-[0_12px_30px_rgba(99,102,241,0.24)]'
                  : 'bg-white/5 text-slate-300 ring-1 ring-white/10 hover:bg-white/10 hover:text-white'
              }`.trim()}
              onClick={() => onChange(category)}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
