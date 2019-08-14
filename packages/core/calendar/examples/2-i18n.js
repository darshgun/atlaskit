// @flow

import React, { Component, type StatelessFunctionalComponent } from 'react';
import Select from '@atlaskit/select';
import Calendar from '../src';

const log = msg => e => console.log(msg, e);

type Locale = {
  value: string,
  label: string,
};

type Props = {
  onLocaleChange: (locale: Locale) => void,
};

const LOCALES: Array<Locale> = [
  { value: 'en-AU', label: 'English (Australia)' },
  { value: 'en-GB', label: 'English (United Kingdom)' },
  { value: 'en-US', label: 'English (United States)' },
  { value: 'ko-KR', label: '한국어 (대한민국)' },
  { value: 'nl-NL', label: 'Nederlands (Nederland)' },
  { value: 'ru-RU', label: 'русский (Россия)' },
  { value: 'hu-HU', label: 'magyar (Magyarország)' },
  { value: 'pt-BR', label: 'português (Brasil)' },
  { value: 'de-DE', label: 'Deutsch (Deutschland)' },
  { value: 'is-IS', label: 'íslenska (Ísland)' },
  { value: 'cs-CZ', label: 'čeština (Česká republika)' },
  { value: 'da-DK', label: 'Dansk (Danmark)' },
  { value: 'et-EE', label: 'Eesti (Eesti)' },
  { value: 'pl-PL', label: 'polski (Polska)' },
  { value: 'sk-SK', label: 'Slovenčina (Slovenská republika)' },
  { value: 'it-IT', label: 'italiano (Italia)' },
  { value: 'pt-PT', label: 'português (Portugal)' },
  { value: 'vi-VN', label: 'Tiếng Việt (Việt Nam)' },
  { value: 'zh-CN', label: '中文 (中国)' },
  { value: 'es-ES', label: 'español (España)' },
  { value: 'sv-SE', label: 'svenska (Sverige)' },
  { value: 'ja-JP', label: '日本語 (日本)' },
  { value: 'fi-FI', label: 'suomi (Suomi)' },
  { value: 'fr-FR', label: 'français (France)' },
  { value: 'ro-RO', label: 'română (România)' },
  { value: 'no-NO', label: 'norsk (Norge)' },
];

export const LocaleSelect: StatelessFunctionalComponent<Props> = (
  props: Props,
) => (
  <Select
    defaultValue={LOCALES[0]}
    onChange={props.onLocaleChange}
    options={LOCALES}
    styles={{
      container: (css: any) => ({ ...css, width: 300 }),
      dropdownIndicator: (css: any) => ({ ...css, paddingLeft: 0 }),
      menu: (css: any) => ({ ...css, width: 300 }),
    }}
  />
);

type IntlState = {
  locale: string,
};

export default class extends Component<Object, IntlState> {
  state = {
    locale: 'en-AU',
  };

  onLocaleChange = (locale: Locale) => this.setState({ locale: locale.value });

  render() {
    const { locale } = this.state;
    return (
      <div>
        <Calendar
          defaultDisabled={['2020-12-04']}
          defaultPreviouslySelected={['2020-12-06']}
          defaultSelected={['2020-12-08']}
          defaultMonth={12}
          defaultYear={2020}
          innerProps={{
            style: {
              border: '1px solid red',
              display: 'inline-block',
            },
          }}
          onBlur={log('blur')}
          onChange={log('change')}
          onFocus={log('focus')}
          onSelect={log('select')}
          locale={locale}
        />
        <LocaleSelect onLocaleChange={this.onLocaleChange} />
      </div>
    );
  }
}
