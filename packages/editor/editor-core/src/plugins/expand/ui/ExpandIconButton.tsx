import React, { useCallback } from 'react';
import Button from '@atlaskit/button';
import {
  akEditorSwoopCubicBezier,
  expandMessages,
  ExpandTooltipWrapper,
} from '@atlaskit/editor-common';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import { colors } from '@atlaskit/theme';
import Tooltip from '@atlaskit/tooltip';
import { InjectedIntl } from 'react-intl';
import { expandClassNames } from './class-names';

interface ExpandIconButtonProps {
  expanded: boolean;
  intl?: InjectedIntl;
}

export const ExpandIconButton = (props: ExpandIconButtonProps) => {
  const { expanded, intl } = props;
  const message = expanded
    ? expandMessages.collapseNode
    : expandMessages.expandNode;
  const label = (intl && intl.formatMessage(message)) || message.defaultMessage;

  const useTheme = useCallback(
    (currentTheme: any, themeProps: any) => {
      const { buttonStyles, ...rest } = currentTheme(themeProps);
      return {
        buttonStyles: {
          ...buttonStyles,
          height: '100%',
          '& svg': {
            transform: props.expanded
              ? 'transform: rotate(90deg);'
              : 'tranform: rotate(0deg);',
            transition: `transform 0.2s ${akEditorSwoopCubicBezier};`,
          },
        },
        ...rest,
      };
    },
    [props],
  );

  return (
    <Tooltip content={label} position="top" tag={ExpandTooltipWrapper}>
      <Button
        appearance="subtle"
        className={expandClassNames.iconContainer}
        iconBefore={
          <ChevronRightIcon label={label} primaryColor={colors.N80A} />
        }
        shouldFitContainer
        theme={useTheme}
      ></Button>
    </Tooltip>
  );
};
