import SignInIcon from '@atlaskit/icon/glyph/sign-in';
import React from 'react';

import { IconButton } from '../IconButton';
import { SignInProps } from './types';

export const SignIn = (props: SignInProps) => {
  const { tooltip, ...iconButtonProps } = props;
  return (
    <IconButton
      icon={<SignInIcon label={tooltip} />}
      tooltip={tooltip}
      {...iconButtonProps}
    />
  );
};
