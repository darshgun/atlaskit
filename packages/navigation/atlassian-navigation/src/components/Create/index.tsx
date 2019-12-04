/** @jsx jsx */
import { Fragment } from 'react';
import Tooltip from '@atlaskit/tooltip';
import { jsx } from '@emotion/core';
import Button from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/add';
import { gridSize } from '@atlaskit/theme/constants';

import { useTheme } from '../../theme';
import { IconButton } from '../IconButton';
import { createButtonCSS, createIconCSS, getCreateButtonTheme } from './styles';
import { CreateProps } from './types';

const grid = gridSize();

type TooltipSwitchProps = {
  buttonTooltip?: React.ReactNode;
  children: React.ReactNode;
};
const TooltipSwitch = ({ buttonTooltip, children }: TooltipSwitchProps) =>
  buttonTooltip ? (
    <Tooltip content={buttonTooltip} hideTooltipOnClick>
      {children}
    </Tooltip>
  ) : (
    <Fragment>{children}</Fragment>
  );

export const Create = ({
  onClick,
  text,
  buttonTooltip,
  iconButtonTooltip,
}: CreateProps) => {
  const theme = useTheme();

  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        marginLeft: grid * 1.5,
      }}
    >
      <TooltipSwitch buttonTooltip={buttonTooltip}>
        <Button
          id="createGlobalItem"
          css={createButtonCSS}
          onClick={onClick}
          theme={getCreateButtonTheme(theme)}
        >
          {text}
        </Button>
      </TooltipSwitch>
      <IconButton
        id="createGlobalItemIconButton"
        css={createIconCSS}
        icon={<AddIcon label={text} />}
        onClick={onClick}
        tooltip={iconButtonTooltip}
        theme={getCreateButtonTheme(theme)}
        aria-label={text}
      />
    </div>
  );
};
