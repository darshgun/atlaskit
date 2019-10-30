/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Fragment } from 'react';
import { useTheme } from '../../theme';
import {
  containerCSS,
  customProductIconCSS,
  customProductLogoCSS,
  productIconCSS,
  productLogoCSS,
  siteNameCSS,
} from './styles';
import { CustomProductHomeProps, ProductHomeProps } from './types';

export const ProductHome = ({
  icon: Icon,
  logo: Logo,
  siteName,
  onClick = () => {},
}: ProductHomeProps) => {
  const theme = useTheme();
  const { backgroundColor, color } = theme.mode.productHome;
  return (
    <Fragment>
      <div css={containerCSS} onClick={onClick}>
        <div css={productLogoCSS}>
          <Logo iconColor={backgroundColor} textColor={color} />
        </div>
        <div css={productIconCSS}>
          <Icon size="small" iconColor={backgroundColor} />
        </div>
      </div>
      {siteName && <div css={siteNameCSS(theme)}>{siteName}</div>}
    </Fragment>
  );
};

export const CustomProductHome = (props: CustomProductHomeProps) => {
  const { iconAlt, iconUrl, logoAlt, logoUrl, onClick } = props;

  return (
    <div css={containerCSS} onClick={onClick}>
      <img css={customProductLogoCSS} src={logoUrl} alt={logoAlt} />
      <img css={customProductIconCSS} src={iconUrl} alt={iconAlt} />
    </div>
  );
};
