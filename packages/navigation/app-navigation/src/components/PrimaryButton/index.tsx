/** @jsx jsx */
import Button from '@atlaskit/button';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import Tooltip from '@atlaskit/tooltip';
import { jsx } from '@emotion/core';

import { useTheme } from '../../theme';
import { TriggerManager } from '../TriggerManager';
import { chevronCSS, getPrimaryButtonTheme } from './styles';
import { PrimaryButtonProps } from './types';

export const PrimaryButton = (props: PrimaryButtonProps) => {
  const {
    component,
    dropdownContent,
    href,
    isSelected,
    target,
    testId,
    text,
    tooltip,
    ...triggerManagerProps
  } = props;
  const theme = useTheme();

  return (
    <Tooltip content={tooltip}>
      <TriggerManager
        position="top left"
        dropdownContent={dropdownContent}
        {...triggerManagerProps}
      >
        {({ onTriggerClick }) => (
          <Button
            appearance="primary"
            component={component}
            data-test-id={testId}
            href={href}
            iconAfter={
              dropdownContent ? (
                <span className="chevron" css={chevronCSS}>
                  <ChevronDownIcon label="" />
                </span>
              ) : (
                undefined
              )
            }
            isSelected={isSelected}
            onClick={onTriggerClick}
            target={target}
            theme={getPrimaryButtonTheme(theme)}
          >
            {text}
          </Button>
        )}
      </TriggerManager>
    </Tooltip>
  );
};

PrimaryButton.defaultProps = {
  isSelected: false,
  testId: 'NavigationItem',
};
