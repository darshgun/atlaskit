// @flow

const INVARIANT_DATE = new Date(1993, 1, 18);
const FORMAT_EXTRACTOR_REGEX = /(\d+)[/.-](\d+)[/.-](\d+)\.?/;
const DATE_PARSER_REGEX = /(\d+)[/.-]?(\d+)?[/.-]?(\d+)?\.?/;

const normalizeLocale = (locale: string): string => locale.replace(/_/g, '-');
const stripWhitespace = (str: string): string => str.replace(/\s/g, '');
const extractDateParts = (matchResult: RegExp$matchResult): number[] => {
  return (
    matchResult
      // Get the 3 capture groups
      .splice(1, 4)
      // Convert them to numbers
      .map(datePart => parseInt(datePart, 10))
  );
};

export type DateParser = string => Date | null;

/**
 * Creates a date parser function for a specific locale.
 *
 * @param locale - A BCP 47 language tag
 * @returns {(function(): Date)|Function}
 */
export const createDateParser = (locale: string): DateParser => {
  // Intl.DateFormat expects locales in the format of 'la-CO' however it is
  // common for locale to be provided in the format of 'la_CO', where 'la' is
  // language and 'CO' is country.
  const normalizedLocale = normalizeLocale(locale);
  const dateFormatter = Intl.DateTimeFormat(normalizedLocale);

  // Generate a date string from a hard coded date, this allows us to determine
  // the year/month/day position for the provided locale.
  const rawDateString = dateFormatter.format(INVARIANT_DATE);

  // Some date strings contain whitespace which we can ignore
  const shortDate = stripWhitespace(rawDateString);

  // Extract the date pieces from the locale formatted date string
  const formatMatch = shortDate.match(FORMAT_EXTRACTOR_REGEX);
  if (!formatMatch) {
    return () => null;
  }

  const formatParts = extractDateParts(formatMatch);

  // Find the year/month/day positions
  const yearPosition = formatParts.indexOf(1993);
  const monthPosition = formatParts.indexOf(2);
  const dayPosition = formatParts.indexOf(18);

  return (date: string): Date | null => {
    // The current date is a backup is used to fill in missing date pieces
    const now = new Date();

    // Some date strings contain whitespace which we can ignore
    const dateMatch = stripWhitespace(date).match(DATE_PARSER_REGEX);
    if (!dateMatch) {
      return null;
    }

    const dateParts = extractDateParts(dateMatch);

    // Use the previously extracted year/month/day positions to extract each
    // date piece. The current date is used to fill in
    const year = dateParts[yearPosition] || now.getFullYear();
    const month = dateParts[monthPosition] - 1 || now.getMonth();
    const day = dateParts[dayPosition] || now.getDate();

    return new Date(year, month, day);
  };
};
