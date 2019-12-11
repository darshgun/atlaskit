import { ComponentType, MouseEvent } from 'react';
import { LogoProps } from '@atlaskit/logo';

export type ProductHomeProps = {
  /** The product icon. Expected to be an Icon from the Atlaskit Logo package. Visible on smaller screen sizes */
  icon: ComponentType<Partial<LogoProps>>;
  /** The product logo, visible on larger screen sizes */
  logo: ComponentType<Partial<LogoProps>>;
  /** Optional onClick handler */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** Optional mouseDown handler */
  onMouseDown?: (event: MouseEvent<HTMLElement>) => void;
  /** Href to be passed to product home */
  href?: string;
  /** Name of the site that appears next to the logo **/
  siteTitle?: string;
};

export type CustomProductHomeProps = {
  iconAlt: string;
  iconUrl: string;
  logoAlt: string;
  logoUrl: string;
  /** Optional onClick handler */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** Optional mouseDown handler */
  onMouseDown?: (event: MouseEvent<HTMLElement>) => void;
  /** Href to be passed to product home */
  href?: string;
  /** Name of the site that appears next to the logo **/
  siteTitle?: string;
};
