/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
  containerCSS,
  customProductIconCSS,
  customProductLogoCSS,
  productIconCSS,
  productLogoCSS,
} from './styles';
import { CustomProductHomeProps, ProductHomeProps } from './types';

export const ProductHome = ({
  icon: Icon,
  logo: Logo,
  onClick = () => {},
}: ProductHomeProps) => (
  <div css={containerCSS} onClick={onClick}>
    <div css={productLogoCSS}>
      <Logo />
    </div>
    <div css={productIconCSS}>
      <Icon size="small" />
    </div>
  </div>
);

export const CustomProductHome = (props: CustomProductHomeProps) => {
  const { iconAlt, iconUrl, logoAlt, logoUrl, onClick } = props;

  return (
    <div css={containerCSS} onClick={onClick}>
      <img css={customProductLogoCSS} src={logoUrl} alt={logoAlt} />
      <img css={customProductIconCSS} src={iconUrl} alt={iconAlt} />
    </div>
  );
};
