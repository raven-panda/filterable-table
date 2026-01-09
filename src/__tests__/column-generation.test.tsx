import { describe, expect, test } from "vitest";
import { render, screen, } from "@testing-library/react";
import { FilterableTable } from "../components";
import { FilterableTableColumn } from "../types";
import { TestUtils } from "./utils/TestUtils";

describe('Given I pass a collection of column definitions in the table component', () => {
  test('Then it should render them', () => {
    render(
      <FilterableTable
        id={TestUtils.tableId}
        columns={TestUtils.columnList}
      />
    );

    for (const column of TestUtils.columnList) {
      const columnElement = screen.getByText(column.name);
      expect(columnElement).toBeTruthy();
      expect(columnElement.innerHTML).toBe(column.name);
      expect(columnElement.classList.contains('no-sorting')).toBe(true);
    }
  })
})