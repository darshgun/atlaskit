import { EditorView } from 'prosemirror-view';
import { createMountUseEffect } from './__hookHelpers';
import { useHandleEditorUnmount } from '../../index';
describe('useHandleEditorUnmount', () => {
  let mockEditorView: EditorView;
  const mountUseEffect = createMountUseEffect();

  beforeEach(() => {
    mockEditorView = ({
      destroy: jest.fn(),
      setProps: jest.fn(),
      state: {
        plugins: [],
      },
    } as unknown) as EditorView;
  });

  test('should invoke on destroy', () => {
    const onDestroy = jest.fn();

    const testRenderer = mountUseEffect(() => {
      useHandleEditorUnmount({
        current: ({
          editorView: mockEditorView,
          onDestroy,
        } as unknown) as any,
      });
    });

    testRenderer!.unmount();
    expect(onDestroy).toBeCalledTimes(1);
  });
});
