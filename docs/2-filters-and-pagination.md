**Previous doc : [Filterable Table (FilterableTable) component](./1-table-component.md)**\
**Next doc : [Styling the table](./3-styling-the-table.md)**

# Front-end data filtering / sorting

The table provide a built-in front-end filtering, sorting and pagination, but if you want to do it outside the table or with a backend request, you can use `customFilterComponent` and `customPaginationComponent` to make a custom component for each, or disable them completely by setting `useSorting`, `useFiltering` and `usePagination` props to false.

## Features

### Filter how many entries you want to show per pages

You can set a maximum rows to show for each pages, and you can use a select control to let the user do that. It's given with the `FilterableTableFilters` default component.

### Pagination

And the component provides a pagination, it works with the entries amount to show state.

### Searching through data

There's also a state for the search string typed, so the user can search through all of the data. You can disable searching in a specific column using the `disableSearching` prop in column definition.

### Sort data (ascending, descending or none) by column

In complement of searching, there's also a sorting system triggered when you click on a column heading. It will cycle through ascending, descending and back to none. It can handle strings, numbers and date. About dates, it is important that you provide an ISO date string in the corresponding date data, because to make the comparison work the dates are parsed to a Date type.

## The default components : Filters (FilterableTableFilters) and pagination (FilterableTablePagination)

This package provides two default components that allow you to filter how much elements you want to see in one page, and an input where you can type to search through the columns (by default, all are included in the search, if you want to disable searching in one ore more column, see [Sort data (ascending, descending or none) by column](./1-table-component.md#sort-data-ascending-descending-or-none-by-column)), and another one to use pagination of your data.

### Replacing them

You can replace both of the default components by using `customFilterComponent` and `customPaginationComponent`. \
These are two functions that are called in the place of the components if it's set. They must return a `ReactNode`, and they both provide props of the current state of the main table component. This includes :

1. In `customFilterComponent` :

- **`onEntriesShownNumberChange` :** when called with a number, will set the number of entries you wanna show.
- **`onSearchChange` :** when called with a string, the value passed will trigger a search through table data. If you want to specify in which columns you want to search, see [Searching through data](./1-table-component.md#searching-through-data) section in the first documentation.
- **`defaultShownEntriesAmount` :** the defaultShownEntriesAmount set in the table props
- **`entriesShownOptions` :** the entriesShownOptions set in the table props

2. In `customPaginationComponent` :

- **`dataLength` :** the current filtered data (pagination not included) length in the table
- **`entriesShownNumber` :** the current number of entries shown in a page
- **`lastShownElementIndex` :** the array index in the data list of the last shown element in the current page
- **`onPageNumberChange` :** when called with a number, will set the current page index to the given page
- **`pageNumber` :** the current page number
- **`previousButtonContent` :** the content of the previous page button (accepts `ReactNode`)
- **`nextButtonContent` :** the content of the next page button (accepts `ReactNode`)

**Previous doc : [Filterable Table (FilterableTable) component](./1-table-component.md)**\
**Next doc : [Styling the table](./3-styling-the-table.md)**