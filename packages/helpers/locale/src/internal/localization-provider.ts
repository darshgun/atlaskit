import { normalizeLocale } from './common';
import { createDateParser, DateParser } from './date-parser';

export type DateFormatter = (date: Date) => string;

export interface LocalizationProvider {
  getDaysShort: () => Array<string>;
  getMonthsLong: () => Array<string>;
  formatDate: DateFormatter;
  formatTime: DateFormatter;
  parseDate: DateParser;
}

export const createLocalizationProvider = (
  locale: string,
): LocalizationProvider => {
  // Intl.DateFormat expects locales in the format of 'la-CO' however it is
  // common for locale to be provided in the format of 'la_CO', where 'la' is
  // language and 'CO' is country.
  const normalizedLocale = normalizeLocale(locale);

  const dayFormatter = Intl.DateTimeFormat(normalizedLocale, {
    weekday: 'short',
  });
  const monthFormatter = Intl.DateTimeFormat(normalizedLocale, {
    month: 'long',
  });
  const dateFormatter = Intl.DateTimeFormat(normalizedLocale);
  const timeFormatter = Intl.DateTimeFormat(normalizedLocale, {
    hour: 'numeric',
    minute: 'numeric',
  });

  const daysShort = [1, 2, 3, 4, 5, 6, 7].map(day =>
    // Some short days are longer than 3 characters but are unique if the first
    // three non-white characters are used.
    dayFormatter
      // Date range chosen which has a Sun-Sat range so we can extract the names
      .format(new Date(2000, 9, day, 12))
      // \u200E matches on the Left-to-Right Mark character in IE/Edge
      .replace(/[\s\u200E]/g, '')
      .substring(0, 3),
  );

  const monthsLong = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(month =>
    // Date chosen for no real reason, the only important part is the month
    monthFormatter.format(new Date(2000, month, 1)),
  );

  const parseDate = createDateParser(normalizedLocale);

  return {
    getDaysShort: () => daysShort,
    getMonthsLong: () => monthsLong,
    formatDate: dateFormatter.format,
    formatTime: timeFormatter.format,
    parseDate,
  };
};
