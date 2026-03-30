const filters = [
  { value: 'all', label: 'All' },
  { value: 'event', label: 'Events' },
  { value: 'place', label: 'Places' },
];

export function MapFilterBar({ activeFilter, onFilterChange }) {
  return (
    <section className="card stack-sm">
      <div className="filter-bar-header">
        <div>
          <h2 className="section-title">Explore the city</h2>
          <p className="muted">Filter UI placeholder for events, places, and later category chips.</p>
        </div>
      </div>

      <div className="filter-chip-row" role="toolbar" aria-label="Pin filters">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            className={`chip ${activeFilter === filter.value ? 'chip-active' : ''}`.trim()}
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
          </button>
        ))}

        <span className="filter-placeholder">Category filters next</span>
      </div>
    </section>
  );
}
