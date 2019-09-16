import { IntlProvider, intlShape } from 'react-intl';
import { mount, ReactWrapper } from 'enzyme';
import { Component, ReactElement } from 'react';

/* TODO: We are explicitly using the third arg of ReactWrapper to work around the following TS issue which prevents a d.ts from being generated
 * and therefore fails the build:
 * error TS2742: The inferred type of 'mountWithIntlContext' cannot be named without a reference to 'react-transition-group/node_modules/@types/react'. This is likely not portable. A type annotation is necessary.
 * TS is resolving enzyme's usage of react to react-transition-group???
 */
export const mountWithIntlContext = <P, S>(
  node: ReactElement<P>,
  reactContext?: Object,
  childContextTypes?: Object,
): ReactWrapper<P, S, Component<P, S>> => {
  const intlProvider = new IntlProvider({
    locale: 'en',
    messages: {},
  });
  const intl = intlProvider.getChildContext().intl;

  return mount<P, S>(node, {
    context: { intl, ...reactContext },
    childContextTypes: { intl: intlShape, ...childContextTypes },
  }) as ReactWrapper<P, S, Component<P, S>>;
};
