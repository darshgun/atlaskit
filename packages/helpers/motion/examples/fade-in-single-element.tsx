import React from 'react';
import { FadeIn } from '../src';
import { Block, RetryContainer, Centered } from '../examples-utils';

export default () => (
  <RetryContainer>
    <Centered>
      <FadeIn>{props => <Block {...props} />}</FadeIn>
    </Centered>
  </RetryContainer>
);
