import {
  ExtensionManifest,
  ExtensionModules,
  ExtensionModule,
  DefaultExtensionProvider,
} from '@atlaskit/editor-common';
import { extensionProviderToQuickInsertProvider } from '../../../utils/extensions';

const createFakeModule = (content: any) => () =>
  Promise.resolve({ default: content });

const makeDummyQuickInsertItem = (id: number): ExtensionModule => ({
  key: `qi${id}`,
  title: `QI${id} Title`,
  description: `QI${id} Description`,
  target: `qi${id}-node`,
});

const makeDummyExtensionManifest = (
  id: number,
  modules: ExtensionModules,
): ExtensionManifest => ({
  key: `dummy-extension-${id}`,
  title: `Extension ${1}`,
  description: `Extension ${1} Description`,
  icons: {
    '16': createFakeModule(''),
    '48': createFakeModule(''),
    '128': createFakeModule(''),
  },
  modules,
});

const dummyExtension1 = makeDummyExtensionManifest(1, {
  quickInsert: [makeDummyQuickInsertItem(1), makeDummyQuickInsertItem(2)],
  nodes: [],
});

const dummyExtension2 = makeDummyExtensionManifest(2, {
  quickInsert: [makeDummyQuickInsertItem(3)],
  nodes: [],
});

const dummyExtensionProvider = new DefaultExtensionProvider([
  dummyExtension1,
  dummyExtension2,
]);

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
