import * as React from 'react';

import { ProviderHandler } from './types';
import ProviderFactory from './provider-factory';

const ProviderFactoryContext = React.createContext<ProviderFactory>(
  new ProviderFactory(),
);

export const ProviderFactoryProvider = ProviderFactoryContext.Provider;

export const useProviderFactory = () =>
  React.useContext(ProviderFactoryContext);

export const useProvider = <P extends Promise<any>>(name: string) => {
  const [provider, setProvider] = React.useState<P | undefined>();
  const providerFactory = useProviderFactory();

  React.useEffect(() => {
    const providerHandler: ProviderHandler = (_, provider) => {
      setProvider(provider as P);
    };

    providerFactory.subscribe(name, providerHandler);
    return () => {
      providerFactory.unsubscribe(name, providerHandler);
    };
  }, [name, providerFactory]);

  return provider;
};
