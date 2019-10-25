import { manifest as jqlTable } from './jql-table';
import { manifest as lorenIpsum } from './loren-ipsum';
import { DefaultExtensionProvider } from '@atlaskit/editor-common';

export const getXProductExtensionProvider = () =>
  new DefaultExtensionProvider([jqlTable, lorenIpsum]);
