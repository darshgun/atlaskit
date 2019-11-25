import * as React from 'react';
import { intlShape } from 'react-intl';
import * as PropTypes from 'prop-types';
import { WidthProvider } from '@atlaskit/editor-common';
import EditorContext from '../../../../ui/EditorContext';
import EditorActions from '../../../../actions';
import { PortalProviderAPI } from '../../../../ui/PortalProvider';
import { EditorProps } from '../editor-props-type';
import { EditorSharedConfigProvider } from '../context/shared-config';
import { useEditor } from '../hooks/use-editor';
import { EditorContentProvider } from './EditorContent';

export function EditorInternal(
  {
    onAnalyticsEvent,
    disabled,
    transformer,
    defaultValue,
    plugins,
    portalProviderAPI,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    onChange,
    onDestroy,
    onMount,
    children,
  }: EditorPropsExtended,
  context: any,
) {
  // Need to memoize editor actions otherwise in case when editor is not
  // wrapped with EditorContext every prop change triggers all hooks
  // that depend on editorActions
  const maybeEditorActions = (context || {}).editorActions;
  const editorActions = React.useMemo(
    () => maybeEditorActions || new EditorActions(),
    [maybeEditorActions],
  );

  const [editorSharedConfig, mountEditor] = useEditor({
    context,
    editorActions,
    onAnalyticsEvent,

    disabled,

    transformer,
    defaultValue,

    plugins,

    portalProviderAPI,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,

    onChange,
    onDestroy,
  });

  React.useEffect(() => {
    if (editorSharedConfig) {
      editorActions._privateRegisterEditor(
        editorSharedConfig.editorView,
        editorSharedConfig.eventDispatcher,
      );

      if (onMount) {
        onMount(editorActions);
      }

      return () => editorActions._privateUnregisterEditor();
    }
  }, [editorSharedConfig, editorActions, onMount]);

  return (
    <WidthProvider>
      <EditorContext editorActions={editorActions}>
        <EditorSharedConfigProvider value={editorSharedConfig}>
          <EditorContentProvider value={mountEditor}>
            {children}
          </EditorContentProvider>
        </EditorSharedConfigProvider>
      </EditorContext>
    </WidthProvider>
  );
}

EditorInternal.contextTypes = {
  editorActions: PropTypes.object,
  intl: intlShape,
};

export type EditorPropsExtended = EditorProps & {
  portalProviderAPI: PortalProviderAPI;
};
