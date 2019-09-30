import * as React from 'react';
import Button from '@atlaskit/button';
import Drawer from '@atlaskit/drawer';
import { mockEndpoints, REQUEST_FAST } from './helpers/mock-endpoints';
import { withIntlProvider } from './helpers';
import AtlassianSwitcher from '../src';
class JiraSwitcherExample extends React.Component {
  state = {
    isDrawerOpen: false,
  };

  componentDidMount() {
    this.openDrawer();
  }

  openDrawer = () => {
    mockEndpoints('jira', originalMockData => originalMockData, REQUEST_FAST);
    this.setState({
      isDrawerOpen: true,
    });
  };

  onClose = () => {
    this.setState({
      isDrawerOpen: false,
    });
  };

  onTriggerXFlow = (productKey: string, sourceComponent: string) => {
    console.log(
      `Triggering xflow for => ${productKey} from ${sourceComponent}`,
    );
  };

  render() {
    const redishColorScheme = {
      primaryTextColor: '#8B0000',
      secondaryTextColor: '#ff4c4c',
      primaryHoverBackgroundColor: '#ffcccc',
      secondaryHoverBackgroundColor: '#ffe5e5',
    };

    return (
      <div style={{ padding: '2rem' }}>
        <Drawer onClose={this.onClose} isOpen={this.state.isDrawerOpen}>
          <AtlassianSwitcher
            product="jira"
            cloudId="some-cloud-id"
            triggerXFlow={this.onTriggerXFlow}
            theme={redishColorScheme}
          />
        </Drawer>
        <Button type="button" onClick={this.openDrawer}>
          Open drawer
        </Button>
      </div>
    );
  }
}

export default withIntlProvider(JiraSwitcherExample);
