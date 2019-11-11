import * as React from 'react';
import { DirectEditorProps } from 'prosemirror-view';
import { EditorSharedConfig } from '../../context/shared-config';
import { createDispatchTransaction } from './create-dispatch-transaction';
import { createEditor, CreateEditorParams } from './create-editor';
import { EditorActions } from '../../../../..';

export function useEditor(
  config: CreateEditorParams & { editorActions?: EditorActions },
): [EditorSharedConfig | null, (ref: HTMLDivElement | null) => void] {
  const [editorSharedConfig, mountEditor] = useCreateEditor(config);
  const editorSharedConfigRef = React.useRef<EditorSharedConfig | null>(null);
  editorSharedConfigRef.current = editorSharedConfig;

  useApplyEditorViewProps(editorSharedConfig, config.disabled);
  useHandleEditorUnmount(editorSharedConfigRef);

  return [editorSharedConfig, mountEditor];
}

/**
 *
 * Sub hooks ¯\_(ツ)_/¯
 *
 */

function useCreateEditor(
  config: CreateEditorParams,
): [EditorSharedConfig | null, (ref: HTMLDivElement | null) => void] {
  const [
    editorSharedConfig,
    setEditorSharedConfig,
  ] = React.useState<EditorSharedConfig | null>(null);

  return [
    editorSharedConfig,

    // This callback is being used as `ref={callback}` on EditorContentProvider,
    // When called with `ref` mounts editor and creates editorSharedConfig.
    React.useCallback(
      (ref: HTMLDivElement | null) => {
        setEditorSharedConfig(
          editorSharedConfig =>
            editorSharedConfig || createEditor({ ...config, ref }),
        );
      },
      [config],
    ),
  ];
}

/**
 * Applies updated EditorView properties e.g. set dispatchTransaction or 'disabled' state changes
 */
function useApplyEditorViewProps(
  editorSharedConfig: EditorSharedConfig | null,
  disabled?: boolean,
) {
  React.useEffect(() => {
    if (editorSharedConfig) {
      editorSharedConfig.editorView.setProps({
        dispatchTransaction: createDispatchTransaction(editorSharedConfig),
      } as DirectEditorProps);

      editorSharedConfig.editorView.setProps({
        editable: _state => !disabled,
      } as DirectEditorProps);
    }
  }, [editorSharedConfig, disabled]);
}

/**
 * Handles editor component unmount
 */
function useHandleEditorUnmount(
  editorSharedConfigRef: React.MutableRefObject<EditorSharedConfig | null>,
) {
  React.useEffect(() => {
    // Need to keep this reference in order to make "react-hooks/exhaustive-deps" eslint rule happy
    const editorSharedConfig = editorSharedConfigRef;

    // Will unmount
    return () => {
      if (!editorSharedConfig.current) {
        return;
      }

      const { eventDispatcher, editorView } = editorSharedConfig.current;

      if (eventDispatcher) {
        eventDispatcher.destroy();
      }

      if (editorView) {
        // Prevent any transactions from coming through when unmounting
        editorView.setProps({
          dispatchTransaction: _tr => {},
        } as DirectEditorProps);

        // Destroy the state if the Editor is being unmounted
        const editorState = editorView.state;
        editorState.plugins.forEach(plugin => {
          const state = plugin.getState(editorState);
          if (state && state.destroy) {
            state.destroy();
          }
        });

        editorView.destroy();
      }
    };
  }, [editorSharedConfigRef]);
}
