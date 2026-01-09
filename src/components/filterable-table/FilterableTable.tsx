import { format as formatDate, isDate } from "date-format-parse";
import { useCallback, useMemo, useState } from "react";
import { FilterableTableFilters, FilterableTableFiltersProps } from "../filterable-table-filters/FilterableTableFilters";
import { FilterableTablePagination, FilterableTablePaginationProps } from "../filterable-table-filters/FilterableTablePagination";
import { FilterableTableColumn, FilterableTableData, SortDirection } from "../../types/TableDataTypes";
import { compareDates, compareNumbers, compareStrings, normalizeForSearch, toValidDate } from "../../utils/FormatParseUtils";

export interface FilterableTableProps {
  /** Id applied to the root <table> element */
  id?: string;
  /** CSS class applied to the root <table> element */
  className?: string;
  /** Style applied to the root <table> element */
  tableStyle?: React.CSSProperties;
  /** Columns to display in the table */
  columns: FilterableTableColumn[];
  /** Data to display in the table */
  dataList?: FilterableTableData[];
  /** Date format used for date formatting. Must be compatible with date-format-parse @see https://www.npmjs.com/package/date-format-parse */
  dateFormat?: string;
  /** If true, show a single row with the loading indicator */
  isLoading?: boolean;
  /** Set this to false to disable sorting completely */
  useSorting?: boolean;
  /** Set this to false to disable filtering completely */
  useFiltering?: boolean;
  /** Set this to false to disable pagination completely */
  usePagination?: boolean;
  /** What content to display while loading */
  loadingIndicatorContent?: React.ReactNode;
  /** Default number of entries to show per page */
  defaultShownEntriesAmount?: number;
  /** Options for number of entries to show per page */
  entriesShownOptions?: number[];
  /** Content for the previous page button */
  previousButtonContent?: React.ReactNode;
  /** Content for the next page button */
  nextButtonContent?: React.ReactNode;
  /** Allows custom filter component. Table's state and handlers are passed as props. */
  customFilterComponent?: (props: FilterableTableFiltersProps) => React.ReactNode;
  /** Allows custom pagination component. Table's state and handlers are passed as props. */
  customPaginationComponent?: (props: FilterableTablePaginationProps) => React.ReactNode;
}

export function FilterableTable({
  id = "filterable-table",
  className = "",
  tableStyle,
  columns,
  dataList = [],
  dateFormat = 'YYYY/MM/DD',
  isLoading = false,
  useSorting = true,
  useFiltering = true,
  usePagination = true,
  loadingIndicatorContent = "Loading data...",
  defaultShownEntriesAmount,
  entriesShownOptions = [10, 25, 50, 100],
  previousButtonContent,
  nextButtonContent,
  customFilterComponent,
  customPaginationComponent,
}: FilterableTableProps) {
  // State variables
  const [entriesShownNumber, setEntriesShownNumber] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchString, setSearchString] = useState<string>("");
  const [sortedColumn, setSortedColumn] = useState<{ id: string | undefined; direction: SortDirection }>({ id: undefined, direction: "none" });

  /**
   * Compare two data rows for sorting
   * @param a First data row
   * @param b Second data row
   * @param column Column to sort by
   * @param direction Direction to sort (asc, desc)
   */
  const compareForSorting = (a: FilterableTableData, b: FilterableTableData, column: FilterableTableColumn, direction: SortDirection) => {
    const key = String(column.dataKey);
    const firstValue = a.values[key];
    const secondValue = b.values[key];

    let res = 0;
    // Sort based on data type, use dataType to cast values accordingly
    switch (column.dataType) {
      case "number":
        res = compareNumbers(firstValue, secondValue);
        break;
      case "date":
        res = compareDates(firstValue, secondValue);
        break;
      case "string":
      default:
        res = compareStrings(firstValue, secondValue);
        break;
    }

    // Reverse result for descending order
    return direction === "desc" ? -res : res;
  }

  /**
   * @param data Data to sort
   * @param column Column to sort by
   * @param direction Direction to sort (asc, desc, none)
   */
  const sortData = (data: FilterableTableData[], column: FilterableTableColumn, direction: SortDirection) => {
    if (!column || direction === "none") return [...data];

    return [...data].sort((a, b) => {
      const r = compareForSorting(a, b, column, direction);
      return r === 0 ? 0 : r;
    });
  }

  /**
   * Filtered data using the search string and search a match in one of the column
   */
  const filteredDataList = useMemo(() => {
    if (!useFiltering)
      return dataList;

    let filteredData = dataList;

    const search = (searchString ?? "").toString().trim();
    if (search) {
      // Create a map of columns by dataKey for quick access
      const colByKey = new Map<string, FilterableTableColumn>();
      const disabledSearchKeys = new Set<string>();

      for (const c of columns) {
        colByKey.set(String(c.dataKey), c);
        if (c.disableSearching) disabledSearchKeys.add(String(c.dataKey));
      }

      const normalizedSearch = normalizeForSearch(search);

      // Filter data based on search string
      filteredData = filteredData.filter(data => Object.keys(data.values).some(dataKey => {
        if (disabledSearchKeys.has(dataKey)) return false;

        // Get raw value, and return false if null or undefined
        const raw = data.values[dataKey];
        if (raw === null || raw === undefined) return false;

        const col = colByKey.get(dataKey);

        // Special handling for date columns
        if (col?.dataType === "date") {
          const d = toValidDate(raw);
          if (d) {
            const formatted = formatDate(d, dateFormat);
            return normalizeForSearch(String(formatted)).includes(normalizedSearch);
          }
          // Not a valid date -> do not exclude, fallback to string matching
        }

        // Default string matching
        return normalizeForSearch(String(raw)).includes(normalizedSearch);
      }));
    };
    
    // Sort data if a sorted column is defined
    if (useSorting && sortedColumn.id) {
      const column = columns.find(col => String(col.dataKey) === String(sortedColumn.id));
      // Sort only if sorting is not disabled for the column
      if (column && !column.disableSorting && sortedColumn.direction !== "none")
        return sortData(filteredData, column, sortedColumn.direction);
    }

    return filteredData;
  }, [searchString, dataList, columns, sortedColumn, useSorting, dateFormat, useFiltering]);

  /**
   * Cycle through sort directions for a column
   * @param dataKey Column data key to cycle sort direction for. If different from current sorted column, set to ascending.
   */
  const cycleThroughSortDirections = (dataKey: string) => {
    setSortedColumn(prev => {
      const newDirection = prev.direction === "none" ? "asc" : prev.direction === "asc" ? "desc" : "none";
      return { id: dataKey, direction: prev.id !== dataKey ? "asc" : newDirection };
    });
  }

  /**
   * Get class name for sorted column header
   * @param dataKey Column data key
   */
  const getClassNameForSortedColumn = useCallback((dataKey: string) => {
    if (sortedColumn.id !== dataKey)
      return "no-sorting";

    return sortedColumn.direction === "asc" ? "sorting-asc" : sortedColumn.direction === "desc" ? "sorting-desc" : "no-sorting";
  }, [sortedColumn]);

  /**
   * Get last shown element index based on current page and entries shown number
   */
  const getLastShownElementIndex = useCallback(() => {
    const lastElementIndex = ((pageNumber - 1) * entriesShownNumber) + entriesShownNumber;
    if (lastElementIndex > filteredDataList.length)
      return filteredDataList.length;
    else
      return lastElementIndex;
  }, [filteredDataList, entriesShownNumber, pageNumber])

  /**
   * Slice for page filtering
   */
  const pagedDataList = useMemo(() => {
    if (!usePagination)
      return filteredDataList;

    return filteredDataList
      .slice((pageNumber - 1) * entriesShownNumber, getLastShownElementIndex());
  }, [filteredDataList, pageNumber, entriesShownNumber, getLastShownElementIndex, usePagination]);

  return (
    <>
      {customFilterComponent ? (
        customFilterComponent({
          onEntriesShownNumberChange: setEntriesShownNumber,
          onSearchChange: setSearchString,
          defaultShownEntriesAmount,
          entriesShownOptions,
        })
      ) : useFiltering && (
        <FilterableTableFilters
          onEntriesShownNumberChange={setEntriesShownNumber}
          onSearchChange={setSearchString}
          defaultShownEntriesAmount={defaultShownEntriesAmount}
          entriesShownOptions={entriesShownOptions}
        />
      )}
      <table id={id} className={`filterable-table ${className}`} style={tableStyle} cellSpacing={0}>
        <thead className="filterable-table-head">
          <tr className="filterable-table-head-row" role="rowheader" data-testid="filterableTableHeadRow">
            {columns.map(col => (
              <th
                key={"tableCol_" + col.dataKey}
                data-testid={"cellhead" + col.dataKey}
                className={[
                  "filterable-table-head-cell",
                  useSorting && !col.disableSorting ? getClassNameForSortedColumn(col.dataKey) : ""
                ].join(" ").trim()}
                tabIndex={0}
                aria-controls={id}
                rowSpan={1}
                colSpan={1}
                scope="col"
                onClick={() => useSorting && !col.disableSorting && cycleThroughSortDirections(String(col.dataKey))}
              >
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="filterable-table-body">
          {isLoading ? (
            <tr className="filterable-table-row-loading row-odd">
              <td colSpan={columns.length}>{loadingIndicatorContent}</td>
            </tr>
          ) : pagedDataList.length > 0 ? pagedDataList.map((data, i) => (
            <tr key={"tableRow_" + i} role="row" className={["filterable-table-row", i % 2 === 0 ? "row-even" : "row-odd"].join(" ").trim()}>
              {columns.map(col => {
                let value = data.values[col.dataKey];
                if (col.dataType === "date" && value) {
                  value = formatDate(new Date(value), dateFormat);
                }
                return (
                  <td key={'colData_' + col.dataKey + i} className="filterable-table-cell">{value as string ?? '-'}</td>
                );
              })}
            </tr>
          )) : (
            <tr className="row-odd">
              <td colSpan={columns.length} className="filterable-table-row-no-data">No data available in table</td>
            </tr>
          )}
        </tbody>
      </table>
      {customPaginationComponent ? (
        customPaginationComponent({
          dataLength: filteredDataList.length,
          entriesShownNumber,
          lastShownElementIndex: getLastShownElementIndex(),
          onPageNumberChange: setPageNumber,
          pageNumber,
          previousButtonContent,
          nextButtonContent,
        })
      ) : usePagination && (
        <FilterableTablePagination
          dataLength={filteredDataList.length}
          lastShownElementIndex={getLastShownElementIndex()}
          entriesShownNumber={entriesShownNumber}
          pageNumber={pageNumber}
          onPageNumberChange={setPageNumber}
          previousButtonContent={previousButtonContent}
          nextButtonContent={nextButtonContent}
        />
      )}
    </>
  );
}
