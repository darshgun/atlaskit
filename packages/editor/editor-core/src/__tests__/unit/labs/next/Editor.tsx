import * as React from 'react';
import { create } from 'react-test-renderer';
import { doc, p } from '@atlaskit/editor-test-helpers';
import {
  Editor,
  EditorContent,
  EditorProps,
} from '../../../../labs/next/Editor';
import { basePlugin } from '../../../../plugins';

describe('next/Editor', () => {
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
});

//#region helpers

const createEditor = ({
  props = {},
  createNodeMock,
}: {
  props?: EditorProps;
  createNodeMock?: (element: any) => any;
}) =>
  create(
    <Editor {...props} plugins={[basePlugin()]}>
      <EditorContent />
    </Editor>,
    {
      createNodeMock:
        createNodeMock ||
        (element => document.createElement(element.type as any)),
    },
  );

//#endregion
