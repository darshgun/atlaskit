import { createFakeExtensionManifest } from '@atlaskit/editor-test-helpers/extensions';
import combineExtensionProviders from '../../combine-extension-providers';
import DefaultExtensionProvider from '../../default-extension-provider';
import {
  ExtensionHandlers,
  ExtensionHandler,
  ExtensionProvider,
} from '../../types';

import {
  getExtensionHandlers,
  getManifestNode,
} from '../../extension-handlers';

describe('extension-handlers', () => {
  let extensionHandlers: ExtensionHandlers;
  let extensionProvider: ExtensionProvider;

  beforeEach(async () => {
    const confluenceMacros = createFakeExtensionManifest(
      'fake confluence macro',
      'fake.confluence',
      ['expand', 'table-of-contents'],
    );
    const forgeExtensions = createFakeExtensionManifest(
      'fake forge extension',
      'fake.forge',
      ['rsvp', 'days-until'],
    );

    extensionProvider = combineExtensionProviders([
      new DefaultExtensionProvider([confluenceMacros]),
      new DefaultExtensionProvider([forgeExtensions]),
    ]);

    extensionHandlers = await getExtensionHandlers(extensionProvider);
  });

  describe('getExtensionHandlers', () => {
    test('should return a map containing all manifest keys (extension type)', () => {
      expect(extensionHandlers['fake.confluence-extension']).toBeDefined();
      expect(extensionHandlers['fake.forge-extension']).toBeDefined();
    });

    describe('when an extension handler is called', () => {
      test('should return a react component synchronously, passing down the extension node', () => {
        const extensionHandler = extensionHandlers[
          'fake.confluence-extension'
        ] as ExtensionHandler<any>;

        expect(
          extensionHandler(
            {
              extensionKey: 'expand',
              extensionType: 'fake.confluence-extension',
              parameters: {
                text: 'inside out',
              },
            },
            {},
          ),
        ).toMatchInlineSnapshot(`
          <LoadableComponent
            ext={
              Object {
                "extensionKey": "expand",
                "extensionType": "fake.confluence-extension",
                "parameters": Object {
                  "text": "inside out",
                },
              }
            }
          />
        `);
      });
    });
  });

  describe('getManifestNode', () => {
    test('should return the manifest node when found', async () => {
      const node = await getManifestNode(
        extensionProvider,
        'fake.confluence-extension',
        'expand',
      );
      expect(Object.keys(node)).toEqual(['key', 'type', 'insert', 'render']);
    });

    test('should throw if extension type is not found', () => {
      return expect(
        getManifestNode(extensionProvider, 'fake.unknown-extension', 'expand'),
      ).rejects.toEqual(
        new Error(`Extension with key "fake.unknown-extension" not found!`),
      );
    });

    test('should throw if extension key is not found', () => {
      return expect(
        getManifestNode(
          extensionProvider,
          'fake.confluence-extension',
          'answer-to-life',
        ),
      ).rejects.toEqual(
        new Error(
          `Node with key "answer-to-life" not found on extension "fake.confluence-extension"!`,
        ),
      );
    });
  });
});
