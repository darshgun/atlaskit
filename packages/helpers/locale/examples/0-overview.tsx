import React, { Component } from 'react';
import { FieldTextStateless } from '@atlaskit/field-text';

import { LocalizationProvider, createLocalizationProvider } from '../src';
import { Locale, LocaleSelect } from '../example-helpers/LocaleSelect';

type State = {
  l10n: LocalizationProvider;
  dateInput: string;
  date: Date;
};

export default class Example extends Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      l10n: createLocalizationProvider('en-AU'),
      dateInput: '',
      date: new Date(),
    };
  }

  componentDidMount() {
    setInterval(
      () =>
        this.setState({
          date: new Date(),
        }),
      1000,
    );
  }

  onLocaleChange = (locale: Locale) => {
    this.setState({
      l10n: createLocalizationProvider(locale.value),
    });
  };

  onInputChange = (event: any) => {
    this.setState({
      dateInput: event.target.value,
    });
  };

  render() {
    const { l10n, dateInput, date } = this.state;
    const parsedDate = l10n.parseDate(dateInput);
    const parsedDateISO = isNaN(parsedDate.getDate())
      ? parsedDate.toString()
      : parsedDate.toISOString();
    return (
      <div>
        <h3>Locale</h3>
        <LocaleSelect onLocaleChange={this.onLocaleChange} />

        <h3>Date Parser</h3>
        <FieldTextStateless
          label="Input"
          value={dateInput}
          onChange={this.onInputChange}
          placeholder={l10n.formatDate(date)}
          shouldFitContainer
        />
        <FieldTextStateless
          label="Output"
          value={parsedDateISO}
          isReadOnly
          disabled
          shouldFitContainer
        />

        <h3>Date Formatter</h3>
        <p>{l10n.formatDate(date)}</p>

        <h3>Time Formatter</h3>
        <p>{l10n.formatTime(date)}</p>

        <h3>Short Days</h3>
        <ul>
          {l10n.getDaysShort().map(day => (
            <li key={day}>{day}</li>
          ))}
        </ul>

        <h3>Long Months</h3>
        <ul>
          {l10n.getMonthsLong().map(month => (
            <li key={month}>{month}</li>
          ))}
        </ul>
      </div>
    );
  }
}
