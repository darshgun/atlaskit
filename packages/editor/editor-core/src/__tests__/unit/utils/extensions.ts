import {
  ExtensionModule,
  ExtensionModules,
  ExtensionManifest,
  ExtensionModuleNode,
  DefaultExtensionProvider,
} from '@atlaskit/editor-common';
import { extensionProviderToQuickInsertProvider } from '../../../utils/extensions';

const createFakeModule = (content: any) => () =>
  Promise.resolve({ default: content });

const makeDummyQuickInsertItem = (id: number): ExtensionModule => ({
  key: `qi-${id}`,
  title: `QI${id} Title`,
  description: `QI${id} Description`,
  target: `node-${id}`,
});

const makeDummyNode = (
  id: number,
  type: string = 'block',
): ExtensionModuleNode => ({
  key: `node-${id}`,
  type,
  insert: createFakeModule(''),
  render: createFakeModule(''),
});

const makeDummyExtensionManifest = (
  id: number,
  modules: ExtensionModules,
): ExtensionManifest => ({
  key: `dummy-extension-${id}`,
  title: `Extension ${id}`,
  description: `Extension ${id} Description`,
  icons: {
    '16': createFakeModule(''),
    '48': createFakeModule(''),
    '128': createFakeModule(''),
  },
  modules,
});

const dummyExtension1 = makeDummyExtensionManifest(1, {
  quickInsert: [makeDummyQuickInsertItem(1), makeDummyQuickInsertItem(2)],
  nodes: [makeDummyNode(1), makeDummyNode(2)],
});

const dummyExtension2 = makeDummyExtensionManifest(2, {
  quickInsert: [makeDummyQuickInsertItem(3)],
  nodes: [makeDummyNode(3)],
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
      { title: 'QI1 Title' },
      { title: 'QI2 Title' },
      { title: 'QI3 Title' },
    ]);
  });
});
