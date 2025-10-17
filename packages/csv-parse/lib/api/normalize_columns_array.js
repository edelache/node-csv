import { CsvError } from "./CsvError.js";
import { is_object } from "../utils/is_object.js";

const normalize_columns_array = function (columns, duplicate_header_suffix = false) {
  console.log("duplicate_header_suffix", duplicate_header_suffix);
  const normalizedColumns = [];
  const headerCounts = {};

  for (let i = 0, l = columns.length; i < l; i++) {
    const column = columns[i];
    let columnName;
    let normalizedColumn;

    // Normalize the column first
    if (column === undefined || column === null || column === false) {
      normalizedColumn = { disabled: true };
    } else if (typeof column === "string") {
      columnName = column;
      normalizedColumn = { name: column };
    } else if (is_object(column)) {
      if (typeof column.name !== "string") {
        throw new CsvError("CSV_OPTION_COLUMNS_MISSING_NAME", [
          "Option columns missing name:",
          `property "name" is required at position ${i}`,
          "when column is an object literal",
        ]);
      }
      columnName = column.name;
      normalizedColumn = column;
    } else {
      throw new CsvError("CSV_INVALID_COLUMN_DEFINITION", [
        "Invalid column definition:",
        "expect a string or a literal object,",
        `got ${JSON.stringify(column)} at position ${i}`,
      ]);
    }

    // Handle duplicate header names if we have a column name and suffix option is enabled
    if (columnName && duplicate_header_suffix) {
      if (headerCounts[columnName] === undefined) {
        headerCounts[columnName] = 0;
      }
      headerCounts[columnName]++;

      if (headerCounts[columnName] > 1) {
        const finalName = `${columnName}_${headerCounts[columnName]}`;
        normalizedColumn = { ...normalizedColumn, name: finalName };
      }
    }

    normalizedColumns[i] = normalizedColumn;
  }

  return normalizedColumns;
};

export { normalize_columns_array };
