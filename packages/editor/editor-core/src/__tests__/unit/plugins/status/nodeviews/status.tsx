import * as React from 'react';
import { ReactWrapper } from 'enzyme';
import { TextSelection, NodeSelection } from 'prosemirror-state';
import {
  createEditorFactory,
  doc,
  p,
  mountWithIntl,
  dispatchPasteEvent,
  status,
} from '@atlaskit/editor-test-helpers';
import { Status } from '@atlaskit/status';
import StatusNodeView, {
  Props as StatusNodeViewProps,
  StatusContainer,
  messages,
} from '../../../../../plugins/status/nodeviews/status';
import statusPlugin from '../../../../../plugins/status';
import { pluginKey, StatusType } from '../../../../../plugins/status/plugin';
import * as Actions from '../../../../../plugins/status/actions';
// @ts-ignore
import { __serializeForClipboard } from 'prosemirror-view';
import { EditorInstance } from '../../../../../types';

describe('Status - NodeView', () => {
  const testStatus: StatusType = {
    text: 'In progress',
    color: 'blue',
    localId: '666',
  };

  const createEditor = createEditorFactory();

  const editor = (doc: any) => {
    return createEditor({
      doc,
      editorPlugins: [statusPlugin({ menuDisabled: false })],
    });
  };

  it('should use status component', () => {
    const { editorView: view } = editor(doc(p('Status: {<>}')));

    Actions.updateStatus(testStatus)(view);

    const wrapper = mountWithIntl(
      <StatusNodeView
        view={view}
        node={view.state.selection.$from.nodeAfter!}
      />,
    );

    expect(wrapper.find(Status).length).toBe(1);
    expect(wrapper.find(Status).prop('text')).toBe('In progress');
    expect(wrapper.find(Status).prop('color')).toBe('blue');
    expect(wrapper.find(Status).prop('localId')).toBe('666');
  });

  it('should use status as placeholder when no text', () => {
    const { editorView: view } = editor(doc(p('Status: {<>}')));

    Actions.updateStatus({ ...testStatus, text: '' })(view);

    const wrapper = mountWithIntl(
      <StatusNodeView
        view={view}
        node={view.state.selection.$from.nodeAfter!}
      />,
    );
    expect(wrapper.find(Status).length).toBe(1);
    expect(wrapper.find(Status).prop('text')).toBe(
      messages.placeholder.defaultMessage,
    );
    expect(wrapper.find(Status).prop('color')).toBe('blue');
    expect(wrapper.find(Status).prop('localId')).toBe('666');
  });

  it('should use status as placeholder when empty text', () => {
    const { editorView: view } = editor(doc(p('Status: {<>}')));

    Actions.updateStatus({ ...testStatus, text: '        ' })(view);

    const wrapper = mountWithIntl(
      <StatusNodeView
        view={view}
        node={view.state.selection.$from.nodeAfter!}
      />,
    );
    expect(wrapper.find(Status).length).toBe(1);
    expect(wrapper.find(Status).prop('text')).toBe(
      messages.placeholder.defaultMessage,
    );
    expect(wrapper.find(Status).prop('color')).toBe('blue');
    expect(wrapper.find(Status).prop('localId')).toBe('666');
  });

  it('should call setStatusPickerAt on click', () => {
    const setStatusPickerAtSpy = jest.spyOn(Actions, 'setStatusPickerAt');
    const { editorView: view } = editor(doc(p('Status: {<>}'), p(' ')));

    Actions.updateStatus(testStatus)(view);

    const wrapper = mountWithIntl(
      <StatusNodeView
        view={view}
        node={(view.state.selection as NodeSelection).node}
      />,
    );
    wrapper.find(Status).simulate('click');

    expect(setStatusPickerAtSpy).toBeCalled();
  });

  describe('selection', () => {
    let wrapper: ReactWrapper<StatusNodeViewProps, {}>;
    let editorInstance: EditorInstance;

    const setTextSelection = (start: number, end?: number) => {
      const { editorView } = editorInstance;
      const { state, dispatch } = editorView;
      const { tr } = state;
      const $start = state.doc.resolve(start);
      const $end = end ? state.doc.resolve(end) : $start;
      dispatch(tr.setSelection(new TextSelection($start, $end)));
    };

    const setNodeSelection = (pos: number) => {
      const { editorView } = editorInstance;
      const { state, dispatch } = editorView;
      const { tr } = state;
      const $pos = state.doc.resolve(pos);
      dispatch(tr.setSelection(new NodeSelection($pos)));
    };

    const getPluginState = () => {
      return pluginKey.getState(editorInstance.editorView.state);
    };

    beforeEach(() => {
      jest.useFakeTimers();
      editorInstance = editor(doc(p('Status: {<>}')));

      const { editorView: view, eventDispatcher } = editorInstance;

      Actions.updateStatus(testStatus)(view);

      // @ts-ignore
      wrapper = mountWithIntl(
        <StatusNodeView
          eventDispatcher={eventDispatcher}
          view={view}
          node={(view.state.selection as NodeSelection).node}
        />,
      );

      expect(wrapper.find(Status).length).toBe(1);
    });

    afterEach(() => {
      wrapper.unmount();
    });

    it('selected after insert', () => {
      expect(wrapper.find(StatusContainer).prop('selected')).toBe(true);
      expect(getPluginState()).toMatchObject({
        showStatusPickerAt: 9,
        selectedStatus: expect.objectContaining(testStatus),
        isNew: true,
      });
    });

    it('selection of status', () => {
      // Set at selection start of paragraph
      setTextSelection(2);
      jest.runOnlyPendingTimers(); // WithPluginState debounces updates
      wrapper.update();

      expect(wrapper.find(StatusContainer).prop('selected')).toBe(false);
      expect(getPluginState()).toMatchObject({
        showStatusPickerAt: null,
        selectedStatus: null,
      });

      // Select status
      setNodeSelection(9);
      jest.runOnlyPendingTimers(); // WithPluginState debounces updates
      wrapper.update();
      expect(wrapper.find(StatusContainer).prop('selected')).toBe(true);
      expect(getPluginState()).toMatchObject({
        showStatusPickerAt: 9,
        selectedStatus: expect.objectContaining(testStatus),
        isNew: false,
      });
    });

    it('collapsed selection immediately after status', () => {
      setTextSelection(10);
      jest.runOnlyPendingTimers(); // WithPluginState debounces updates
      wrapper.update();
      expect(wrapper.find(StatusContainer).prop('selected')).toBe(false);
    });

    // FIXME
    // it('selection including status', () => {
    //   setTextSelection(5, 10);
    //   jest.runOnlyPendingTimers(); // WithPluginState debounces updates
    //   wrapper.update();
    //   expect(wrapper.find(StatusContainer).prop('selected')).toBe(true);
    // });

    it('Copying/pasting a Status instance should generate a new localId', () => {
      const { editorView } = editorInstance;
      let state = editorView.state;

      setTextSelection(1, 10);
      jest.runOnlyPendingTimers(); // WithPluginState debounces updates
      wrapper.update();

      // FIXME (as for previus test)
      // expect(wrapper.find(StatusContainer).prop('selected')).toBe(true);

      const { dom, text } = __serializeForClipboard(
        editorView,
        state.selection.content(),
      );

      // move cursor to the position to paste a new status
      setTextSelection(12);

      // paste Status
      dispatchPasteEvent(editorView, { html: dom.innerHTML, plain: text });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            'Status: ',
            status({
              text: 'In progress',
              color: 'blue',
              localId: '666',
            }),
            ' ',
          ),
          p(
            status({
              text: 'In progress',
              color: 'blue',
              localId: expect.stringMatching(
                /[a-f0-9]{8}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{12}/,
              ),
            }),
          ),
        ),
      );
    });
  });
});
