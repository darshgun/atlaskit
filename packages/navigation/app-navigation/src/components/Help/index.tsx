import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import React from 'react';

import { useTheme } from '../../theme';
import { IconButton } from '../IconButton';
import { TriggerManager } from '../TriggerManager';
import { HelpProps } from './types';

export const Help = (props: HelpProps) => {
  const { tooltip, ...triggerManagerProps } = props;
  const {
    mode: { navigation },
  } = useTheme();

  return (
    <TriggerManager {...triggerManagerProps}>
      {({ onTriggerClick }) => (
        <IconButton
          icon={
            <QuestionCircleIcon
              label={tooltip}
              secondaryColor={navigation.backgroundColor}
            />
          }
          onClick={onTriggerClick}
          tooltip={tooltip}
        />
      )}
    </TriggerManager>
  );
};
