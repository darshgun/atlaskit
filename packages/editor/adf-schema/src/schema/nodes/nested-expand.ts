import { NodeSpec, Node as PMNode } from 'prosemirror-model';
import { NestedExpandContent } from './doc';

/**
 * @name nestedExpand_node
 * @stage 0
 */
export interface NestedExpandDefinition {
  type: 'nestedExpand';
  attrs: {
    title?: string;
  };
  content: NestedExpandContent;
}

export const nestedExpand: NodeSpec = {
  inline: false,
  group: 'block',
  content:
    '(paragraph | heading | mediaSingle | mediaGroup | unsupportedBlock)+',
  defining: true,
  isolating: true,
  selectable: true,
  attrs: {
    title: { default: '' },
  },
  parseDOM: [
    {
      context: 'nestedExpand//',
      tag: '[data-node-type="nestedExpand"]',
      skip: true,
    },
    {
      tag: 'div[data-node-type="nestedExpand"]',
      getAttrs: domNode => {
        const dom = domNode as HTMLElement;
        return {
          title: dom.getAttribute('data-title'),
        };
      },
    },
  ],
  toDOM(node: PMNode) {
    const attrs = {
      'data-node-type': 'nestedExpand',
      'data-title': node.attrs.title,
    };
    return ['div', attrs, 0];
  },
};
