import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import {
  selectParentNodeOfType,
  findSelectedNodeOfType,
} from 'prosemirror-utils';
import { MacroProvider } from '../../../macro';
import InlineExtension from './InlineExtension';
import Extension from './Extension';
import {
  ExtensionHandlers,
  getExtensionRenderer,
  getNodeRenderer,
  ExtensionProvider,
  Providers,
} from '@atlaskit/editor-common';
import { setNodeSelection } from '../../../../utils';

export interface Props {
  editorView: EditorView;
  providers: Providers;
  node: PMNode;
  handleContentDOMRef: (node: HTMLElement | null) => void;
  extensionHandlers: ExtensionHandlers;
}

export interface State {
  extensionProvider?: ExtensionProvider;
  macroProvider?: MacroProvider;
  extensionHandlersFromProvider?: ExtensionHandlers;
}

export default class ExtensionComponent extends Component<Props, State> {
  state: State = {};
  mounted = false;

  UNSAFE_componentWillMount() {
    this.mounted = true;
  }

  componentDidMount() {
    const { providers } = this.props;

    if (providers) {
      this.handleProviders(providers);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const { providers } = nextProps;

    if (providers && this.props.providers !== providers) {
      this.handleProviders(providers);
    }
  }

  render() {
    const { macroProvider } = this.state;
    const { node, handleContentDOMRef, editorView } = this.props;
    const extensionHandlerResult = this.tryExtensionHandler();

    switch (node.type.name) {
      case 'extension':
      case 'bodiedExtension':
        return (
          <Extension
            node={node}
            macroProvider={macroProvider}
            handleContentDOMRef={handleContentDOMRef}
            onSelectExtension={this.handleSelectExtension}
            view={editorView}
          >
            {extensionHandlerResult}
          </Extension>
        );
      case 'inlineExtension':
        return (
          <InlineExtension node={node} macroProvider={macroProvider}>
            {extensionHandlerResult}
          </InlineExtension>
        );
      default:
        return null;
    }
  }

  private setStateFromPromise = (
    stateKey: keyof State,
    promise: Promise<any>,
  ) => {
    promise &&
      promise.then(p => {
        if (!this.mounted) {
          return;
        }

        this.setState({
          [stateKey]: p,
        });
      });
  };

  private handleProviders = async (providers: Providers) => {
    const { macroProvider, extensionProvider } = providers;

    this.setStateFromPromise('macroProvider', macroProvider);
    this.setStateFromPromise('extensionProvider', extensionProvider);
  };

  private handleSelectExtension = (hasBody: boolean) => {
    const {
      state,
      state: { selection, schema },
      dispatch,
    } = this.props.editorView;
    let { tr } = state;

    if (hasBody) {
      tr = selectParentNodeOfType([schema.nodes.bodiedExtension])(state.tr);
      dispatch(tr);
    } else if (
      !findSelectedNodeOfType([
        schema.nodes.inlineExtension,
        schema.nodes.extension,
        schema.nodes.bodiedExtension,
      ])(selection)
    ) {
      setNodeSelection(this.props.editorView, selection.$from.pos - 1);
    }
  };

  private tryExtensionHandler() {
    const { node } = this.props;
    try {
      const extensionContent = this.handleExtension(node);
      if (extensionContent && React.isValidElement(extensionContent)) {
        return extensionContent;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Provided extension handler has thrown an error\n', e);
      /** We don't want this error to block renderer */
      /** We keep rendering the default content */
    }
    return null;
  }

  private handleExtension = (node: PMNode) => {
    const { extensionHandlers, editorView } = this.props;
    const { extensionType, extensionKey, parameters, text } = node.attrs;
    const isBodiedExtension = node.type.name === 'bodiedExtension';

    if (isBodiedExtension) {
      return;
    }

    const extensionParams = {
      type: node.type.name as
        | 'extension'
        | 'inlineExtension'
        | 'bodiedExtension',
      extensionType,
      extensionKey,
      parameters,
      content: text,
    };

    if (!extensionHandlers || !extensionHandlers[extensionType]) {
      const extensionHandlerFromProvider =
        this.state.extensionProvider &&
        getNodeRenderer(
          this.state.extensionProvider,
          extensionType,
          extensionKey,
        );

      if (extensionHandlerFromProvider) {
        const NodeRenderer = extensionHandlerFromProvider;
        return <NodeRenderer extensionParams={extensionParams} />;
      }

      return;
    }

    const render = getExtensionRenderer(extensionHandlers[extensionType]);

    return render(extensionParams, editorView.state.doc);
  };
}
