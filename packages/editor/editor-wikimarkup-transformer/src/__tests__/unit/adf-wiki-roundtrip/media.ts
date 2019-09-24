import { defaultSchema } from '@atlaskit/adf-schema';
import WikiMarkupTransformer from '../../../index';

import { doc, mediaGroup, media } from '@atlaskit/editor-test-helpers';

describe('ADF => WikiMarkup - Media', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert mediaGroup node', () => {
    const node = doc(
      mediaGroup(
        media({ id: 'file1.txt', type: 'file', collection: 'tmp' })(),
        media({ id: 'file2.txt', type: 'file', collection: 'tmp' })(),
      ),
    )(defaultSchema);
    const wiki = transformer.encode(node);
    console.log(wiki);
    const adf = transformer.parse(wiki).toJSON();
    expect(adf).toEqual(node.toJSON());
  });
});
