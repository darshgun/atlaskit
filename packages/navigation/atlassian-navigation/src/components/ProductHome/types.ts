import { ComponentType, MouseEvent } from 'react';

export type ProductHomeProps = {
  /** The product icon. Expected to be an Icon from the Atlaskit Logo package. Visible on smaller screen sizes */
  icon: ComponentType<{
    size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | undefined;
  }>;
  /** The product logo, visible on larger screen sizes */
  logo: ComponentType<{}>;
  /** Optional onClick handler */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** Name of the site that appears next to the logo **/
  siteName?: string;
};

export type CustomProductHomeProps = {
  iconAlt: string;
  iconUrl: string;
  logoAlt: string;
  logoUrl: string;
  /** Optional onClick handler */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** Name of the site that appears next to the logo **/
  siteName?: string;
};
