/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useState } from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import { ConfluenceIcon, JiraServiceDeskIcon } from '@atlaskit/logo';
import { FadeIn, ExitingPersistence } from '../src';
import { Block, Centered, RetryContainer } from '../examples-utils';

const EnteringBlock = ({ children, exitThenEnter }: any) => (
  <FadeIn>
    {(props, direction) => (
      <Block
        css={{
          position:
            direction === 'entering' || exitThenEnter ? 'static' : 'absolute',
          left: 0,
          top: 0,
        }}
        {...props}
      >
        {children}
      </Block>
    )}
  </FadeIn>
);

const elements = [
  (exitThenEnter: boolean) => (
    <EnteringBlock exitThenEnter={exitThenEnter}>
      <ConfluenceIcon size="xlarge" />
    </EnteringBlock>
  ),
  (exitThenEnter: boolean) => (
    <EnteringBlock exitThenEnter={exitThenEnter}>
      <JiraServiceDeskIcon size="xlarge" />
    </EnteringBlock>
  ),
];

export default () => {
  const [index, setIndex] = useState(0);
  const [exitThenEnter, setExitThenEnter] = useState(false);

  return (
    <RetryContainer>
      <div css={{ textAlign: 'center' }}>
        <ButtonGroup>
          <Button
            onClick={() => setIndex(prev => (prev + 1) % elements.length)}
          >
            Switch
          </Button>

          <Button
            isSelected={exitThenEnter}
            onClick={() => {
              setExitThenEnter(prev => !prev);
              setTimeout(
                () => setIndex(prev => (prev + 1) % elements.length),
                1,
              );
            }}
          >
            {exitThenEnter
              ? 'Will exit first then enter'
              : 'Will exit and enter at the same time'}
          </Button>
        </ButtonGroup>

        <Centered>
          <div css={{ position: 'relative' }}>
            <ExitingPersistence exitThenEnter={exitThenEnter}>
              <div key={index}>{elements[index](exitThenEnter)}</div>
            </ExitingPersistence>
          </div>
        </Centered>
      </div>
    </RetryContainer>
  );
};
