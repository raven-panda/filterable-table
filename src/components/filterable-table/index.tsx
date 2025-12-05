import { useCallback, useMemo, useState } from "react";
import { FilterableTableFilters, FilterableTableFiltersProps, FilterableTablePagination, FilterableTablePaginationProps } from "../filterable-table-filters";

export interface FilterableTableColumn<TDataKey = string> {
  name: string;
  dataKey: TDataKey;
  disableSorting?: boolean;
}
export interface FilterableTableData {
  values: {
    [key in string]: string | undefined;
  };
}

export interface FilterableTableProps {
  id?: string;
  className?: string;
  tableStyle?: React.CSSProperties;
  columns: FilterableTableColumn[];
  dataList?: FilterableTableData[];
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

  // Filter data using the search string and search a match in one of the column
  const filteredDataList = useMemo(() => {
    return dataList
      .filter(data => !searchString || Object.keys(data.values).some(dataKey => data.values[dataKey]?.toLowerCase().includes(searchString.toLowerCase())));
  }, [searchString, dataList]);

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
          <tr>
            {columns.map(col => (
              <th key={"tableCol_" + col.dataKey} className={useSorting && !col.disableSorting ? "no-sorting" : ""} tabIndex={0} aria-controls={id} rowSpan={1} colSpan={1} scope="col">{col.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr className="row-odd">
              <td colSpan={columns.length}>{loadingIndicatorContent}</td>
            </tr>
          ) : pagedDataList.length > 0 ? pagedDataList.map((data, i) => (
            <tr key={"tableRow_" + i} role="row" className={i % 2 === 0 ? "row-even" : "row-odd"}>
              {columns.map(col => {
                const value = data?.values[col.dataKey];
                return (
                  <td key={'colData_' + col.dataKey + i} >{value ?? '-'}</td>
                );
              })}
            </tr>
          )) : (
            <tr className="row-odd">
              <td colSpan={columns.length}>No data available in table</td>
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
