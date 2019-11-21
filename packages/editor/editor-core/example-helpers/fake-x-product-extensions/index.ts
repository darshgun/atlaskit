import { manifest as jqlTable } from './jql-table';
import { manifest as loremIpsum } from './lorem-ipsum';
import { manifest as awesomeExtension } from './awesome';

import { DefaultExtensionProvider } from '@atlaskit/editor-common';

export const getXProductExtensionProvider = () =>
  new DefaultExtensionProvider([jqlTable, loremIpsum, awesomeExtension]);
