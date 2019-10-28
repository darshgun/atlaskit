import * as React from 'react';
import { EditorView, NodeView } from 'prosemirror-view';
import { Node as PmNode } from 'prosemirror-model';
import { InjectedIntl } from 'react-intl';
import { expandMessages } from '@atlaskit/editor-common';
import { ReactNodeView } from '../../../nodeviews';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { ForwardRef } from '../../../nodeviews/ReactNodeView';
import Expand from '../ui/Expand';
import { updateExpandTitle } from '../commands';

interface Props {
  node: PmNode;
  portalProviderAPI: PortalProviderAPI;
  view: EditorView;
  getPos: () => number;
  intl: InjectedIntl;
}

function getTitleInputElement(node: PmNode, placeholder: string) {
  const input = document.createElement('input');
  input.className = `${node.type.name}-title-input`;
  input.type = 'text';
  input.value = node.attrs.title;
  input.placeholder = placeholder;

  return input;
}

class ExpandNode extends ReactNodeView<Props> {
  input: HTMLInputElement | null = null;
  intl: any | undefined;

  constructor(props: Props) {
    super(props.node, props.view, props.getPos, props.portalProviderAPI);

    this.intl = props.intl;
    this._onInputChange = this._onInputChange.bind(this);
  }

  getContentDOM() {
    const dom = document.createElement('div');
    dom.className = `${this.node.type.name}-content-dom-wrapper`;

    const contentDOM = document.createElement('div');
    const inputContainer = document.createElement('div');

    const { intl } = this.intl();
    console.log(intl);
    const placeholder =
      intl && intl.formatMessage(expandMessages.expandPlaceholderText);
    this.input = getTitleInputElement(this.node, placeholder || '');
    this.input.addEventListener('input', this._onInputChange);

    inputContainer.contentEditable = 'false';
    inputContainer.className = `${this.node.type.name}-title-input-wrapper`;
    inputContainer.appendChild(this.input);

    dom.appendChild(inputContainer);
    dom.appendChild(contentDOM);
    return { dom, contentDOM };
  }

  setDomAttrs(node: PmNode) {
    const { dom } = this;
    if (dom) {
      Object.keys(node.attrs).forEach(attr => {
        dom.setAttribute(`data-${attr}`, node.attrs[attr]);
      });
      dom.setAttribute('data-node-type', node.type.name);
    }
  }

  render({}, forwardRef: ForwardRef) {
    return (
      <Expand
        node={this.node}
        view={this.view}
        pos={this.getPos()}
        contentDOMRef={forwardRef}
      />
    );
  }

  stopEvent(event: Event) {
    const target = event.target as HTMLElement;
    return target === this.input;
  }

  ignoreMutation(mutation: MutationRecord) {
    console.log({ mutation });
    return (
      (mutation.target.nodeName === 'INPUT' &&
        mutation.target === this.input) ||
      (mutation.type === 'attributes' &&
        mutation.attributeName === 'data-title')
    );
  }

  destroy() {
    if (this.input) {
      this.input.removeEventListener('input', this._onInputChange);
    }
    super.destroy();
  }

  private _onInputChange(event: Event) {
    const { getPos, node, view } = this;
    const target = event.target as HTMLInputElement;
    updateExpandTitle(target.value, getPos(), node.type)(
      view.state,
      view.dispatch,
    );
  }
}

export default function ExpandNodeView(
  portalProviderAPI: PortalProviderAPI,
  intl?: any,
) {
  return (node: PmNode, view: EditorView, getPos: () => number): NodeView =>
    new ExpandNode({
      node,
      view,
      portalProviderAPI,
      getPos,
      intl,
    }).init();
}
