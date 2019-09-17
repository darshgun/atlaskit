import * as React from 'react';
import ErrorBoundary from './error-boundary';
import { Product, AtlassianSwitcherProps } from '../types';
import IntlProvider from './intl-provider';
import messages from '../utils/messages';
import {
  analyticsAttributes,
  NavigationAnalyticsContext,
  SWITCHER_COMPONENT,
  SWITCHER_SOURCE,
} from '../utils/analytics';
import packageContext from '../utils/package-context';
import mapPropsToFeatures from '../utils/map-props-to-features';

import {
  JiraSwitcherLoader,
  ConfluenceSwitcherLoader,
  GenericSwitcherLoader,
} from './loaders';

const getAnalyticsContext = (attributes: object) => ({
  source: SWITCHER_SOURCE,
  componentName: SWITCHER_COMPONENT,
  ...packageContext,
  ...analyticsAttributes(attributes),
});

const AtlassianSwitcher = (props: AtlassianSwitcherProps) => {
  const { product } = props;

  let Switcher: React.ElementType;
  switch (product) {
    case Product.JIRA:
      Switcher = JiraSwitcherLoader;
      break;
    case Product.CONFLUENCE:
      Switcher = ConfluenceSwitcherLoader;
      break;
    default:
      Switcher = GenericSwitcherLoader;
  }

  const features = mapPropsToFeatures(props);

  return (
    <IntlProvider>
      <NavigationAnalyticsContext
        data={getAnalyticsContext({ featureFlags: features })}
      >
        <ErrorBoundary messages={messages}>
          <Switcher {...props} messages={messages} features={features} />
        </ErrorBoundary>
      </NavigationAnalyticsContext>
    </IntlProvider>
  );
};

export default AtlassianSwitcher;
