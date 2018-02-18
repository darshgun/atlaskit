import * as React from 'react';
import {
  EditorProps,
  EditorInstance,
  ReactEditorView,
  setTextSelection,
  getDefaultPluginsList,
  EditorPlugin,
} from '@atlaskit/editor-core';
import { ProviderFactory } from '@atlaskit/editor-common';
import { mount } from 'enzyme';
import { RefsNode, Refs } from './schema-builder';
import { Schema } from 'prosemirror-model';
import { PluginKey } from 'prosemirror-state';
import jsdomFixtures from './jsdom-fixtures';

class TestReactEditorView extends ReactEditorView<{
  plugins?: EditorPlugin[];
}> {
  getPlugins(editorProps: EditorProps): EditorPlugin[] {
    return this.props.plugins || super.getPlugins(editorProps);
  }
}

export type Options = {
  doc?: (schema: Schema) => RefsNode;
  // It needs to be any, otherwise TypeScript complains about mismatching types when dist folder exists
  editorPlugins?: any[];
  editorProps?: EditorProps;
  providerFactory?: ProviderFactory;
  pluginKey?: PluginKey;
};

export default function createEditorForTests<T = any>({
  doc,
  editorProps = {},
  editorPlugins,
  providerFactory,
  pluginKey,
}: Options): EditorInstance & {
  refs: Refs;
  sel: number;
  plugin: any;
  pluginState: T;
} {
  const plugins = editorPlugins
    ? [...getDefaultPluginsList(), ...editorPlugins]
    : undefined;
  const place = document.body.appendChild(document.createElement('div'));
  const editor = mount(
    <TestReactEditorView
      editorProps={editorProps}
      providerFactory={
        providerFactory ? providerFactory : new ProviderFactory()
      }
      onEditorCreated={() => {}}
      onEditorDestroyed={() => {}}
      plugins={plugins}
    />,
    { attachTo: place },
  );

  // Work around JSDOM/Node not supporting DOM Selection API
  if (
    !('getSelection' in window) &&
    navigator.userAgent.indexOf('Node.js') !== -1
  ) {
    jsdomFixtures((editor.instance() as ReactEditorView).view);
  }

  let refs;
  const { view: editorView } = editor.instance() as ReactEditorView;

  if (doc) {
    const defaultDoc = doc(editorView!.state.schema);
    const tr = editorView!.state.tr.replaceWith(
      0,
      editorView!.state.doc.nodeSize - 2,
      defaultDoc.content,
    );

    tr.setMeta('addToHistory', false);
    editorView!.dispatch(tr);

    refs = defaultDoc.refs;
    if (refs) {
      // Collapsed selection.
      if ('<>' in refs) {
        setTextSelection(editorView!, refs['<>']);
        // Expanded selection
      } else if ('<' in refs || '>' in refs) {
        if ('<' in refs === false) {
          throw new Error('A `<` ref must complement a `>` ref.');
        }
        if ('>' in refs === false) {
          throw new Error('A `>` ref must complement a `<` ref.');
        }
        setTextSelection(editorView!, refs['<'], refs['>']);
      }
    }
  }

  let plugin;
  let pluginState;

  if (pluginKey) {
    plugin = pluginKey.get(editorView!.state);
    pluginState = pluginKey.getState(editorView!.state);
  }

  afterEach(() => {
    editor.unmount();
    editor.detach();
    if (place && place.parentNode) {
      place.parentNode.removeChild(place);
    }
  });

  const {
    eventDispatcher,
    config: {
      contentComponents,
      primaryToolbarComponents,
      secondaryToolbarComponents,
    },
  } = editor.instance() as ReactEditorView;
  return {
    editorView: editorView!,
    eventDispatcher,
    contentComponents,
    primaryToolbarComponents,
    secondaryToolbarComponents,
    refs,
    sel: refs ? refs['<>'] : 0,
    plugin,
    pluginState,
  };
}
