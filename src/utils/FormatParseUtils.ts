/**
 * Validate and convert input to a Date object if valid
 * @param input Input to validate
 * @returns Valid Date object or null if invalid
 */
export function toValidDate (input?: string | number | Date | null): Date | null {
  if (input == null)
    return null;
  if (input instanceof Date)
    return Number.isNaN(input.getTime()) ? null : input;

  const d = new Date(String(input));
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Normalize a string for searching (remove diacritics, lowercase, trim)
 * @param s String to normalize
 * @returns Normalized string for searching
 */
export function normalizeForSearch(s: string) {
  return s
    .normalize?.("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

/**
 * Compare two values as strings, case-insensitive
 * @param a First value
 * @param b Second value
 * @returns Comparison result: negative if a < b, positive if a > b, zero if equal
 */
export function compareStrings(a?: unknown, b?: unknown) {
  const sa = (a == null ? "" : String(a)).toLowerCase();
  const sb = (b == null ? "" : String(b)).toLowerCase();
  return sa.localeCompare(sb);
}

/**
 * Compare two values as numbers, with fallback to string comparison
 * @param a First value
 * @param b Second value
 * @returns Comparison result: negative if a < b, positive if a > b, zero if equal
 */
export function compareNumbers(a?: unknown, b?: unknown) {
  const na = Number(a), nb = Number(b);
  const aValid = Number.isFinite(na), bValid = Number.isFinite(nb);

  if (aValid && bValid)
    return na - nb;
  else if (aValid)
    return -1;
  else if (bValid)
    return 1;

  // fallback to string compare
  return compareStrings(a, b);
}

/**
 * Compare two values as dates, with fallback to string comparison
 * @param a First value
 * @param b Second value
 * @returns Comparison result: negative if a < b, positive if a > b, zero if equal
 */
export function compareDates(a?: any, b?: any) {
  const da = toValidDate(a);
  const db = toValidDate(b);

  if (da && db)
    return da.getTime() - db.getTime();
  else if (da && !db)
    return -1;
  else if (!da && db)
    return 1;

  // fallback to string compare
  return compareStrings(a, b);
}