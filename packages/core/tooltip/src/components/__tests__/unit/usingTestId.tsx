import React from 'react';
import { render } from '@testing-library/react';

import Tooltip from '../../Tooltip';
import { Tooltip as StyledTooltip } from '../../../styled';

const Target = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

describe('Using react-test-library', () => {
  describe('Tooltip should be found by data-testid', () => {
    test('Using getByTestId()', async () => {
      const testId = 'the-tooltip';
      const { getByTestId } = render(
        <Tooltip content="Tooltip content" testId={testId}>
          <Target>foo</Target>
        </Tooltip>,
      );
      expect(getByTestId(testId)).toBeTruthy();
    });
  });
});
