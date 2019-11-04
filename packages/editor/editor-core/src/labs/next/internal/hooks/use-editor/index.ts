import * as React from 'react';
import { DirectEditorProps } from 'prosemirror-view';
import { measureRender, getResponseEndTime } from '@atlaskit/editor-common';
import EditorActions from '../../../../../actions';
import measurements from '../../../../../utils/performance/measure-enum';
import { getNodesCount } from '../../../../../utils';
import {
  analyticsEventKey,
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
} from '../../../../../plugins/analytics';
import { EditorSharedConfig } from '../../context/shared-config';
import { createDispatchTransaction } from './create-dispatch-transaction';
import { createEditor, CreateEditorParams } from './create-editor';
import { useAnalyticsHandler } from '../use-analytics';

export function useEditor(
  config: CreateEditorParams & { editorActions?: EditorActions },
): [EditorSharedConfig | null, (ref: HTMLDivElement | null) => void] {
  const [editorSharedConfig, mountEditor] = useCreateEditor(config);
  const editorSharedConfigRef = React.useRef<EditorSharedConfig | null>(null);
  editorSharedConfigRef.current = editorSharedConfig;

  useApplyEditorViewProps(editorSharedConfig, config.disabled);
  useHandleEditorUnmount(editorSharedConfigRef);
  useAnalyticsHandler(editorSharedConfigRef);

  return [editorSharedConfig, mountEditor];
}

/**
 *
 * Sub hooks ¯\_(ツ)_/¯
 *
 */

/**
 * Main hook that creates an instance of EditorView, EditorSharedConfig, etc...
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
        // If editorSharedConfig already exists it means that editorView is mounted
        // and we just need to ignore this function altogether.
        if (!ref) {
          return;
        }

        setEditorSharedConfig(editorSharedConfig => {
          if (!editorSharedConfig) {
            measureRender(
              measurements.PROSEMIRROR_RENDERED,
              (duration, startTime) => {
                if (sharedConfig && sharedConfig.dispatch) {
                  sharedConfig.dispatch(analyticsEventKey, {
                    payload: {
                      action: ACTION.PROSEMIRROR_RENDERED,
                      actionSubject: ACTION_SUBJECT.EDITOR,
                      attributes: {
                        duration,
                        startTime,
                        nodes: getNodesCount(sharedConfig.editorView.state.doc),
                        ttfb: getResponseEndTime(),
                      },
                      eventType: EVENT_TYPE.OPERATIONAL,
                    },
                  });
                }
              },
            );
          }

          const sharedConfig =
            editorSharedConfig || createEditor({ ...config, ref });
          return sharedConfig;
        });
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
  React.useEffect(
    () => {
      if (editorSharedConfig) {
        editorSharedConfig.editorView.setProps({
          dispatchTransaction: createDispatchTransaction(editorSharedConfig),
        } as DirectEditorProps);

        editorSharedConfig.editorView.setProps({
          editable: _state => !disabled,
        } as DirectEditorProps);
      }
    },
    [editorSharedConfig, disabled],
  );
}

/**
 * Handles editor component unmount
 */
export function useHandleEditorUnmount(
  editorSharedConfigRef: React.MutableRefObject<EditorSharedConfig | null>,
) {
  React.useEffect(
    () => {
      // Need to keep this reference in order to make "react-hooks/exhaustive-deps" eslint rule happy
      const editorSharedConfig = editorSharedConfigRef;

      // Will unmount
      return () => {
        if (!editorSharedConfig.current) {
          return;
        }

        const {
          eventDispatcher,
          editorView,
          onDestroy,
        } = editorSharedConfig.current;

        if (eventDispatcher) {
          eventDispatcher.destroy();
        }

        if (editorView) {
          // Prevent any transactions from coming through when unmounting
          editorView.setProps({
            dispatchTransaction: _tr => {},
          } as DirectEditorProps);

          if (onDestroy) {
            onDestroy();
          }

          // Destroy plugin states and editor state
          // when the editor is being unmounted
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
    },
    [editorSharedConfigRef],
  );
}
