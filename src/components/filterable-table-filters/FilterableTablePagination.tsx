export interface FilterableTablePaginationProps {
  /** Current filtered data (before pagination) length */
  dataLength: number;
  /** Number of entries shown per page */
  entriesShownNumber: number;
  /** Index of the last shown element on the current page */
  lastShownElementIndex: number;
  /** Current page number */
  pageNumber: number;
  /** Handler for page number change */
  onPageNumberChange: (pageNumber: number) => void;
  /** Content for previous button */
  previousButtonContent?: React.ReactNode;
  /** Content for next button */
  nextButtonContent?: React.ReactNode;
}

export function FilterableTablePagination({
  dataLength,
  entriesShownNumber,
  lastShownElementIndex,
  pageNumber,
  onPageNumberChange,
  previousButtonContent = "Previous",
  nextButtonContent = "Next",
}: FilterableTablePaginationProps) {
  /**
   * If not on first page, go to previous page
   */
  const goToPreviousPage = () => {
    if (pageNumber !== 1) {
      handlePageNumberChange(pageNumber - 1);
    }
  };

  /**
   * If more data is available, go to next page
   */
  const goToNextPage = () => {
    if (dataLength > entriesShownNumber * pageNumber) {
      handlePageNumberChange(pageNumber + 1);
    }
  };

  /**
   * Handle page number change, calls `onPageNumberChange` prop
   * @param newPageNumber New page number to set
   */
  const handlePageNumberChange = (newPageNumber: number) => {
    onPageNumberChange?.(newPageNumber);
  };

  return (
    <div className="filterable-table-pagination">
      <div className="filterable-table-pagination-display">Showing {dataLength > 0 ? 1 + (pageNumber - 1) * entriesShownNumber : 0} to {lastShownElementIndex} of {dataLength} entries</div>
      <div className="filterable-table-pagination-controls">
        <button onClick={goToPreviousPage} className="filterable-table-pagination-controls-previous" data-testid="filterable-table-pagination-controls-previous">{previousButtonContent}</button>
        {' '}<span className="filterable-table-pagination-page-number" data-testid="filterable-table-pagination-page-number">{pageNumber}</span>{' '}
        <button onClick={goToNextPage} className="filterable-table-pagination-controls-next" data-testid="filterable-table-pagination-controls-next">{nextButtonContent}</button>
      </div>
    </div>
  );
}