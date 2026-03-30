export function AuthField({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
  icon,
  error = '',
  trailing = null,
  autoComplete,
}) {
  const hasError = Boolean(error);

  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 ml-1 block text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-slate-400">
        {label}
      </span>

      <div className="group">
        <div
          className={`relative flex items-center overflow-hidden rounded-[1.15rem] border bg-slate-950/70 transition-all duration-200 ${
            hasError
              ? 'border-rose-400/60 shadow-[0_0_0_4px_rgba(244,63,94,0.08)]'
              : 'border-white/10 focus-within:border-violet-400/60 focus-within:bg-slate-900/80 focus-within:shadow-[0_0_0_4px_rgba(139,92,246,0.1)]'
          }`}
        >
          <span className="pointer-events-none flex h-full w-12 flex-none items-center justify-center text-slate-500 transition-colors group-focus-within:text-violet-300">
            <span className="material-symbols-outlined text-[1.2rem]" aria-hidden="true">{icon}</span>
          </span>

          <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            autoComplete={autoComplete}
            placeholder={placeholder}
            className="auth-input h-14 w-full border-0 bg-transparent pr-4 text-sm font-medium text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-0"
          />

          {trailing ? <div className="pr-3">{trailing}</div> : null}
        </div>
      </div>

      {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}
    </label>
  );
}
