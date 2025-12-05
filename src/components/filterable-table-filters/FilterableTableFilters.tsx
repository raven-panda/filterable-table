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
      <div>
        Show{' '}
        <select defaultValue={defaultShownCursor ?? entriesShownCursors?.[0]} onChange={e => onEntriesShownNumberChange(parseInt(e.target.value))}>
          {entriesShownCursors.map(num => (
            <option key={"entriesShownCursor_" + num} value={num}>{num}</option>
          ))}
        </select>{' '}
        entries
      </div>
      <div>
        Search: <input id="filterable-table-search" name="filterable-table-search" onChange={e => onSearchChange(e.target.value)} />
      </div>
    </div>
  )
};