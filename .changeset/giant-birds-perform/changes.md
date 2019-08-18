Add locale support for Calendar/DateTimePicker/DatePicker/TimePicker:
- New prop `locale` enables localization for date/time format in `DatePicker`, `TimePicker` and
  `DateTimePicker`, and months/days in `Calendar`.
- Deprecated `dateFormat`, `timeFormat` and `formatDisplayLabel` props. Please use `locale` instead. If provided, these
  props will override `locale`.
- Default date/time placeholders now use `locale` to format the date.
