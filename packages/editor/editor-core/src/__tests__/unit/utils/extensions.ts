import { ExtensionProvider, ExtensionManifest } from '@atlaskit/editor-common';
import { extensionProviderToQuickInsertProvider } from '../../../utils/extensions';

const makeDummyQuickInsertItem = (id: number) => ({
  title: { value: `QI${id} Title` },
  description: { value: `QI${id} Description` },
  target: 'qi${id}-node',
});

const makeDummyExtensionManifest = (
  id: number,
  modules: object,
): ExtensionManifest => ({
  key: `dummy-extension-${id}`,
  title: {
    value: `Extension ${1}`,
  },
  description: {
    value: `Extension ${1} Description`,
  },
  icons: {
    '16': '',
    '48': '',
    '128': '',
  },
  modules,
});

const dummyExtension1 = makeDummyExtensionManifest(1, {
  quickInsert: [makeDummyQuickInsertItem(1), makeDummyQuickInsertItem(2)],
});

const dummyExtension2 = makeDummyExtensionManifest(2, {
  quickInsert: [makeDummyQuickInsertItem(3)],
});

const dummyExtensionProvider: ExtensionProvider = {
  async getExtensions() {
    return [dummyExtension1, dummyExtension2];
  },
};

describe('#extensionProviderToQuickInsertProvider', () => {
  it('should returns quickInsert items from all extensions', async () => {
    const quickInsertProvider = extensionProviderToQuickInsertProvider(
      dummyExtensionProvider,
    );

    const items = await quickInsertProvider.getItems();

    expect(items).toMatchObject([
      { title: 'QI1 Title' },
      { title: 'QI2 Title' },
      { title: 'QI3 Title' },
    ]);
  });
});
