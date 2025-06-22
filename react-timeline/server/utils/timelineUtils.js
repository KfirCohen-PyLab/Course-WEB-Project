/**
 * Sorts timeline events by their date year in ascending order.
 * Events without a valid year are placed at the beginning.
 * @param {Array} events - Array of timeline event objects, each with a 'date' string.
 * @returns {Array} Sorted array of events by year.
 */

function sortTimelineEvents(events) {
  return events.sort((a, b) => {
    const yearA = extractYear(a.date);
    const yearB = extractYear(b.date);
    if (yearA === null && yearB === null) return 0;
    if (yearA === null) return -1;
    if (yearB === null) return 1;
    return yearA - yearB;
  });
}

/**
 * Extracts the year as a number from a date string.
 * Supports BC years (returns negative integer) and AD years.
 * Returns null if no valid year is found.
 * @param {string} dateStr - Date string to extract year from (e.g., "500 BC", "1999").
 * @returns {number|null} Year as integer (negative for BC), or null if invalid.
 */

function extractYear(dateStr) {
  if (!dateStr) return null;
  const bcMatch = dateStr.match(/(?:[A-Za-z]+\s)?(\d{1,4})\s*BC/i);
  if (bcMatch) return -parseInt(bcMatch[1]);
  const adMatch = dateStr.match(/(?:[A-Za-z]+\s)?(\d{3,4})$/);
  if (adMatch) return parseInt(adMatch[1]);
  return null;
}

/**
 * Filters timeline events to only include those within the given year range.
 * Events without a valid year are excluded.
 * @param {Array} events - Array of timeline event objects, each with a 'date' string.
 * @param {number} startYear - Start year of the filter range (inclusive).
 * @param {number} endYear - End year of the filter range (inclusive).
 * @returns {Array} Filtered array of events within the specified year range.
 */

function filterTimelineEventsByYear(events, startYear, endYear) {
  return events.filter(event => {
    const year = extractYear(event.date);
    if (year === null) return false;
    return year >= startYear && year <= endYear;
  });
}

module.exports = { sortTimelineEvents, extractYear, filterTimelineEventsByYear };