import { format as formatDate, isDate } from "date-format-parse";
import { useCallback, useMemo, useState } from "react";
import { FilterableTableFilters, FilterableTableFiltersProps } from "../filterable-table-filters/FilterableTableFilters";
import { FilterableTablePagination, FilterableTablePaginationProps } from "../filterable-table-filters/FilterableTablePagination";
import { FilterableTableColumn, FilterableTableData, SortDirection } from "../../types/TableDataTypes";

export interface FilterableTableProps {
  id?: string;
  className?: string;
  tableStyle?: React.CSSProperties;
  columns: FilterableTableColumn[];
  dataList?: FilterableTableData[];
  dateFormat?: string;
  isLoading?: boolean;
  useSorting?: boolean;
  loadingIndicatorContent?: React.ReactNode;
  defaultShownCursor?: number;
  entriesShownCursors?: number[];
  previousButtonContent?: React.ReactNode;
  nextButtonContent?: React.ReactNode;
  customFilterComponent?: (props: FilterableTableFiltersProps) => React.ReactNode;
  customPaginationComponent?: (props: FilterableTablePaginationProps) => React.ReactNode;
}
/**
 * @todo Make the table style more customizable
 */
export function FilterableTable({
  id = "filterable-table",
  className = "",
  tableStyle,
  columns,
  dataList = [],
  dateFormat = 'YYYY/MM/DD',
  isLoading = false,
  useSorting = true,
  loadingIndicatorContent = "Loading data...",
  defaultShownCursor,
  entriesShownCursors,
  previousButtonContent,
  nextButtonContent,
  customFilterComponent,
  customPaginationComponent,
}: FilterableTableProps) {
  const [entriesShownNumber, setEntriesShownNumber] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchString, setSearchString] = useState<string>("");
  const [sortedColumn, setSortedColumn] = useState<{ id: string | undefined; direction: SortDirection }>({ id: undefined, direction: "none" });

  const sortData = (data: FilterableTableData[], column: FilterableTableColumn, direction: SortDirection) => {
    data.sort((a, b) => {
      const firstValue = direction === "asc" ? a.values[column.dataKey] : b.values[column.dataKey];
      const secondValue = direction === "asc" ? b.values[column.dataKey] : a.values[column.dataKey];

      switch (column.dataType) {
        case "number":
          return (Number(firstValue) || 0) - (Number(secondValue) || 0);
        case "date":
          return (new Date(firstValue || 0).getTime()) - (new Date(secondValue || 0).getTime());
        case "string":
        default:
          return (String(firstValue) || "").localeCompare(String(secondValue) || "");
      }
    });
  }

  // Filter data using the search string and search a match in one of the column
  const filteredDataList = useMemo(() => {
    const filteredData = dataList.filter(data => !searchString || Object.keys(data.values).some(dataKey => {
      const isValueDate = data.values[dataKey] && isDate(new Date(data.values[dataKey]));
      const valueToSearch = isValueDate
        ? formatDate(new Date(data.values[dataKey]!), dateFormat)
        : String(data.values[dataKey]);
      return valueToSearch.toLowerCase().includes(searchString.toLowerCase());
    }));
    
    if (useSorting && sortedColumn.id) {
      const column = columns.find(col => col.dataKey === sortedColumn.id);
      if (column && !column.disableSorting && sortedColumn.direction !== "none")
        sortData(filteredData, column, sortedColumn.direction);
    }

    return filteredData;
  }, [searchString, dataList, columns, sortedColumn, useSorting, dateFormat]);

  const cycleThroughSortDirections = (dataKey: string) => {
    setSortedColumn(prev => {
      const newDirection = prev.direction === "none" ? "asc" : prev.direction === "asc" ? "desc" : "none";
      return { id: dataKey, direction: prev.id !== dataKey ? "asc" : newDirection };
    });
  }

  const getClassNameForSortedColumn = useCallback((dataKey: string) => {
    if (sortedColumn.id !== dataKey)
      return "no-sorting";

    return sortedColumn.direction === "asc" ? "sorting-asc" : sortedColumn.direction === "desc" ? "sorting-desc" : "no-sorting";
  }, [sortedColumn]);

  const getLastShownElementIndex = useCallback(() => {
    const lastElementIndex = ((pageNumber - 1) * entriesShownNumber) + entriesShownNumber;
    if (lastElementIndex > filteredDataList.length)
      return filteredDataList.length;
    else
      return lastElementIndex;
  }, [filteredDataList, entriesShownNumber, pageNumber])

  // Slice for page filtering
  const pagedDataList = useMemo(() => {
    return filteredDataList
      .slice((pageNumber - 1) * entriesShownNumber, getLastShownElementIndex());
  }, [filteredDataList, pageNumber, entriesShownNumber, getLastShownElementIndex]);

  return (
    <>
      {customFilterComponent ? (
        customFilterComponent({
          onEntriesShownNumberChange: setEntriesShownNumber,
          onSearchChange: setSearchString,
          defaultShownCursor,
          entriesShownCursors,
        })
      ) : (
        <FilterableTableFilters
          onEntriesShownNumberChange={setEntriesShownNumber}
          onSearchChange={setSearchString}
          defaultShownCursor={defaultShownCursor}
          entriesShownCursors={entriesShownCursors}
        />
      )}
      <table id={id} className={`filterable-table ${className}`} style={tableStyle} cellSpacing={0}>
        <thead>
          <tr className="filterable-table-head-row">
            {columns.map(col => (
              <th
                key={"tableCol_" + col.dataKey}
                className={[
                  "filterable-table-head-cell",
                  useSorting && !col.disableSorting ? getClassNameForSortedColumn(col.dataKey) : ""
                ].join(" ").trim()}
                tabIndex={0}
                aria-controls={id}
                rowSpan={1}
                colSpan={1}
                scope="col"
                onClick={() => useSorting && !col.disableSorting && cycleThroughSortDirections(col.dataKey)}
              >
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
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
      ) : (
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
