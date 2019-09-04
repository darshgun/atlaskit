import { isValid, normalizeDate, toDate } from './utils';
import { normalizeLocale } from '../common';

const INVALID_DATE = new Date(NaN);
const INVARIANT_DATE = new Date(1993, 1, 18);
const FORMAT_EXTRACTOR_REGEX = /(\d+)[^\d]+(\d+)[^\d]+(\d+)\.?/;
const DATE_PARSER_REGEX = /(\d+)[^\d]*(\d+)?[^\d]*(\d+)?\.?/;

// Internet Explorer returns non-printing characters when formatting a date
const stripExtras = (str: string): string => str.replace(/\u200E/g, '');
const extractDateParts = (matchResult: RegExpMatchArray): number[] => {
  return (
    matchResult
      // Get the 3 capture groups
      .splice(1, 4)
      // Convert them to numbers
      .map(datePart => parseInt(datePart, 10))
  );
};

export type DateParser = (date: string) => Date;

/**
 * Creates a date parser function for a specific locale. The function will
 * either return a valid Date from the input or an Invalid Date object if the
 * input is invalid.
 *
 * @param locale - A BCP 47 language tag
 * @returns DateParser
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

  const shortDate = stripExtras(rawDateString);

  // Extract the date pieces from the locale formatted date string
  const formatMatch = shortDate.match(FORMAT_EXTRACTOR_REGEX);
  if (!formatMatch) {
    throw new Error('Unable to create DateParser');
  }

  const formatParts = extractDateParts(formatMatch);

  // Find the year/month/day positions
  const yearPosition = formatParts.indexOf(1993);
  const monthPosition = formatParts.indexOf(2);
  const dayPosition = formatParts.indexOf(18);

  return (date: string): Date => {
    const dateMatch = stripExtras(date).match(DATE_PARSER_REGEX);
    if (!dateMatch) {
      return INVALID_DATE;
    }

    const dateParts = extractDateParts(dateMatch);

    // Use the previously extracted year/month/day positions to extract each
    // date piece.
    const extractedDate = {
      year: dateParts[yearPosition],
      month: dateParts[monthPosition],
      day: dateParts[dayPosition],
    };

    const normalizedDate = normalizeDate(extractedDate);

    if (!isValid(normalizedDate)) {
      return INVALID_DATE;
    }

    return toDate(normalizedDate);
  };
};
