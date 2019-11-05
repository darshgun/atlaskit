import { defaultSchema } from '@atlaskit/adf-schema';
import WikiMarkupTransformer from '../../../index';

import { doc, mediaGroup, media } from '@atlaskit/editor-test-helpers';

//roundtripping currently doesn't take into account centering
//and the sizes of the media thumbnail, as well as grouping.
//Ignoring for now.
describe.skip('ADF => WikiMarkup - Media', () => {
  const transformer = new WikiMarkupTransformer(defaultSchema);

  test('should convert mediaGroup node and back', () => {
    const node = doc(
      mediaGroup(
        media({ id: 'file1.txt', type: 'file', collection: '' })(),
        media({ id: 'file2.txt', type: 'file', collection: '' })(),
      ),
    )(defaultSchema);
    const wiki = transformer.encode(node);
    const adf = transformer.parse(wiki).toJSON();
    expect(adf).toEqual(node.toJSON());
  });
});

describe('WikiMarkup => ADF - Media', () => {
  const transformer = new WikiMarkupTransformer(defaultSchema);
  const expected = doc(
    mediaGroup(
      media({ id: 'file1.txt', type: 'file', collection: '' })(),
      media({ id: 'file2.txt', type: 'file', collection: '' })(),
      media({ id: 'file3.txt', type: 'file', collection: '' })(),
    ),
  )(defaultSchema);
  test('should convert attachment links to mediaGroup nodes', () => {
    const wiki = `[^file1.txt] [^file2.txt] [^file3.txt]`;
    const adf = transformer.parse(wiki);
    expect(adf.toJSON()).toEqual(expected.toJSON());
  });
  test('should convert attachment links with newlines to mediaGroup nodes', () => {
    const wiki = `[^file1.txt]\r\n[^file2.txt]\r\n[^file3.txt]`;
    const adf = transformer.parse(wiki);
    expect(adf.toJSON()).toEqual(expected.toJSON());
  });
});
