import { ComponentType } from 'react';

export type ProductHomeProps = {
  /** The product icon. Expected to be an Icon from the Atlaskit Logo package. Visible on smaller screen sizes */
  icon: ComponentType<{
    size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | undefined;
  }>;
  /** The product logo, visible on larger screen sizes */
  logo: ComponentType<{}>;
};

export type CustomProductHomeProps = {
  iconAlt: string;
  iconUrl: string;
  logoAlt: string;
  logoUrl: string;
};
