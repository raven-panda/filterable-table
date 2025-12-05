export interface FilterableTableFiltersProps {
  defaultShownCursor?: number;
  entriesShownCursors?: number[];
  onSearchChange: (searchString: string) => void;
  onEntriesShownNumberChange: (entriesShownNumber: number) => void;
}

export function FilterableTableFilters({
  defaultShownCursor,
  entriesShownCursors = [10, 25, 50, 100],
  onSearchChange,
  onEntriesShownNumberChange,
}: FilterableTableFiltersProps) {
  return (
    <div className="filterable-table-filters">
      <div className="filterable-table-filters-rows-shown">
        Show{' '}
        <select defaultValue={defaultShownCursor ?? entriesShownCursors?.[0]} className="filterable-table-filters-rows-shown-control" onChange={e => onEntriesShownNumberChange(parseInt(e.target.value))}>
          {entriesShownCursors.map(num => (
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