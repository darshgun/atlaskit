import {
  createEditorFactory,
  doc,
  code_block,
  breakout,
} from '@atlaskit/editor-test-helpers';
import { getBreakoutMode } from '../../../../../plugins/breakout/utils/get-breakout-mode';

describe('Breakout Commands: getBreakoutMode', () => {
  const createEditor = createEditorFactory();

  it('should return a breakout mode of current node', () => {
    const { editorView } = createEditor({
      doc: doc(breakout({ mode: 'wide' })(code_block()('Hel{<>}lo'))),
      editorProps: {
        allowBreakout: true,
        appearance: 'full-page',
      },
    });

    expect(getBreakoutMode(editorView.state)).toEqual('wide');
  });

  it('should return undefined for not breakout node', () => {
    const { editorView } = createEditor({
      doc: doc(code_block()('Hel{<>}lo')),
      editorProps: {
        allowBreakout: true,
        appearance: 'full-page',
      },
    });

    expect(getBreakoutMode(editorView.state)).toBeUndefined();
  });
});
