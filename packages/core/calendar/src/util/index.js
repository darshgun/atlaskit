// @flow

import type { DateObj } from '../types';

type DateToStringOptions = {
  fixMonth: boolean,
};

const i18n = {
  'en-au': {
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    weekdays: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
  },
};

function getI18n() {
  return i18n['en-au'];
}

function pad(num) {
  return num < 10 ? `0${num}` : num;
}

export function getShortDayName(i: number) {
  return getI18n().weekdays[i].substring(0, 3);
}

export function getMonthName(i: number) {
  return getI18n().months[i - 1];
}

export function dateToString(
  date: DateObj,
  { fixMonth }: DateToStringOptions = {},
) {
  return `${date.year}-${pad(date.month + (fixMonth ? 1 : 0))}-${pad(
    date.day,
  )}`;
}

export function makeArrayFromNumber(i: number): Array<number> {
  const arr = [];
  for (let a = 0; a < i; a += 1) {
    arr.push(a);
  }
  return arr;
}

export interface LocalizationProvider {
  getDaysShort: () => Array<string>;
  getMonthsLong: () => Array<string>;
  formatDate: Date => string;
  formatTime: Date => string;
}

export const createLocalizationProvider = (
  locale: string,
): LocalizationProvider => {
  // Intl.DateFormat expects locales in the format of 'la-CO' however it is
  // common for locale to be provided in the format of 'la_CO', where 'la' is
  // language and 'CO' is country.
  const normalizedLocale = locale && locale.replace('_', '-');

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
      // Date range chosen which has a Mon-Sun range so we can pull the titles out
      .format(new Date(2000, 4, day))
      .replace(/\s/g, '')
      .substring(0, 3),
  );

  const monthsLong = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(month =>
    // Date chosen for no real reason, the only important part is the month
    monthFormatter.format(new Date(2000, month, 1)),
  );

  return {
    getDaysShort: () => daysShort,
    getMonthsLong: () => monthsLong,
    formatDate: (date: Date) => dateFormatter.format(date),
    formatTime: (date: Date) => timeFormatter.format(date),
  };
};
