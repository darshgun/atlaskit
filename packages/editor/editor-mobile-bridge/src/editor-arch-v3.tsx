import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { determineMode } from './bridge-utils';
import { EditorActions, EditorContext } from '@atlaskit/editor-core';
import { EditorPresetMobile } from '@atlaskit/editor-core/src/labs/next/presets/mobile';
import { Mobile as MobileEditor } from '@atlaskit/editor-core/src/labs/next/mobile';
import { AtlaskitThemeProvider } from '@atlaskit/theme/components';
import { Provider as SmartCardProvider } from '@atlaskit/smart-card';
import { analyticsBridgeClient } from './analytics-client';
import FabricAnalyticsListeners, {
  AnalyticsWebClient,
} from '@atlaskit/analytics-listeners';
import { toNativeBridge } from './editor/web-to-native';
import WebBridgeImpl from './editor/native-to-web';
import { cardClient } from './providers/cardProvider';
import { EditorViewWithComposition } from './types';
import {
  initPluginListeners,
  destroyPluginListeners,
} from './editor/plugin-subscription';
import {
  MediaProvider,
  MentionProvider,
  TaskDecisionProvider,
  EmojiProvider,
} from './providers';
import MobilePicker from './editor/MobileMediaPicker';

function main(window: Window, document: Document) {
  const params = new URLSearchParams(window.location.search);
  const mode = determineMode(params.get('mode'));

  const bridge = new WebBridgeImpl();
  const actions = bridge.editorActions;

  const analyticsClient = analyticsBridgeClient(event => {
    toNativeBridge.call('analyticsBridge', 'trackEvent', {
      event: JSON.stringify(event),
    });
  });

  ReactDOM.render(
    <MobileEditorArchV3
      editorActions={bridge.editorActions}
      mode={mode}
      analyticsClient={analyticsClient}
      onChange={() => {
        toNativeBridge.updateText(bridge.getContent());
      }}
      onMount={actions => {
        const view = actions._privateGetEditorView() as EditorViewWithComposition;
        const eventDispatcher = actions._privateGetEventDispatcher()!;
        bridge.editorView = view;
        bridge.editorActions._privateRegisterEditor(view, eventDispatcher);
        initPluginListeners(eventDispatcher, bridge, view);
      }}
      onDestroy={() => {
        destroyPluginListeners(actions._privateGetEventDispatcher()!, bridge);
        bridge.editorActions._privateUnregisterEditor();
        bridge.editorView = null;
        bridge.mentionsPluginState = null;
      }}
    />,
    document.getElementById('editor'),
  );
}

interface MobileEditorArchV3Props {
  editorActions: EditorActions;
  mode: 'dark' | 'light';
  analyticsClient: AnalyticsWebClient;
  onDestroy?(): void;
  onChange?(content: any): void;
  onMount?(actions: EditorActions): void;
}

function MobileEditorArchV3(props: MobileEditorArchV3Props): JSX.Element {
  return (
    <FabricAnalyticsListeners client={props.analyticsClient}>
      {/* Temporarily opting out of the default oauth2 flow for phase 1 of Smart Links */}
      {/* See https://product-fabric.atlassian.net/browse/FM-2149 for details. */}
      <SmartCardProvider client={cardClient} authFlow="disabled">
        <AtlaskitThemeProvider mode={props.mode}>
          <EditorPresetMobile
            mentionProvider={Promise.resolve(MentionProvider)}
            emojiProvider={Promise.resolve(EmojiProvider)}
            taskDecisionProvider={Promise.resolve(TaskDecisionProvider())}
            media={{
              provider: MediaProvider,
              picker: new MobilePicker(),
            }}
          >
            <EditorContext editorActions={props.editorActions}>
              <MobileEditor
                onChange={props.onChange}
                onDestroy={props.onDestroy}
                onMount={props.onMount}
              />
            </EditorContext>
          </EditorPresetMobile>
        </AtlaskitThemeProvider>
      </SmartCardProvider>
    </FabricAnalyticsListeners>
  );
}

document.addEventListener('DOMContentLoaded', () => main(window, document));
