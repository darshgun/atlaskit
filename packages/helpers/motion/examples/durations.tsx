import React from 'react';
import { md, code } from '@atlaskit/docs';
import {
  easeInOut,
  smallDurationMs,
  mediumDurationMs,
  largeDurationMs,
} from '../src';
import { MovesRightBlock } from '../examples-utils/blocks';

export default () => md`
  ${code`
import { smallDurationMs } from '@atlaskit/motion';
  `}

  ${<MovesRightBlock curve={easeInOut} duration={smallDurationMs} />}

  ${code`
import { mediumDurationMs } from '@atlaskit/motion';
  `}

  ${<MovesRightBlock curve={easeInOut} duration={mediumDurationMs} />}

  ${code`
import { largeDurationMs } from '@atlaskit/motion';
  `}

  ${<MovesRightBlock curve={easeInOut} duration={largeDurationMs} />}
`;
