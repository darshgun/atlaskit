import { NodeSpec, Node as PMNode } from 'prosemirror-model';
import { ExtensionContent } from './doc';
import { BreakoutMarkDefinition } from '../marks';

/**
 * @name expand_node
 * @stage 0
 */
export interface ExpandDefinition {
  type: 'expand';
  attrs: {
    title?: string;
  };
  content: ExtensionContent;
  marks?: Array<BreakoutMarkDefinition>;
}

export const expand: NodeSpec = {
  inline: false,
  group: 'block',
  content:
    '(paragraph | panel | blockquote | orderedList | bulletList | rule | heading | codeBlock | mediaGroup | mediaSingle | decisionList | taskList | table | blockCard | extension | unsupportedBlock)+',
  defining: true,
  isolating: true,
  selectable: true,
  attrs: {
    title: { default: '' },
    __expanded: { default: true },
  },
  parseDOM: [
    {
      context: 'expand//',
      tag: '[data-node-type="expand"]',
      skip: true,
    },
    {
      context: 'nestedExpand//',
      tag: '[data-node-type="expand"]',
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
      tag: 'div[data-node-type="expand"]',
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
      'data-node-type': 'expand',
      'data-title': node.attrs.title,
      'data-expanded': node.attrs.__expanded,
    };
    return ['div', attrs, 0];
  },
};
