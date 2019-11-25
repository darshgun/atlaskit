import { DefaultExtensionProvider } from '@atlaskit/editor-common';
import { createFakeExtensionManifest } from '@atlaskit/editor-test-helpers/extensions';

import { extensionProviderToQuickInsertProvider } from '../../../utils/extensions';

const dummyExtension1 = createFakeExtensionManifest({
  title: 'First dummy extension',
  type: 'com.atlassian.forge',
  extensionKey: 'first',
});

const dummyExtension2 = createFakeExtensionManifest({
  title: 'Second dummy extension',
  type: 'com.atlassian.forge',
  extensionKey: 'second',
});

const dummyExtensionProvider = new DefaultExtensionProvider([
  dummyExtension1,
  dummyExtension2,
]);

describe('#extensionProviderToQuickInsertProvider', () => {
  it('should returns quickInsert items from all extensions', async () => {
    const quickInsertProvider = await extensionProviderToQuickInsertProvider(
      dummyExtensionProvider,
    );

    const items = await quickInsertProvider.getItems();

    expect(items).toMatchObject([
      { title: 'First dummy extension' },
      { title: 'Second dummy extension' },
    ]);
  });
});
