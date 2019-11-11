import { getItemsFromModule } from '../../menu-helpers';
import { createFakeExtensionManifest } from '../../../../../editor-test-helpers/src/extensions';

describe('menu-helpers', () => {
  describe('getItemsFromCapability', () => {
    const confluenceAwesomeMacro = createFakeExtensionManifest({
      title: 'Awesome macro',
      type: 'confluence.macro',
      extensionKeys: ['awesome-list', 'awesome-item'],
    });

    const confluenceAmazingMacro = createFakeExtensionManifest({
      title: 'Amazing macros',
      type: 'confluence.macro',
      extensionKeys: ['amazing-list', 'amazing-item'],
    });

    test('should return all the extensions from a given capability', async () => {
      const insertMenuItems = getItemsFromModule(
        [confluenceAwesomeMacro, confluenceAmazingMacro],
        'quickInsert',
        item => item.key,
      );

      expect(insertMenuItems).toEqual([
        'awesome-list',
        'awesome-item',
        'amazing-list',
        'amazing-item',
      ]);
    });
  });
});
