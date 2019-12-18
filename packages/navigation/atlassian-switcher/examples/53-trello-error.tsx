import React, { ComponentType } from 'react';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import { FakeTrelloChrome } from './helpers/FakeTrelloChrome';
import ErrorBoundary from '../src/components/error-boundary';
import { enrichFetchError } from '../src/utils/fetch';
import { Product } from '../src/types';
import messages from '../src/utils/messages';
import styled from 'styled-components';

type Props = {
  status: number;
};
const FailingNetworkComponent: ComponentType<Props> = ({ status }) => {
  throw enrichFetchError(new Error('Failed to fetch'), status);
};

const FailingRuntimeComponent: ComponentType = () => {
  throw new TypeError('Failed to fetch');
};

const ExamplesRow = styled.div`
  display: flex;
`;

class ErrorExample extends React.Component {
  render() {
    return (
      <ExamplesRow>
        <FakeTrelloChrome>
          <ErrorBoundary
            product={Product.TRELLO}
            appearance="standalone"
            messages={messages}
          >
            <FailingNetworkComponent status={401} />
          </ErrorBoundary>
        </FakeTrelloChrome>

        <FakeTrelloChrome>
          <ErrorBoundary
            product={Product.TRELLO}
            appearance="standalone"
            messages={messages}
          >
            <FailingNetworkComponent status={500} />
          </ErrorBoundary>
        </FakeTrelloChrome>

        <FakeTrelloChrome>
          <ErrorBoundary
            product={Product.TRELLO}
            appearance="standalone"
            messages={messages}
          >
            <FailingRuntimeComponent />
          </ErrorBoundary>
        </FakeTrelloChrome>
      </ExamplesRow>
    );
  }
}

export default withIntlProvider(withAnalyticsLogger(ErrorExample));
