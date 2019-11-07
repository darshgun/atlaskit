import * as React from 'react';
import ProviderFactory from '@atlaskit/editor-common/src/providerFactory';

const ProviderFactoryContext = React.createContext<ProviderFactory>(new ProviderFactory());
const ProviderFactoryProvider = ProviderFactoryContext.Provider;
const useProviderFactory = () => React.useContext(ProviderFactoryContext);

export { ProviderFactoryProvider, useProviderFactory };
