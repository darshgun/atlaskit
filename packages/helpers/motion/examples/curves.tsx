import React from 'react';
import { md, code } from '@atlaskit/docs';
import { easeIn, easeInOut, easeOut, largeDurationMs } from '../src';
import { MovesRightBlock } from '../examples-utils/blocks';

export default () => md`
  ${code`
import { easeIn } from '@atlaskit/motion';
  `}

  ${<MovesRightBlock curve={easeIn} duration={largeDurationMs} />}

  ${code`
import { easeInOut } from '@atlaskit/motion';
  `}

  ${<MovesRightBlock curve={easeInOut} duration={largeDurationMs} />}

  ${code`
import { easeOut } from '@atlaskit/motion';
  `}

  ${<MovesRightBlock curve={easeOut} duration={largeDurationMs} />}
`;
