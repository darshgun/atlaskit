/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useState } from 'react';
import Button from '@atlaskit/button';
import { FadeIn, ExitingPersistence } from '../src';
import { Block, Centered, RetryContainer } from '../examples-utils';

export default () => {
  const [isIn, setIsIn] = useState(true);

  return (
    <RetryContainer>
      <div css={{ textAlign: 'center' }}>
        <Button onClick={() => setIsIn(prev => !prev)}>
          {isIn ? 'Exit' : 'Enter'}
        </Button>

        <Centered>
          <ExitingPersistence appear>
            {isIn && <FadeIn>{props => <Block {...props} />}</FadeIn>}
          </ExitingPersistence>
        </Centered>
      </div>
    </RetryContainer>
  );
};
