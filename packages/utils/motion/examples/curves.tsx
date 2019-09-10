import React from 'react';
import { md, code } from '@atlaskit/docs';
import { akEaseIn, akEaseInOut, akEaseOut, akLargeDurationMs } from '../src';
import { MovesRightBlock } from '../examples-utils/blocks';

export default () => md`
  ${code`
import { akEaseIn } from '@atlaskit/motion';
  `}

  ${<MovesRightBlock curve={akEaseIn} duration={akLargeDurationMs} />}

  ${code`
import { akEaseInOut } from '@atlaskit/motion';
  `}

  ${<MovesRightBlock curve={akEaseInOut} duration={akLargeDurationMs} />}

  ${code`
import { akEaseOut } from '@atlaskit/motion';
  `}

  ${<MovesRightBlock curve={akEaseOut} duration={akLargeDurationMs} />}
`;
