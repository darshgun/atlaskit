import React from 'react';
import { createFakeExtensionManifest } from '@atlaskit/editor-test-helpers/extensions';
import combineExtensionProviders from '../../combine-extension-providers';
import DefaultExtensionProvider from '../../default-extension-provider';
import { ExtensionHandlers, ExtensionProvider } from '../../types';

import { getNodeRenderer, getManifestNode } from '../../extension-handlers';
import Loadable from 'react-loadable';
import { shallow } from 'enzyme';

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
  });

  describe('getNodeRenderer', () => {
    test('should return a react component synchronously, passing down the extension node, which will eventually reolve to the extension handler', async () => {
      const NodeRenderer = getNodeRenderer(
        extensionProvider,
        'fake.confluence-extension',
        'expand',
      );

      const extensionParams = {
        extensionKey: 'expand',
        extensionType: 'fake.confluence-extension',
        parameters: {
          text: 'inside out',
        },
      };

      const wrapper = shallow(
        <NodeRenderer extensionParams={extensionParams} />,
      );

      expect(NodeRenderer.name).toBe('LoadableComponent');
      // LoadableComponent renders a component with isLoading = true
      expect(wrapper.props().isLoading).toBe(true);

      await Loadable.preloadAll();

      wrapper.update();

      // After the update, LoadableComponent is removed and our extension is rendered
      expect(wrapper.props().isLoading).not.toBeDefined();
      expect(wrapper.props().extensionParams).toEqual(extensionParams);
    });

    describe('once the node resolves to a component', () => {
      test('should render error message if extension type is not found', async () => {
        const NodeRenderer = getNodeRenderer(
          extensionProvider,
          'fake.unknown-extension',
          'expand',
        );

        const extensionParams = {
          extensionKey: 'expand',
          extensionType: 'fake.unknown-extension',
          parameters: {
            text: 'inside out',
          },
        };

        const wrapper = shallow(
          <NodeRenderer extensionParams={extensionParams} />,
        );

        await expect(Loadable.preloadAll()).rejects.toEqual(
          new Error(`Extension with key "fake.unknown-extension" not found!`),
        );

        wrapper.update();

        expect(wrapper.dive().text()).toEqual('Error loading the extension!');
      });

      test('should render error message if extension key is not found', async () => {
        const NodeRenderer = getNodeRenderer(
          extensionProvider,
          'fake.confluence-extension',
          'answer-to-life',
        );

        const extensionParams = {
          extensionKey: 'answer-to-life',
          extensionType: 'fake.confluence-extension',
          parameters: {
            text: 'inside out',
          },
        };

        const wrapper = shallow(
          <NodeRenderer extensionParams={extensionParams} />,
        );

        await expect(Loadable.preloadAll()).rejects.toEqual(
          new Error(
            `Node with key "answer-to-life" not found on extension "fake.confluence-extension"!`,
          ),
        );

        wrapper.update();

        expect(wrapper.dive().text()).toEqual('Error loading the extension!');
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
