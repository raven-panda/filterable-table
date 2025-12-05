**Previous doc : [Front-end data filtering / sorting](./2-filters-and-pagination.md)**

# Styling the table

I provide component props and CSS classes to allow you to style the table to your liking.

## Default style

This package includes a default style sheet. To use it, just add `import "@raven_panda/filterable-table/dist/index.css";` in your component file.

## Custom style

Or you can customize the table to your likings.

Firstly, the components provide two props to customize the style quickly : `style` and `className`. Both are applied to the `<table>` element.

And secondly, you can use a whole set of prewritten CSS classes, here's their list and to which element they are attached :

1. The filters component

- **`filterable-table-filters` :** container of the filters fields
- **`filterable-table-filters-rows-shown` :** the container of the `<select>` where you can pick how many rows you want to be shown in each pages
  - **`filterable-table-filters-rows-shown-control` :** this `<select>` element
- **`filterable-table-filters-search` :** the container of the text `<input>` that allows you to search in data
  - **`filterable-table-filters-search-field` :** this `<input>` element

2. The pagination component
- **`filterable-table-pagination` :** container of the pagination section
- **`filterable-table-pagination-display` :** the text's container that displays how many lines are shown (Showing ...)
- **`filterable-table-pagination-controls` :** the container of the buttons where you can cycle through pages and the shown page number
  - **`filterable-table-pagination-controls-previous` :** previous page button
  - **`filterable-table-pagination-controls-next` :** next page button
- **`filterable-table-pagination-page-number` :** the page number shown

3. The table component

- **`filterable-table` :** the main `<table>` element
- **`filterable-table-head` :** the `<thead>` element of the table, and elements in the head :
  - **`filterable-table-head-row` :** `<tr>` child of the table heading
  - **`filterable-table-head-cell` :** `<th>` children elements of the heading row, and some classes are dynamicaly added or removed (only present if you set the `useSorting` table prop to true and the sorting is disabled on this column via `FilterableTableColumn.disableSorting`) :
    - **`no-sorting` :** present when the column isn't sorted
    - **`sorting-asc` :** present when the column is sorted in ascending order
    - **`sorting-desc` :** present when the column is sorted in descending order
- **`filterable-table-body` :** the `<tbody>` element the table, and elements in the body
  - **`filterable-table-row-loading` :** the row `<tr>` rendered when table's `isLoading` prop is true
  - **`filterable-table-row-no-data` :** the row `<tr>` rendered when there's no data to show (empty `dataList`)
  - **`filterable-table-row` :** rows `<tr>` rendered for each data
    - **`filterable-table-cell` :** cells `<td>` inside a row
  - **`row-odd` :** each odd row index if you want to alternate their style
  - **`row-even` :** each even row index if you want to alternate their style
  
**Previous doc : [Front-end data filtering / sorting](./2-filters-and-pagination.md)**