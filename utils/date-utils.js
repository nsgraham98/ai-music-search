// Date utility functions for handling Firestore timestamps and dates

/**
 * Converts various date formats to a JavaScript Date object
 * Handles Firestore timestamps, ISO strings, and regular Date objects
 * @param {*} dateValue - The date value to convert
 * @returns {Date|null} - JavaScript Date object or null if invalid
 */
export function convertToDate(dateValue) {
  if (!dateValue) {
    return null;
  }

  try {
    // If it's already a Date object
    if (dateValue instanceof Date) {
      return dateValue;
    }

    // If it's a Firestore Timestamp with toDate method (most common)
    if (
      dateValue &&
      typeof dateValue === "object" &&
      typeof dateValue.toDate === "function"
    ) {
      return dateValue.toDate();
    }

    // If it's a Firestore Timestamp (has seconds property)
    if (dateValue && typeof dateValue === "object" && dateValue.seconds) {
      return new Date(dateValue.seconds * 1000);
    }

    // If it's a Firestore Timestamp (check for _seconds property)
    if (dateValue && typeof dateValue === "object" && dateValue._seconds) {
      return new Date(dateValue._seconds * 1000);
    }

    // If it's an object that looks like {seconds: x, nanoseconds: y}
    if (
      dateValue &&
      typeof dateValue === "object" &&
      typeof dateValue.seconds === "number" &&
      typeof dateValue.nanoseconds === "number"
    ) {
      return new Date(dateValue.seconds * 1000);
    }

    // If it's a string or number, try to parse it
    if (typeof dateValue === "string" || typeof dateValue === "number") {
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }

    // If none of the above worked, return null
    return null;
  } catch (error) {
    console.error("Error converting date:", error, "Input was:", dateValue);
    return null;
  }
}

/**
 * Formats a date value as a localized date string
 * @param {*} dateValue - The date value to format
 * @param {string} fallback - Fallback text if date is invalid
 * @returns {string} - Formatted date string or fallback
 */
export function formatDate(dateValue, fallback = "Unknown date") {
  const date = convertToDate(dateValue);

  if (!date) {
    return fallback;
  }

  try {
    return date.toLocaleDateString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return fallback;
  }
}

/**
 * Formats a date value as a localized date and time string
 * @param {*} dateValue - The date value to format
 * @param {string} fallback - Fallback text if date is invalid
 * @returns {string} - Formatted date and time string or fallback
 */
export function formatDateTime(dateValue, fallback = "Unknown date") {
  const date = convertToDate(dateValue);

  if (!date) {
    return fallback;
  }

  try {
    return date.toLocaleString();
  } catch (error) {
    console.error("Error formatting date time:", error);
    return fallback;
  }
}

/**
 * Checks if a date value is valid
 * @param {*} dateValue - The date value to check
 * @returns {boolean} - True if valid date, false otherwise
 */
export function isValidDate(dateValue) {
  const date = convertToDate(dateValue);
  return date !== null && !isNaN(date.getTime());
}
