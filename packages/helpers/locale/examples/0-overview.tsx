import React, { Component, ChangeEvent } from 'react';

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

  onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      dateInput: event.target.value,
    });
  };

  render() {
    const { l10n, dateInput, date } = this.state;
    return (
      <div>
        <h3>Locale</h3>
        <LocaleSelect onLocaleChange={this.onLocaleChange} />

        <h3>Date Parser</h3>
        <form>
          <input type="text" value={dateInput} onChange={this.onInputChange} />
          <p>{l10n.parseDate(dateInput).toString()}</p>
        </form>

        <h3>Date Formatter</h3>
        <p>{l10n.formatDate(date)}</p>

        <h3>Time Formatter</h3>
        <p>{l10n.formatTime(date)}</p>

        <h3>Short Days</h3>
        <ul>
          {l10n.getDaysShort().map(day => (
            <li>{day}</li>
          ))}
        </ul>

        <h3>Long Months</h3>
        <ul>
          {l10n.getMonthsLong().map(month => (
            <li>{month}</li>
          ))}
        </ul>
      </div>
    );
  }
}
