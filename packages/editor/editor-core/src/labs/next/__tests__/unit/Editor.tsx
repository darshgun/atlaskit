import * as React from 'react';
import { act, ReactTestRenderer } from 'react-test-renderer';
import { doc, p } from '@atlaskit/editor-test-helpers';
import { createEditorFactory, TestEditor } from './__create-editor-helper';

describe('next/Editor', () => {
  const createEditor = createEditorFactory();

  it('should fire onChange when text is inserted', async () => {
    const handleChange = jest.fn();
    const testRenderer = createEditor({
      props: {
        onMount(actions) {
          actions.appendText('hello');
        },
        onChange: handleChange,
      },
    });

    testRenderer.unmount();

    expect(handleChange).toHaveBeenCalled();
  });

  it('should use transformer for processing onChange', async () => {
    const handleChange = jest.fn();
    const testRenderer = createEditor({
      props: {
        onMount(actions) {
          actions.appendText('hello');
        },
        onChange: handleChange,
        transformer: schema => ({
          encode: () => 'encoded document',
          parse: () => doc(p(''))(schema),
        }),
      },
    });

    testRenderer.unmount();

    expect(handleChange).toHaveBeenCalledWith('encoded document');
  });

  it("shouldn't call 'onMount' twice when re-rendering editor with the same 'onMount' handler", () => {
    const onMount = jest.fn();
    let testRenderer: ReactTestRenderer;

    act(() => {
      testRenderer = createEditor({
        props: { onMount },
      });
    });

    act(() => {
      testRenderer.update(<TestEditor onMount={onMount} />);
    });

    testRenderer!.unmount();

    expect(onMount).toHaveBeenCalledTimes(1);
  });
});
