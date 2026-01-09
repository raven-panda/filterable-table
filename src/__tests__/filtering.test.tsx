import { describe, expect, test } from "vitest";
import { FilterableTable } from "../components";
import { TestUtils } from "./utils/TestUtils";
import { fireEvent, render, screen } from "@testing-library/react";

/**
 * @todo
 * - Test search
 * - Test shown entries
 * - Test sorting on each column
 * - Test date format
 * - Test pagination for each case
 */

describe('Given I pass data in the table component for filtering', () => {
  describe('When I set useFiltering to true', () => {
    test('Then entries shown selector should be present', async () => {
      render(
        <FilterableTable
          id={TestUtils.tableId}
          dateFormat="YYYY/MM/DD"
          columns={TestUtils.columnList}
          dataList={TestUtils.dataList}
          useFiltering={true}
        />
      );

      const entriesShownSelectLabel = screen.queryByTestId('filterable-table-filters-rows-shown-label');
      expect(entriesShownSelectLabel).toBeTruthy();
      const entriesShownSelect = screen.queryByTestId('filterable-table-filters-rows-shown-control');
      expect(entriesShownSelect).toBeTruthy();
    });

    test('Then search field should be present', async () => {
      render(
        <FilterableTable
          id={TestUtils.tableId}
          dateFormat="YYYY/MM/DD"
          columns={TestUtils.columnList}
          dataList={TestUtils.dataList}
          useFiltering={true}
        />
      );

      const searchInputLabel = screen.queryByTestId('filterable-table-search-label');
      expect(searchInputLabel).toBeTruthy();
      const searchInput = screen.queryByTestId('filterable-table-search');
      expect(searchInput).toBeTruthy();
    });
  });
  describe('When I set useFiltering to false', () => {
    test('Then entries shown selector should be present', async () => {
      render(
        <FilterableTable
          id={TestUtils.tableId}
          dateFormat="YYYY/MM/DD"
          columns={TestUtils.columnList}
          dataList={TestUtils.dataList}
          useFiltering={false}
        />
      );

      const entriesShownSelectLabel = screen.queryByTestId('filterable-table-filters-rows-shown-label');
      expect(entriesShownSelectLabel).toBeFalsy();
      const entriesShownSelect = screen.queryByTestId('filterable-table-filters-rows-shown-control');
      expect(entriesShownSelect).toBeFalsy();
    });

    test('Then search field should be present', async () => {
      render(
        <FilterableTable
          id={TestUtils.tableId}
          dateFormat="YYYY/MM/DD"
          columns={TestUtils.columnList}
          dataList={TestUtils.dataList}
          useFiltering={false}
        />
      );

      const searchInputLabel = screen.queryByTestId('filterable-table-search-label');
      expect(searchInputLabel).toBeFalsy();
      const searchInput = screen.queryByTestId('filterable-table-search');
      expect(searchInput).toBeFalsy();
    });
  });

  describe('When I type in the search field', () => {
    test('Then it should filter the rows', async () => {
      render(
        <FilterableTable
          id={TestUtils.tableId}
          dateFormat="YYYY/MM/DD"
          columns={TestUtils.columnList}
          dataList={TestUtils.dataList}
          useFiltering={true}
        />
      );

      const queryString = TestUtils.dataList[0].values['firstname']!.toLowerCase();
      const searchInput: HTMLInputElement = screen.getByTestId('filterable-table-search');
      fireEvent.change(searchInput, { target: { value: queryString }});

      const expectedLength = TestUtils.dataList
        .filter(item => Object.values(item.values).some(d => d?.toLowerCase().includes(queryString)))
        .length;
      
      const rows = screen.getAllByRole("row");
      expect(rows.length).toBe(expectedLength);
    })
  });

  describe('When I change entries shown select value', () => {
    test('Then it should filter the rows count', async () => {
      render(
        <FilterableTable
          id={TestUtils.tableId}
          dateFormat="YYYY/MM/DD"
          columns={TestUtils.columnList}
          dataList={TestUtils.dataList}
          useFiltering={true}
        />
      );

      const wantedLength = 25;
      const entriesShownSelect: HTMLSelectElement = screen.getByTestId('filterable-table-filters-rows-shown-control');
      fireEvent.change(entriesShownSelect, { target: { value: wantedLength }});

      const expectedLength = Math.min(TestUtils.dataList.length, wantedLength);

      const rows = screen.getAllByRole("row");
      expect(rows.length).toBe(expectedLength);
    })
  });
});