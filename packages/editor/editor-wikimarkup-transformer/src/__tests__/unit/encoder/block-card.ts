import { defaultSchema } from '@atlaskit/adf-schema';
import WikiMarkupTransformer from '../../../index';

import { doc, blockCard } from '@atlaskit/editor-test-helpers';

describe('ADF => WikiMarkup - BlockCard', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert blockcard node', () => {
    const node = doc(blockCard({ url: 'https://www.dropbox.com' })())(
      defaultSchema,
    );
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert blockcard node with icft', () => {
    const node = doc(
      blockCard({
        url: 'https://product-fabric.atlassian.net/browse/EX-522#icft=EX-522',
      })(),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });
});
