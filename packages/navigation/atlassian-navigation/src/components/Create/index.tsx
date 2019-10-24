/** @jsx jsx */
import { jsx } from '@emotion/core';
import Button from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/add';

import { useTheme } from '../../theme';
import { IconButton } from '../IconButton';
import { createButtonCSS, createIconCSS, getCreateButtonTheme } from './styles';
import { CreateProps } from './types';

export const Create = ({ onClick, text }: CreateProps) => {
  const theme = useTheme();
  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Button
        css={createButtonCSS}
        onClick={onClick}
        theme={getCreateButtonTheme(theme)}
      >
        {text}
      </Button>
      <IconButton
        css={createIconCSS}
        icon={<AddIcon label={text} />}
        onClick={onClick}
        tooltip={text}
        theme={getCreateButtonTheme(theme)}
      />
    </div>
  );
};
