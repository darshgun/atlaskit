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
    __expanded: { default: true },
  },
  parseDOM: [
    {
      context: 'nestedExpand//',
      tag: '[data-node-type="nestedExpand"]',
      skip: true,
    },
    {
      context: 'expand//',
      tag: '[data-node-type="nestedExpand"]',
      skip: true,
    },
    {
      tag: '[data-node-type="nestedExpand"] button',
      ignore: true,
    },
    {
      tag: '[data-node-type="expand"] button',
      ignore: true,
    },
    {
      tag: 'div[data-node-type="nestedExpand"]',
      getAttrs: domNode => {
        const dom = domNode as HTMLElement;
        return {
          title: dom.getAttribute('data-title'),
          __expanded: dom.getAttribute('data-expanded'),
        };
      },
    },
  ],
  toDOM(node: PMNode) {
    const attrs = {
      'data-node-type': 'nestedExpand',
      'data-title': node.attrs.title,
      'data-expanded': node.attrs.__expanded,
    };
    return ['div', attrs, 0];
  },
};
