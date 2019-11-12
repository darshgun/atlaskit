import SignInIcon from '@atlaskit/icon/glyph/sign-in';
import React from 'react';

import { IconButton } from '../IconButton';
import { SignInProps } from './types';

export const SignIn = (props: SignInProps) => {
  const { tooltip, ...iconButtonProps } = props;
  return (
    <IconButton
      icon={
        <SignInIcon
          label={typeof tooltip === 'string' ? tooltip : 'Sign-in Icon'}
        />
      }
      tooltip={tooltip}
      {...iconButtonProps}
    />
  );
};
