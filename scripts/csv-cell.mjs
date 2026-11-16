/**
 * Quote one value for a CSV cell.
 *
 * Spreadsheet apps evaluate a cell that begins with = + - @ (or a tab / carriage
 * return, which some parsers strip before looking) as a formula. Archive fields
 * are typed by anonymous visitors, so a name like =HYPERLINK("https://evil", "x")
 * would otherwise become a live formula the moment the export is opened. A
 * leading apostrophe makes the cell plain text.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function csvCell(value) {
  let text = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}
