// @flow

import React, {
  Component,
  type ComponentType,
  type ElementConfig,
} from 'react';

import AnalyticsContext from './AnalyticsContext';

type WithAnalyticsContextProps = {
  analyticsContext?: {},
};

export default function withAnalyticsContext<
  InnerComponent: ComponentType<*>,
  ExternalProps: ElementConfig<InnerComponent> & WithAnalyticsContextProps,
>(
  defaultData?: {} = {},
): (WrappedComponent: InnerComponent) => ComponentType<ExternalProps> {
  return WrappedComponent =>
    class WithAnalyticsContext extends Component<*> {
      static displayName = `WithAnalyticsContext(${WrappedComponent.displayName ||
        WrappedComponent.name})`;

      static defaultProps = {
        analyticsContext: {},
      };

      render() {
        const { analyticsContext, ...props } = this.props;
        const data = { ...defaultData, ...analyticsContext };
        return (
          <AnalyticsContext data={data}>
            <WrappedComponent {...props} />
          </AnalyticsContext>
        );
      }
    };
}
