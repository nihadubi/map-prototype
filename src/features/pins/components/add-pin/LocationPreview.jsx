function formatCoordinate(value, directionPositive, directionNegative) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return 'Click map to choose';
  }

  const direction = numeric >= 0 ? directionPositive : directionNegative;
  return `${Math.abs(numeric).toFixed(4)} deg ${direction}`;
}

function formatPreciseCoordinate(value) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return '--';
  }

  return numeric.toFixed(6);
}

export function LocationPreview({ coordinates, error }) {
  const isReady = Boolean(coordinates);

  return (
    <div className="flex items-start gap-4 rounded-[1.5rem] border border-indigo-400/20 bg-gradient-to-br from-indigo-500/15 to-fuchsia-500/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
      <div className="rounded-2xl bg-indigo-500 p-2.5 text-white shadow-[0_12px_28px_rgba(99,102,241,0.28)]">
        <span className="material-symbols-outlined text-xl" aria-hidden="true">share_location</span>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-300">Current Placement</p>
          <span className="rounded-full border border-white/10 bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
            {isReady ? 'Map Linked' : 'Waiting For Map'}
          </span>
        </div>
        <p className="mt-1 text-sm font-medium text-white">
          {isReady
            ? `${formatCoordinate(coordinates.lat, 'N', 'S')}, ${formatCoordinate(coordinates.lng, 'E', 'W')}`
            : 'Click on the map to place your pin'}
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          {isReady
            ? `Lat ${formatPreciseCoordinate(coordinates.lat)} / Lng ${formatPreciseCoordinate(coordinates.lng)}`
            : 'Choose a point on the map and we will attach this pin to that location.'}
        </p>
        <p className="mt-2 text-[11px] font-medium text-slate-500">
          {isReady ? 'Click a different spot on the map to update this placement.' : 'No manual coordinate entry needed.'}
        </p>
        {error ? <p className="field-error mt-2">{error}</p> : null}
      </div>
    </div>
  );
}
