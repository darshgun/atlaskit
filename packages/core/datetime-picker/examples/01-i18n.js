// @flow

import React, {
  Component,
  type StatelessFunctionalComponent,
  type Node,
} from 'react';
import { Label } from '@atlaskit/field-base';
import Select from '@atlaskit/select';
import { DatePicker, DateTimePicker, TimePicker } from '../src';

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
    defaultValue={{ value: 'ja-JP', label: '日本語 (日本)' }}
    onChange={props.onLocaleChange}
    options={LOCALES}
    styles={{
      container: (css: any) => ({ ...css, width: 300 }),
      dropdownIndicator: (css: any) => ({ ...css, paddingLeft: 0 }),
      menu: (css: any) => ({ ...css, width: 300 }),
    }}
  />
);

type ControlledState = {
  value: string,
  isOpen: boolean,
};

type ControlledProps = {
  initialValue?: string,
  initialIsOpen?: boolean,
  children: ({
    value: string,
    onValueChange: (value: string) => void,
    isOpen: boolean,
    onBlur: () => void,
  }) => Node,
};

class Controlled extends Component<ControlledProps, ControlledState> {
  state: ControlledState;

  recentlySelected: boolean = false;

  constructor(props: ControlledProps) {
    super(props);
    this.state = {
      value: props.initialValue || '',
      isOpen: props.initialIsOpen || false,
    };
  }

  handleClick = () => {
    if (!this.recentlySelected) {
      this.setState({ isOpen: true });
    }
  };

  onValueChange = (value: string) => {
    console.log(value);
    this.recentlySelected = true;
    this.setState(
      {
        value,
        isOpen: false,
      },
      () => {
        setTimeout(() => {
          this.recentlySelected = false;
        }, 200);
      },
    );
  };

  onBlur = () => {
    this.setState({
      isOpen: false,
    });
  };

  onFocus = () => {
    this.setState({
      isOpen: false,
    });
  };

  render() {
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
      <div onClick={this.handleClick}>
        {this.props.children({
          value: this.state.value,
          onValueChange: this.onValueChange,
          isOpen: this.state.isOpen,
          onBlur: this.onBlur,
        })}
      </div>
    );
  }
}

const onChange = value => {
  console.log(value);
};

type IntlState = {
  locale: string,
};

export default class extends Component<Object, IntlState> {
  state = {
    locale: 'ja-JP',
  };

  onLocaleChange = (locale: Locale) => this.setState({ locale: locale.value });

  render() {
    const { locale } = this.state;
    return (
      <div>
        <LocaleSelect onLocaleChange={this.onLocaleChange} />
        <h3>Date picker</h3>
        <Label htmlFor="react-select-datepicker-1--input" label="default" />
        <DatePicker id="datepicker-1" onChange={onChange} locale={locale} />

        <Label
          htmlFor="react-select-datepicker-2--input"
          label="controlled (value)"
        />
        <Controlled initialValue="2018-01-02">
          {({ value, onValueChange, onBlur }) => (
            <DatePicker
              id="datepicker-2"
              value={value}
              onChange={onValueChange}
              onBlur={onBlur}
              locale={locale}
            />
          )}
        </Controlled>

        <Label
          htmlFor="react-select-datepicker-3--input"
          label="uncontrolled (defaultValue)"
        />
        <DatePicker
          id="datepicker-3"
          defaultValue="2018-01-02"
          onChange={onChange}
          locale={locale}
        />

        <h3>Time picker</h3>
        <Label htmlFor="react-select-timepicker-1--input" label="default" />
        <TimePicker
          id="timepicker-1"
          onChange={onChange}
          selectProps={{ classNamePrefix: 'timepicker-select' }}
          locale={locale}
        />

        <Label
          htmlFor="react-select-timepicker-2--input"
          label="controlled (value, isOpen)"
        />
        <Controlled initialValue="14:30">
          {({ value, onValueChange, isOpen, onBlur }) => (
            <TimePicker
              selectProps={{ classNamePrefix: 'timepicker-select' }}
              id="timepicker-2"
              value={value}
              onChange={onValueChange}
              onBlur={onBlur}
              isOpen={isOpen}
              locale={locale}
            />
          )}
        </Controlled>

        <Label
          htmlFor="react-select-timepicker-3--input"
          label="uncontrolled (defaultValue)"
        />
        <TimePicker
          selectProps={{ classNamePrefix: 'timepicker-select' }}
          id="timepicker-3"
          defaultValue="14:30"
          onChange={onChange}
          locale={locale}
        />

        <Label
          htmlFor="react-select-timepicker-4--input"
          label="editable times"
        />
        <TimePicker
          selectProps={{ classNamePrefix: 'timepicker-select' }}
          id="timepicker-4"
          defaultValue="14:30"
          onChange={onChange}
          timeIsEditable
          locale={locale}
        />

        <h3>Date / time picker</h3>
        <Label htmlFor="react-select-datetimepicker-1--input" label="default" />
        <DateTimePicker
          id="datetimepicker-1"
          onChange={onChange}
          locale={locale}
        />

        <Label
          htmlFor="react-select-datetimepicker-2--input"
          label="controlled (UTC-08:00)"
        />
        <Controlled initialValue="2018-01-02T14:30-08:00">
          {({ value, onValueChange }) => (
            <DateTimePicker
              id="datetimepicker-2"
              value={value}
              onChange={onValueChange}
              locale={locale}
            />
          )}
        </Controlled>

        <Label
          htmlFor="react-select-datetimepicker-3--input"
          label="uncontrolled (UTC+10:00)"
        />
        <DateTimePicker
          id="datetimepicker-3"
          defaultValue="2018-01-02T14:30+10:00"
          onChange={onChange}
          locale={locale}
        />

        <Label
          htmlFor="react-select-datetimepicker-4--input"
          label="editable times (UTC+10:00)"
        />
        <DateTimePicker
          id="datetimepicker-4"
          defaultValue="2018-01-02T14:30+10:00"
          onChange={onChange}
          timeIsEditable
          locale={locale}
        />
      </div>
    );
  }
}
