import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { ProviderFactory } from '@atlaskit/editor-common';
import {
  EventDispatcher,
  createDispatch,
} from '../../../../../event-dispatcher';
import {
  processPluginsList,
  createPMPlugins,
  createSchema,
} from '../../../../../create-editor/create-editor';
import { processRawValue } from '../../../../../utils';
import { PortalProviderAPI } from '../../../../../ui/PortalProvider';
import { EditorSharedConfig } from '../../context/shared-config';
import { EditorProps } from '../../editor-props-type';

export function createEditor({
  context,

  plugins,
  portalProviderAPI,
  defaultValue,
  ref,

  popupsMountPoint,
  popupsBoundariesElement,
  popupsScrollableElement,

  disabled,
  onChange,
}: CreateEditorParams): EditorSharedConfig | null {
  if (!ref) {
    return null;
  }

  const eventDispatcher = new EventDispatcher();
  const providerFactory = new ProviderFactory();
  const dispatch = createDispatch(eventDispatcher);
  const editorConfig = processPluginsList(plugins || [], {});
  const schema = createSchema(editorConfig);
  const pmPlugins = createPMPlugins({
    editorConfig,
    schema,
    dispatch,
    eventDispatcher,
    props: {},
    portalProviderAPI: portalProviderAPI,
    providerFactory,
    reactContext: () => context,
    dispatchAnalyticsEvent: () => {},
  });

  const state = EditorState.create({
    schema,
    plugins: pmPlugins,
    doc: processRawValue(schema, defaultValue),
  });

  const editorView = new EditorView(
    { mount: ref },
    {
      state,
      attributes: { 'data-gramm': 'false' },

      // Ignore all transactions by default
      dispatchTransaction: () => {},

      // Disables the contentEditable attribute of the editor if the editor is disabled
      editable: _state => !!disabled,
    },
  );

  return {
    editorView,

    eventDispatcher,
    dispatch,

    primaryToolbarComponents: editorConfig.primaryToolbarComponents,
    contentComponents: editorConfig.contentComponents,

    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,

    disabled,
    providerFactory,
    onChange,
  };
}

export type CreateEditorParams = Pick<
  EditorProps,
  | 'defaultValue'
  | 'plugins'
  | 'popupsMountPoint'
  | 'popupsBoundariesElement'
  | 'popupsScrollableElement'
  | 'onChange'
  | 'disabled'
> & {
  context: any;
  ref?: HTMLDivElement | null;
  portalProviderAPI: PortalProviderAPI;
};
