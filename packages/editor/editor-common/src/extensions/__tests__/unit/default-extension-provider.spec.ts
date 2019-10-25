import DefaultExtensionProvider from '../../default-extension-provider';
import createFakeExtensionManifest from './helpers/create-fake-extension-manifest';

describe('default-extension-provider', () => {
  const awesomeExtension = createFakeExtensionManifest('awesome', 'awesome', [
    'awesome-list',
    'awesome-item',
  ]);

  const amazingExtension = createFakeExtensionManifest('amazing', 'amazing', [
    'amazing-list',
    'amazing-item',
  ]);

  let extensionProvider: DefaultExtensionProvider;

  beforeEach(() => {
    extensionProvider = new DefaultExtensionProvider([
      awesomeExtension,
      amazingExtension,
    ]);
  });

  test('should be able to recover all extensions', async () => {
    expect(await extensionProvider.getExtensions()).toEqual([
      awesomeExtension,
      amazingExtension,
    ]);
  });

  test('should be able to get an extension by key', async () => {
    expect(await extensionProvider.getExtension('awesome-extension')).toBe(
      awesomeExtension,
    );
    expect(await extensionProvider.getExtension('amazing-extension')).toBe(
      amazingExtension,
    );
    expect(await extensionProvider.getExtension('unknown-extension')).toBe(
      undefined,
    );
  });

  test('should be able to search through the available extensions', async () => {
    expect(await extensionProvider.search('awes')).toEqual([awesomeExtension]);
    expect(await extensionProvider.search('a')).toEqual([
      awesomeExtension,
      amazingExtension,
    ]);
    expect(await extensionProvider.search('amaz')).toEqual([amazingExtension]);
    expect(await extensionProvider.search('none')).toEqual([]);
  });
});
