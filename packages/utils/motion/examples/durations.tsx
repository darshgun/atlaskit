import React from 'react';
import { md, code } from '@atlaskit/docs';
import {
  akEaseInOut,
  akSmallDurationMs,
  akMediumDurationMs,
  akLargeDurationMs,
} from '../src';
import { MovesRightBlock } from '../examples-utils/blocks';

export default () => md`
  ${code`
import { akSmallDurationMs } from '@atlaskit/motion';
  `}

  ${<MovesRightBlock curve={akEaseInOut} duration={akSmallDurationMs} />}

  ${code`
import { akMediumDurationMs } from '@atlaskit/motion';
  `}

  ${<MovesRightBlock curve={akEaseInOut} duration={akMediumDurationMs} />}

  ${code`
import { akLargeDurationMs } from '@atlaskit/motion';
  `}

  ${<MovesRightBlock curve={akEaseInOut} duration={akLargeDurationMs} />}
`;
