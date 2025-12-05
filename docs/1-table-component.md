**Next doc : [Front-end data filtering / sorting](./2-filters-and-pagination.md)**

# Filterable Table (FilterableTable) component

The main component (and purpose) of this library.

## Parameters

The component accepts multiple props to generate columns, set data to show and customize the table :

- **`id` _(default : `"filterable-table"`)_ :** will be applied to the `id` attribute of `<table>` element if you want a custom id

- **`className` :** will be applied to the `className` attribute of `<table>`, see [Styling the table](./3-styling-the-table#styling-the-table) doc for more information about style customization

- **`tableStyle` :** will be applied to the `style` attribute of `<table>`, see [Styling the table](./3-styling-the-table#styling-the-table) doc for more information about style customization

- **`columns` :** a list of objects that will define how to display each column and its behaviour towards filtering / sorting, see [Dynamic column/row generation](#dynamic-columnrow-generation).

- **`dataList` _(default : `[]`)_ :** your data array, each of your table record must be converted to the `FilterableTableData` type.

- **`dateFormat` _(default : `YYYY/MM/DD`)_ :** if you want to show dates in your table, you can provide a date format compatible with the [date-format-parse](https://www.npmjs.com/package/date-format-parse) library. If you use another library, just format your date and specify the `dataType` of your dates columns to `string` (or do not specify dataType at all since the fallback type is `string`).

- **`isLoading` _(default : `false`)_ :** setting this to true will show one row with a loading message, customizable with the next prop

- **`loadingIndicatorContent` _(default : `"Loading data..."`)_ :** accepts ReactNode, will be rendered in the loading row

- **`useSorting` _(default : `true`)_ :** set to false if you don't want to be able to sort data by clicking on the columns headings

- **`useFiltering` _(default : `true`)_ :** set to false if you don't want to be able to filter the data at all from inside the table

- **`usePagination` _(default : `true`)_ :** set to false if you don't want to be able to use pagination of the data at all from inside the table

- **`defaultShownEntriesAmount` :** the default value selected in the show entries amount `<select>`, must be a value of `entriesShownOptions`. If no value is specified, will take the first value of `entriesShownOptions` array defined.

- **`entriesShownOptions` _(default : `[10, 25, 50, 100]`)_ :** options you want to provide in the show entries amount select filter

- **`previousButtonContent` _(default : `"Previous"`)_ :** the content of the previous page button of the pagination component (accepts `ReactNode`)

- **`nextButtonContent` _(default : `"Next"`)_ :** the content of the next page button of the pagination component (accepts `ReactNode`)

- **`customFilterComponent` :** provides tables's current states props and must return a `ReactNode`, will replace the default filter component. See [Filters and pagination components](./2-filters-and-pagination#filters-filterabletablefilters-and-pagination-filterabletablepagination-components) doc for more infos.

- **`customPaginationComponent` :** provides tables's current states props and must return a `ReactNode`, will replace the default pagination component. See [Filters and pagination components](./2-filters-and-pagination#filters-filterabletablefilters-and-pagination-filterabletablepagination-components) doc for more infos.

## Dynamic column/row generation

The table structure generates dynamicaly. To create your structure, you have to pass a list of `FilterableTableColumn` in the `columns` prop of the table. A column list has to look like :
```ts
const columns: FilterableTableColumn[] = [
  {
    name: "First name",
    dataKey: "firstName", // I recommend to use the same data key as your data for your column, therefore you have less code to write to transform data to table data
    dataType: "string", // Optional, accepts literals "string", "number" or "date", this will allow the table to cast/parse your data to the right type for filtering, sorting, etc
    disableSorting: true, // Setting this to true disables the built-in sorting on this column
    disableSearching: true // Setting this to true disables the built-in searching on this column
  }
  // ... and the other columns you want
],
```

And here comes your data. Of course you need to make your data structure match the component one. Here's an example of data used by the table :
```ts
const data: FilterableTableData[] = [
  // An object here is basicaly a row
  {
    // Why a "values" object and not just a list and key/val pairs ? Simply : compatibility issues. If in the future this needs to have more parameters, it won't break any implementation at this level or overwhelm the code with systematic object mappings
    values: {
      firstName: "John", // The key here must match the column dataKey property one, it's for mapping the data to the right col
      lastName: "Doe",
      // ... etc
    }
  }
]
```

**Next doc : [Front-end data filtering / sorting](./2-filters-and-pagination.md)**

