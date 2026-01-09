import { format as formatDate } from "date-format-parse";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { FilterableTable } from "../components";
import { TestUtils } from "./utils/TestUtils";

describe('Given I pass data in the table component for pagination', () => {
  describe('When I set usePagination to true', () => {
    test('Then pagination controls should be present', async () => {
      render(
        <FilterableTable
          id={TestUtils.tableId}
          dateFormat="YYYY/MM/DD"
          columns={TestUtils.columnList}
          dataList={TestUtils.dataList}
          usePagination={true}
        />
      );

      const previousButton = screen.queryByTestId('filterable-table-pagination-controls-previous');
      expect(previousButton).toBeTruthy();
      const nextButton = screen.queryByTestId('filterable-table-pagination-controls-next');
      expect(nextButton).toBeTruthy();
      const pageCountDisplay = screen.queryByTestId('filterable-table-pagination-page-number');
      expect(pageCountDisplay).toBeTruthy();
    });
  });

  describe('When I set usePagination to false', () => {
    test('Then pagination controls should not be present', async () => {
      render(
        <FilterableTable
          id={TestUtils.tableId}
          dateFormat="YYYY/MM/DD"
          columns={TestUtils.columnList}
          dataList={TestUtils.dataList}
          usePagination={false}
        />
      );

      const previousButton = screen.queryByTestId('filterable-table-pagination-controls-previous');
      expect(previousButton).toBeFalsy();
      const nextButton = screen.queryByTestId('filterable-table-pagination-controls-next');
      expect(nextButton).toBeFalsy();
      const pageCountDisplay = screen.queryByTestId('filterable-table-pagination-page-number');
      expect(pageCountDisplay).toBeFalsy();
    });
  });

  describe('When I load the page', () => {
    test('Then it should render first page', async () => {
      render(
        <FilterableTable
          id={TestUtils.tableId}
          dateFormat="YYYY/MM/DD"
          columns={TestUtils.columnList}
          dataList={TestUtils.dataList}
          useFiltering={true}
        />
      );

      // Just to be sure we have the wanted amount of elements shown
      const wantedLength = 10;
      const entriesShownSelect: HTMLSelectElement = screen.getByTestId('filterable-table-filters-rows-shown-control');
      fireEvent.change(entriesShownSelect, { target: { value: wantedLength }});

      const expectedLength = Math.min(TestUtils.dataList.slice(0, 10).length, wantedLength);
      
      const rows = screen.getAllByRole("row");
      expect(rows.length).toBe(expectedLength);

      const pageCountDisplay = screen.getByTestId('filterable-table-pagination-page-number');
      expect(pageCountDisplay.textContent).toBe("1");

      // Checking if first row matches first data
      const cells = rows[0].querySelectorAll("td");
      const data = TestUtils.dataList[0];
      TestUtils.columnList.forEach((column, colIndex) => {
        let expected = data.values[column.dataKey];

        if (column.dataType === "date" && expected) {
          expected = formatDate(new Date(expected), "YYYY/MM/DD");
        }

        expect(cells[colIndex].textContent).toBe(String(expected ?? "-"));
      });
    })
  });

  describe('When I load the page', () => {
    test('Then it should render first page', async () => {
      render(
        <FilterableTable
          id={TestUtils.tableId}
          dateFormat="YYYY/MM/DD"
          columns={TestUtils.columnList}
          dataList={TestUtils.dataList}
          useFiltering={true}
        />
      );

      // Just to be sure we have the wanted amount of elements shown
      const wantedLength = 10;
      const wantedPageIndex = 2;
      const entriesShownSelect: HTMLSelectElement = screen.getByTestId('filterable-table-filters-rows-shown-control');
      fireEvent.change(entriesShownSelect, { target: { value: wantedLength }});

      const expectedLength = TestUtils.dataList.slice(0 + (wantedLength * wantedPageIndex), 10 + (wantedLength * wantedPageIndex)).length;

      const nextButton = screen.getByTestId('filterable-table-pagination-controls-next');
      for (let i = 0; i < wantedPageIndex; i++) {
        fireEvent.click(nextButton);
      }

      const pageCountDisplay = screen.getByTestId('filterable-table-pagination-page-number');
      expect(pageCountDisplay.textContent).toBe("3");

      const rows = screen.getAllByRole("row");
      expect(rows.length).toBe(expectedLength);

      // Checking if first row matches first data
      const cellsForFirst = rows[0].querySelectorAll("td");
      const dataForFirst = TestUtils.dataList[wantedLength * wantedPageIndex];
      TestUtils.columnList.forEach((column, colIndex) => {
        let expected = dataForFirst.values[column.dataKey];

        if (column.dataType === "date" && expected) {
          expected = formatDate(new Date(expected), "YYYY/MM/DD");
        }

        expect(cellsForFirst[colIndex].textContent).toBe(String(expected ?? "-"));
      });

      // Checking if last row matches first data
      const cellsForLast = rows[rows.length - 1].querySelectorAll("td");
      const dataForLast = TestUtils.dataList[9 + (wantedLength * wantedPageIndex)];
      TestUtils.columnList.forEach((column, colIndex) => {
        let expected = dataForLast.values[column.dataKey];

        if (column.dataType === "date" && expected) {
          expected = formatDate(new Date(expected), "YYYY/MM/DD");
        }

        expect(cellsForLast[colIndex].textContent).toBe(String(expected ?? "-"));
      });
    })
  });
});