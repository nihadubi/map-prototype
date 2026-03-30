export function FilterBar({ filters, activeFilter, onFilterChange, isVisible, resultCount, onReset }) {
  return (
    <section className={`map-filter-bar ${isVisible ? 'is-visible' : 'is-hidden'}`.trim()} aria-label="Map filters">
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          className={`map-filter-chip ${activeFilter === filter.value ? 'is-active' : ''}`.trim()}
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}

      <div className="map-filter-spacer" />
      <span className="map-filter-count">{resultCount} results</span>
      <button type="button" className="map-filter-chip map-filter-chip-secondary" onClick={onReset}>
        RESET
      </button>
    </section>
  );
}
