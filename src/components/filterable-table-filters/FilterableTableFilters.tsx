export interface FilterableTableFiltersProps {
  /** Default number of entries to show per page */
  defaultShownEntriesAmount?: number;
  /** Options for number of entries to show per page */
  entriesShownOptions: number[];
  /** Handler for search input change */
  onSearchChange: (searchString: string) => void;
  /** Handler for entries shown number change */
  onEntriesShownNumberChange: (entriesShownNumber: number) => void;
}

export function FilterableTableFilters({
  defaultShownEntriesAmount,
  entriesShownOptions,
  onSearchChange,
  onEntriesShownNumberChange,
}: FilterableTableFiltersProps) {
  return (
    <div className="filterable-table-filters">
      <label className="filterable-table-filters-rows-shown" data-testid="filterable-table-filters-rows-shown-label" htmlFor="filterable-table-filters-rows-shown-control">
        Show{' '}
        <select id="filterable-table-filters-rows-shown-control" data-testid="filterable-table-filters-rows-shown-control" name="filterable-table-filters-rows-shown-control" defaultValue={defaultShownEntriesAmount ?? entriesShownOptions?.[0]} className="filterable-table-filters-rows-shown-control" onChange={e => onEntriesShownNumberChange(parseInt(e.target.value))}>
          {entriesShownOptions.map(num => (
            <option key={"entriesShownCursor_" + num} value={num}>{num}</option>
          ))}
        </select>{' '}
        entries
      </label>
      <label htmlFor="filterable-table-search" data-testid="filterable-table-search-label" className="filterable-table-filters-search">
        Search :{' '}
        <input id="filterable-table-search" data-testid="filterable-table-search" name="filterable-table-search" className="filterable-table-filters-search-field" onChange={e => onSearchChange(e.target.value)} />
      </label>
    </div>
  )
};