import { createFakeExtensionManifest } from '@atlaskit/editor-test-helpers/extensions';
import DefaultExtensionProvider from '../../default-extension-provider';
import combineExtensionProviders from '../../combine-extension-providers';
import { ExtensionProvider } from 'src/extensions/types';

describe('combine-extension-providers', () => {
  const awesomeExtension = createFakeExtensionManifest('awesome', 'awesome', [
    'awesome-list',
    'awesome-item',
  ]);

  const amazingExtension = createFakeExtensionManifest('amazing', 'amazing', [
    'amazing-list',
    'amazing-item',
  ]);

  const shitExtension = createFakeExtensionManifest('shit', 'shit', [
    'shit-list',
    'shit-item',
  ]);

  const mehhExtension = createFakeExtensionManifest('mehh', 'mehh', [
    'mehh-list',
    'mehh-item',
  ]);

  let combinedExtensionProvider: ExtensionProvider;

  beforeEach(() => {
    combinedExtensionProvider = combineExtensionProviders([
      new DefaultExtensionProvider([awesomeExtension, amazingExtension]),
      new DefaultExtensionProvider([shitExtension, mehhExtension]),
    ]);
  });

  test('should apply the methods from a provider in a list of providers seamlessly', async () => {
    expect(combinedExtensionProvider).toHaveProperty('getExtensions');
    expect(combinedExtensionProvider).toHaveProperty('getExtension');
    expect(combinedExtensionProvider).toHaveProperty('search');
  });

  test('should be able to recover all extensions', async () => {
    expect(await combinedExtensionProvider.getExtensions()).toEqual([
      awesomeExtension,
      amazingExtension,
      shitExtension,
      mehhExtension,
    ]);
  });

  test('should be able to get an extension by key', async () => {
    expect(
      await combinedExtensionProvider.getExtension('awesome-extension'),
    ).toBe(awesomeExtension);
    expect(await combinedExtensionProvider.getExtension('shit-extension')).toBe(
      shitExtension,
    );
    expect(await combinedExtensionProvider.getExtension('mehh-extension')).toBe(
      mehhExtension,
    );
    expect(
      await combinedExtensionProvider.getExtension('unknown-extension'),
    ).toBe(undefined);
  });

  test('should be able to search through the available extensions', async () => {
    expect(await combinedExtensionProvider.search('awes')).toEqual([
      awesomeExtension,
    ]);
    expect(await combinedExtensionProvider.search('a')).toEqual([
      awesomeExtension,
      amazingExtension,
    ]);
    expect(await combinedExtensionProvider.search('amaz')).toEqual([
      amazingExtension,
    ]);
    expect(await combinedExtensionProvider.search('shi')).toEqual([
      shitExtension,
    ]);
    expect(await combinedExtensionProvider.search('me')).toEqual([
      awesomeExtension,
      mehhExtension,
    ]);
    expect(await combinedExtensionProvider.search('none')).toEqual([]);
  });

  test('should work even if the provider is a promise', async () => {
    const providers = combineExtensionProviders([
      Promise.resolve(
        new DefaultExtensionProvider([awesomeExtension, amazingExtension]),
      ),

      new DefaultExtensionProvider([shitExtension, mehhExtension]),
    ]);

    expect(await providers.getExtensions()).toEqual([
      awesomeExtension,
      amazingExtension,
      shitExtension,
      mehhExtension,
    ]);

    expect(await providers.getExtension('awesome-extension')).toBe(
      awesomeExtension,
    );

    expect(await providers.search('me')).toEqual([
      awesomeExtension,
      mehhExtension,
    ]);
  });

  describe('should fail silently', () => {
    const asyncExtension1 = createFakeExtensionManifest('async1', 'async1', [
      'async1-list',
      'async1-item',
    ]);

    const asyncExtension2 = createFakeExtensionManifest('async2', 'async2', [
      'async2-list',
      'async2-item',
    ]);

    const asyncExtension3 = createFakeExtensionManifest('async3', 'async3', [
      'async3-list',
      'async3-item',
    ]);

    const asyncExtension4 = createFakeExtensionManifest('async4', 'async4', [
      'async4-list',
      'async4-item',
    ]);

    let providers: DefaultExtensionProvider[];

    beforeEach(() => {
      providers = [
        new DefaultExtensionProvider([asyncExtension1]),
        new DefaultExtensionProvider([asyncExtension2]),
        new DefaultExtensionProvider([asyncExtension3]),
        new DefaultExtensionProvider([asyncExtension4]),
        new DefaultExtensionProvider([awesomeExtension, amazingExtension]),
      ];
    });

    test('should discard failed providers and return all valid results', async () => {
      const combinedProviders = combineExtensionProviders([
        Promise.resolve(new DefaultExtensionProvider([asyncExtension1])),
        Promise.reject(new DefaultExtensionProvider([asyncExtension2])),
        Promise.resolve(new DefaultExtensionProvider([asyncExtension3])),
        Promise.reject(new DefaultExtensionProvider([asyncExtension4])),
        Promise.resolve(
          new DefaultExtensionProvider([awesomeExtension, amazingExtension]),
        ),
      ]);

      expect(await combinedProviders.getExtensions()).toEqual([
        asyncExtension1,
        asyncExtension3,
        awesomeExtension,
        amazingExtension,
      ]);

      expect(await combinedProviders.getExtension('awesome-extension')).toBe(
        awesomeExtension,
      );

      expect(await combinedProviders.search('me')).toEqual([awesomeExtension]);

      expect(await combinedProviders.search('async')).toEqual([
        asyncExtension1,
        asyncExtension3,
      ]);
    });

    test('getExtensions should discard failures and return valid results', async () => {
      providers[0].getExtensions = jest.fn().mockRejectedValue('error');
      providers[2].getExtensions = jest.fn().mockRejectedValue('error');

      const combinedProviders = combineExtensionProviders(providers);

      expect(await combinedProviders.getExtensions()).toEqual([
        asyncExtension2,
        asyncExtension4,
        awesomeExtension,
        amazingExtension,
      ]);
    });

    test('getExtension should discard failures and return valid results', async () => {
      const combinedProviders = combineExtensionProviders(providers);

      providers[4].getExtension = jest.fn().mockRejectedValue('error');

      expect(
        await combinedProviders.getExtension('awesome-extension'),
      ).not.toBeDefined();
    });

    test('search should discard failures and return valid results', async () => {
      const combinedProviders = combineExtensionProviders(providers);

      providers[4].search = jest.fn().mockRejectedValue('error');

      expect(await combinedProviders.search('me')).toEqual([]);

      providers[0].search = jest.fn().mockRejectedValue('error');
      providers[3].search = jest.fn().mockRejectedValue('error');

      expect(await combinedProviders.search('async')).toEqual([
        asyncExtension2,
        asyncExtension3,
      ]);
    });
  });
});
