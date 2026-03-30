export function FilterBar({ filters, activeFilter, onFilterChange, isVisible }) {
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
    </section>
  );
}
