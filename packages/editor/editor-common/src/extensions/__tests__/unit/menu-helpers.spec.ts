import { getItemsFromModule } from '../../menu-helpers';
import { createFakeExtensionManifest } from '../../../../../editor-test-helpers/src/extensions';

describe('menu-helpers', () => {
  describe('getItemsFromCapability', () => {
    const confluenceAwesomeMacro = createFakeExtensionManifest({
      title: 'Awesome macro',
      type: 'confluence.macro',
      extensionKey: 'awesome',
      nodeKeys: ['list', 'item'],
    });

    const confluenceAmazingMacro = createFakeExtensionManifest({
      title: 'Amazing macros',
      type: 'confluence.macro',
      extensionKey: 'amazing',
      nodeKeys: ['list', 'item'],
    });

    test('should return all the extensions from a given capability', async () => {
      const quickInsertItems = getItemsFromModule(
        [confluenceAwesomeMacro, confluenceAmazingMacro],
        'quickInsert',
        item => item.key,
      );

      expect(quickInsertItems).toEqual([
        'awesome:list',
        'awesome:item',
        'amazing:list',
        'amazing:item',
      ]);
    });
  });
});
