import {
  createEditorFactory,
  doc,
  p,
  sleep,
} from '@atlaskit/editor-test-helpers';
import { ProviderFactory } from '@atlaskit/editor-common';

describe('collab-edit: plugin', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: any, providerFactory?: any) => {
    return createEditor({
      doc,
      editorProps: {
        allowUnsupportedContent: true,
        collabEdit: {},
      },
      providerFactory,
    });
  };

  it("should not be sending transactions through collab provider before it's ready", async () => {
    const send = jest.fn();
    const providerFactory = ProviderFactory.create({
      collabEditProvider: Promise.resolve({
        on() {
          return this;
        },
        initialize() {},
        unsubscribeAll() {},
        send,
      }) as any,
    });
    const { editorView } = editor(doc(p('')), providerFactory);
    await sleep(10);

    editorView.dispatch(editorView.state.tr.insertText('123'));

    expect(send).not.toBeCalled();
  });

  it("should be sending transactions through collab provider when it's ready", async () => {
    const send = jest.fn();
    const providerFactory = ProviderFactory.create({
      collabEditProvider: Promise.resolve({
        on() {
          return this;
        },
        initialize() {},
        unsubscribeAll() {},
        send,
      }) as any,
    });
    const { editorView } = editor(doc(p('')), providerFactory);
    await sleep(10);

    editorView.dispatch(
      editorView.state.tr.scrollIntoView().setMeta('collabInitialised', true),
    );

    editorView.dispatch(editorView.state.tr.insertText('123'));

    expect(send).toBeCalled();
  });
});
