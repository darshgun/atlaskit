import * as React from 'react';
import { EditorView, NodeView } from 'prosemirror-view';
import { Node as PmNode } from 'prosemirror-model';
import { ReactNodeView } from '../../../nodeviews';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { ForwardRef } from '../../../nodeviews/ReactNodeView';
import Expand from '../ui/Expand';

interface Props {
  node: PmNode;
  portalProviderAPI: PortalProviderAPI;
  view: EditorView;
  getPos: () => number;
}

class ExpandNode extends ReactNodeView<Props> {
  constructor(props: Props) {
    super(props.node, props.view, props.getPos, props.portalProviderAPI);
  }

  getContentDOM() {
    const dom = document.createElement('div');
    dom.className = `${this.node.type.name}-content-dom-wrapper`;
    return { dom };
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
    return !!(
      this.dom &&
      this.dom.contains(target) &&
      target.nodeName === 'INPUT' &&
      !(event instanceof ClipboardEvent)
    );
  }

  ignoreMutation(mutation: MutationRecord) {
    return true;
  }
}

export default function ExpandNodeView(portalProviderAPI: PortalProviderAPI) {
  return (node: PmNode, view: EditorView, getPos: () => number): NodeView =>
    new ExpandNode({
      node,
      view,
      portalProviderAPI,
      getPos,
    }).init();
}
