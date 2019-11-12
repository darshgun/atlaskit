/** @jsx jsx */
import SearchIcon from '@atlaskit/icon/glyph/search';
import { jsx } from '@emotion/core';
import { Fragment } from 'react';

import { useTheme } from '../../theme';
import { IconButton } from '../IconButton';

import {
  searchInputContainerCSS,
  searchIconCSS,
  searchInputCSS,
  searchInputIconCSS,
} from './styles';
import { SearchProps } from './types';

type SearchComponentProps = {
  onClick: SearchProps['onClick'];
  text: SearchProps['text'];
};

const SearchComponent = (props: SearchComponentProps) => {
  const { onClick, text } = props;
  const theme = useTheme();

  const onChange = (...args: any[]) => {
    // @ts-ignore
    onClick && onClick(...args);
  };

  const onInputClick = (...args: any[]) => {
    // @ts-ignore
    onClick && onClick(...args);
  };

  return (
    <div css={searchInputContainerCSS}>
      <div css={searchInputIconCSS}>
        <SearchIcon label={text} />
      </div>
      <input
        css={searchInputCSS(theme)}
        placeholder={text}
        onChange={onChange}
        onClick={onInputClick}
        value=""
      />
    </div>
  );
};

export const Search = (props: SearchProps) => {
  const { text, tooltip, ...iconButtonProps } = props;

  return (
    <Fragment>
      <SearchComponent onClick={iconButtonProps.onClick} text={text} />
      <IconButton
        css={searchIconCSS}
        icon={
          <SearchIcon
            label={typeof tooltip === 'string' ? tooltip : 'Search Icon'}
          />
        }
        tooltip={tooltip}
        {...iconButtonProps}
      />
    </Fragment>
  );
};
