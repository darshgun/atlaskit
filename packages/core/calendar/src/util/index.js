// @flow

import type { DateObj } from '../types';

type DateToStringOptions = {
  fixMonth: boolean,
};

function pad(num) {
  return num < 10 ? `0${num}` : num;
}

export function dateToString(
  date: DateObj,
  { fixMonth }: DateToStringOptions = {},
) {
  return `${date.year}-${pad(date.month + (fixMonth ? 1 : 0))}-${pad(
    date.day,
  )}`;
}
