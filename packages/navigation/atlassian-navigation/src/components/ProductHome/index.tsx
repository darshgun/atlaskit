/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Fragment, MouseEvent } from 'react';
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

const getTag = (onClick?: (arg: any) => void, href?: string) => {
  if (href) {
    return 'a';
  }

  if (onClick) {
    return 'button';
  }

  return 'div';
};

export const ProductHome = ({
  icon: Icon,
  logo: Logo,
  siteTitle,
  onClick,
  href,
}: ProductHomeProps) => {
  const theme = useTheme();
  const {
    iconColor = 'inherit',
    gradientStart = 'inherit',
    gradientStop = 'inherit',
    textColor = theme.mode.productHome.color,
  } = theme.mode.productHome;

  const Tag = getTag(onClick, href);

  return (
    <Fragment>
      <Tag css={containerCSS(theme)} href={href} onClick={onClick}>
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
      </Tag>
      {siteTitle && <div css={siteTitleCSS(theme)}>{siteTitle}</div>}
    </Fragment>
  );
};

export const CustomProductHome = (props: CustomProductHomeProps) => {
  const {
    iconAlt,
    iconUrl,
    logoAlt,
    logoUrl,
    href,
    onClick,
    siteTitle,
  } = props;
  const theme = useTheme();
  const Tag = getTag(href, onClick);

  return (
    <Fragment>
      <Tag css={containerCSS(theme)} onClick={onClick}>
        <img css={customProductLogoCSS} src={logoUrl} alt={logoAlt} />
        <img css={customProductIconCSS} src={iconUrl} alt={iconAlt} />
      </Tag>
      {siteTitle && <div css={siteTitleCSS(theme)}>{siteTitle}</div>}
    </Fragment>
  );
};
