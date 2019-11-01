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
  siteTitleCSS,
} from './styles';
import { CustomProductHomeProps, ProductHomeProps } from './types';

export const ProductHome = ({
  icon: Icon,
  logo: Logo,
  siteTitle,
  onClick = () => {},
}: ProductHomeProps) => {
  const theme = useTheme();
  const {
    iconColor = 'inherit',
    gradientStart = 'inherit',
    gradientStop = 'inherit',
    textColor = theme.mode.productHome.color,
  } = theme.mode.productHome;
  return (
    <Fragment>
      <div css={containerCSS} onClick={onClick}>
        <div css={productLogoCSS}>
          <Logo
            gradientStart={gradientStart}
            gradientStop={gradientStop}
            iconColor={iconColor}
            textColor={textColor}
          />
        </div>
        <div css={productIconCSS}>
          <Icon
            gradientStart={gradientStart}
            gradientStop={gradientStop}
            iconColor={iconColor}
          />
        </div>
      </div>
      {siteTitle && <div css={siteTitleCSS(theme)}>{siteTitle}</div>}
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
