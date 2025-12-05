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
      <div className="filterable-table-filters-rows-shown">
        Show{' '}
        <select defaultValue={defaultShownEntriesAmount ?? entriesShownOptions?.[0]} className="filterable-table-filters-rows-shown-control" onChange={e => onEntriesShownNumberChange(parseInt(e.target.value))}>
          {entriesShownOptions.map(num => (
            <option key={"entriesShownCursor_" + num} value={num}>{num}</option>
          ))}
        </select>{' '}
        entries
      </div>
      <div className="filterable-table-filters-search">
        Search: <input id="filterable-table-search" name="filterable-table-search" className="filterable-table-filters-search-field" onChange={e => onSearchChange(e.target.value)} />
      </div>
    </div>
  )
};