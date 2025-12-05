export type SortDirection = "asc" | "desc" | "none";
export type TableColumnDataType = "string" | "number" | "date";

export interface FilterableTableColumn<TDataKey = string> {
  name: string;
  dataKey: TDataKey;
  dataType?: TableColumnDataType;
  disableSorting?: boolean;
}
export interface FilterableTableData {
  values: {
    [key in string]: string | undefined;
  };
}