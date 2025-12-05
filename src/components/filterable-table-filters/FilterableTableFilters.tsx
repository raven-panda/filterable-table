export interface FilterableTableFiltersProps {
  defaultShownEntriesAmount?: number;
  entriesShownOptions?: number[];
  onSearchChange: (searchString: string) => void;
  onEntriesShownNumberChange: (entriesShownNumber: number) => void;
}

export function FilterableTableFilters({
  defaultShownEntriesAmount,
  entriesShownOptions = [10, 25, 50, 100],
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