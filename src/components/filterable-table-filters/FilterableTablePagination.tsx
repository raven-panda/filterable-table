export interface FilterableTablePaginationProps {
  dataLength: number;
  entriesShownNumber: number;
  lastShownElementIndex: number,
  pageNumber: number;
  onPageNumberChange: (pageNumber: number) => void;
  previousButtonContent?: React.ReactNode;
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
  const goToPreviousPage = () => {
    if (pageNumber !== 1) {
      handlePageNumberChange(pageNumber - 1);
    }
  };

  const goToNextPage = () => {
    if (dataLength > entriesShownNumber * pageNumber) {
      handlePageNumberChange(pageNumber + 1);
    }
  };

  const handlePageNumberChange = (newPageNumber: number) => {
    onPageNumberChange?.(newPageNumber);
  };

  return (
    <div className="filterable-table-pagination">
      <div className="filterable-table-pagination-display">Showing {dataLength > 0 ? 1 + (pageNumber - 1) * entriesShownNumber : 0} to {lastShownElementIndex} of {dataLength} entries</div>
      <div className="filterable-table-pagination-controls">
        <button onClick={goToPreviousPage} className="filterable-table-pagination-controls-previous">{previousButtonContent}</button>
        {' '}<span className="filterable-table-pagination-page-number">{pageNumber}</span>{' '}
        <button onClick={goToNextPage} className="filterable-table-pagination-controls-next">{nextButtonContent}</button>
      </div>
    </div>
  );
}