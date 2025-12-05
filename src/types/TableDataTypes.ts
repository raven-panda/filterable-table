export type SortDirection = "asc" | "desc" | "none";
export type TableColumnDataType = "string" | "number" | "date";

export interface FilterableTableColumn<TDataKey = string> {
  /** Column display name */
  name: string;
  /** Column data key, used to access the corresponding value in data objects */
  dataKey: TDataKey;
  /** Column data type, used for sorting and formatting. If not set, fallbacks to "string" */
  dataType?: TableColumnDataType;
  /** If true, disables sorting for this column */
  disableSorting?: boolean;
  /** If true, disables searching for this column */
  disableSearching?: boolean;
}
export interface FilterableTableData {
  values: {
    [key in string]: string | undefined;
  };
}