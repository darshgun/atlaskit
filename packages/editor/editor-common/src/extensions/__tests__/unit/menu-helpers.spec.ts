import { getItemsFromModule } from '../../menu-helpers';
import { createFakeExtensionManifest } from '../../../../../editor-test-helpers/src/extensions';

describe('menu-helpers', () => {
  describe('getItemsFromCapability', () => {
    const awesomeExtension = createFakeExtensionManifest('awesome', 'awesome', [
      'awesome-list',
      'awesome-item',
    ]);

    const amazingExtension = createFakeExtensionManifest('amazing', 'amazing', [
      'amazing-list',
      'amazing-item',
    ]);

    test('should return all the extensions from a given capability', async () => {
      const insertMenuItems = getItemsFromModule(
        [awesomeExtension, amazingExtension],
        'insertMenu',
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
