import React from 'react';
import { md, code } from '@atlaskit/docs';
import { easeIn, easeInOut, easeOut } from '../src';
import { MovesRightBlock } from '../examples-utils/blocks';

export default () => md`
  ${code`
import { easeIn } from '@atlaskit/motion';
  `}

  ${<MovesRightBlock curve={easeIn} duration={1000} />}

  ${code`
import { easeInOut } from '@atlaskit/motion';
  `}

  ${<MovesRightBlock curve={easeInOut} duration={1000} />}

  ${code`
import { easeOut } from '@atlaskit/motion';
  `}

  ${<MovesRightBlock curve={easeOut} duration={1000} />}
`;
