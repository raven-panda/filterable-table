import { format as formatDate } from "date-format-parse";
import { describe, expect, test } from "vitest";
import { render, screen, } from "@testing-library/react";
import { FilterableTable } from "../components";
import { TestUtils } from "./utils/TestUtils";

describe('Given I pass data in the table component', () => {
  describe('When data key have a attributed column', () => {
    test('Then it should render it', () => {
      render(
        <FilterableTable
          id={TestUtils.tableId}
          dateFormat="YYYY/MM/DD"
          columns={TestUtils.columnList}
          dataList={TestUtils.dataList}
          usePagination={false}
          useFiltering={false}
          useSorting={false}
        />
      );

      const rows = screen.getAllByRole("row");
      expect(rows.length).toBe(TestUtils.dataList.length);
      const headRow = screen.getByRole("rowheader");
      expect(headRow).toBeTruthy();

      rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll("td");
        const data = TestUtils.dataList[rowIndex];

        TestUtils.columnList.forEach((column, colIndex) => {
          let expected = data.values[column.dataKey];

          if (column.dataType === "date" && expected) {
            expected = formatDate(new Date(expected), "YYYY/MM/DD");
          }

          expect(cells[colIndex].textContent).toBe(String(expected ?? "-"));
        });
      });
    })
  })
})