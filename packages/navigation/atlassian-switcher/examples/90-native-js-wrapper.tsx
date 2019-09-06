import * as React from 'react';
import { mockEndpoints, REQUEST_FAST } from './helpers/mock-endpoints';
import Button from '@atlaskit/button';
import styled from 'styled-components';
import prepareAtlassianSwitcher from '../src/vanilla-wrapper';
import memoizeOne from 'memoize-one';

const Container = styled.div`
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0 8px;
  display: inline-block;
  margin: 5px;
  vertical-align: top;
`;

type Props = {};

type State = {
  isLoaded: boolean;
  isMounted: boolean;
};
export default class NativeWrapperExample extends React.Component<
  Props,
  State
> {
  private destroy?: () => void;
  state = {
    isLoaded: false,
    isMounted: false,
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    mockEndpoints(
      'jira',
      originalMockData => {
        return {
          ...originalMockData,
          RECENT_CONTAINERS_DATA: {
            data: [],
          },
          CUSTOM_LINKS_DATA: {
            data: [],
          },
          XFLOW_SETTINGS: {},

          LICENSE_INFORMATION_DATA: {
            hostname: 'https://some-random-instance.atlassian.net',
            firstActivationDate: 1492488658539,
            maintenanceEndDate: '2017-04-24',
            maintenanceStartDate: '2017-04-17',
            products: {
              'jira-software.ondemand': {
                billingPeriod: 'ANNUAL',
                state: 'ACTIVE',
              },
            },
          },
        };
      },
      REQUEST_FAST,
    );
    this.setState({
      isLoaded: true,
    });
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.isLoaded && !prevState.isLoaded) {
      this.renderSwitcherUsingNativeJSWrapper();
    }
  }

  onTriggerXFlow = (productKey: string, sourceComponent: string) => {
    console.log(
      `Triggering xflow for => ${productKey} from ${sourceComponent}`,
    );
  };

  prepareSwitcher = memoizeOne(() => {
    return prepareAtlassianSwitcher(
      {
        product: 'trello',
        disableCustomLinks: true,
        disableRecentContainers: true,
        disableHeadings: true,
        isDiscoverMoreForEveryoneEnabled: true,
        enableUserCentricProducts: true,
        cloudId: 'some-cloud-id',
        triggerXFlow: this.onTriggerXFlow,
        appearance: 'standalone',
      },
      (event, channel) => {
        console.log(
          `Provided Listener: AnalyticsEvent(${channel})\n\tpayload=%o\n\tcontext=%o`,
          event.payload,
          event.context,
        );
      },
    );
  });

  destroySwitcher = () => {
    if (this.destroy) {
      this.destroy();
      this.destroy = undefined;

      this.setState({
        isMounted: false,
      });
    }
  };

  renderSwitcherUsingNativeJSWrapper = () => {
    const container = document.getElementById('switcher-container');

    if (!container) {
      return null;
    }

    // bootstrap
    const switcher = this.prepareSwitcher();

    // prefetch bundles and api calls
    switcher.prefetch();

    // render the component
    this.destroy = switcher.renderAt(container);

    this.setState({
      isMounted: true,
    });
  };

  render() {
    const { isMounted } = this.state;
    return (
      <>
        <Container id="switcher-container" />

        {isMounted ? (
          <Button type="button" onClick={this.destroySwitcher}>
            Destroy switcher
          </Button>
        ) : (
          <Button
            type="button"
            onClick={this.renderSwitcherUsingNativeJSWrapper}
          >
            Mount switcher
          </Button>
        )}
      </>
    );
  }
}
