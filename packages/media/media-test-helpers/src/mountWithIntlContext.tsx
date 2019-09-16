import { IntlProvider, intlShape } from 'react-intl';
import { mount, ReactWrapper } from 'enzyme';
import { ReactElement } from 'react';

/* TODO: Fix enzyme type resolution error
 * We need to type this to any so a d.ts file is created since typescript is currently
 * erroring out with
 * error TS2742: The inferred type of 'mountWithIntlContext' cannot be named without a reference to 'react-transition-group/node_modules/@types/react'. This is likely not portable. A type annotation is necessary.
 */
export const mountWithIntlContext: any = <P, S>(
  node: ReactElement<P>,
  reactContext?: Object,
  childContextTypes?: Object,
): ReactWrapper<P, S> => {
  const intlProvider = new IntlProvider({
    locale: 'en',
    messages: {},
  });
  const intl = intlProvider.getChildContext().intl;

  return mount<P, S>(node, {
    context: { intl, ...reactContext },
    childContextTypes: { intl: intlShape, ...childContextTypes },
  });
};
