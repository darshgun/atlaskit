import { name } from '../../../../version.json';
import { mediaPlugin } from '../../../../plugins';
import { EditorPlugin } from '../../../../types';
import { mediaWithAltText, media } from '@atlaskit/adf-schema';

const getNodeNames = (plugin: EditorPlugin) =>
  plugin.nodes ? plugin.nodes().map(node => node.name) : [];

const getNode = (plugin: EditorPlugin, nodeName: string) =>
  plugin.nodes && plugin.nodes().find(({ name }) => name === nodeName);

describe(name, () => {
  describe('Plugins -> Media', () => {
    it('should not have mediaSingle node by default', () => {
      const availableNodes = getNodeNames(mediaPlugin());
      expect(availableNodes).toHaveLength(2);
      expect(availableNodes).not.toContain('mediaSingle');
    });

    it('should have mediaSingle node when allowMediaSingle is true', () => {
      const availableNodes = getNodeNames(
        mediaPlugin({
          provider: Promise.resolve() as any,
          allowMediaSingle: true,
        }),
      );
      expect(availableNodes).toHaveLength(3);
      expect(availableNodes).toContain('mediaSingle');
    });

    it('should not have mediaGroup node when allowMediaGroup is false', () => {
      const availableNodes = getNodeNames(
        mediaPlugin({
          allowMediaGroup: false,
          allowMediaSingle: true,
        }),
      );
      expect(availableNodes).toHaveLength(2);
      expect(availableNodes).not.toContain('mediaGroup');
    });

    it('should have media node including alt text when UNSAFE_allowAltTextOnImages is true', () => {
      const plugin: EditorPlugin = mediaPlugin({
        provider: Promise.resolve() as any,
        UNSAFE_allowAltTextOnImages: true,
      });

      expect(getNode(plugin, 'media')!.node).toBe(mediaWithAltText);
    });

    it('should have media node excluding alt text when UNSAFE_allowAltTextOnImages is false', () => {
      const plugin: EditorPlugin = mediaPlugin({
        provider: Promise.resolve() as any,
        UNSAFE_allowAltTextOnImages: false,
      });

      expect(getNode(plugin, 'media')!.node).toBe(media);
    });
  });
});
