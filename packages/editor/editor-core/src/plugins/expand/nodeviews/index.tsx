import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { EditorView, NodeView } from 'prosemirror-view';
import {
  Node as PmNode,
  DOMSerializer,
  DOMOutputSpec,
} from 'prosemirror-model';

import {
  expandMessages,
  akEditorSwoopCubicBezier,
} from '@atlaskit/editor-common';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { getPosHandler } from '../../../nodeviews/ReactNodeView';
import { updateExpandTitle, toggleExpandExpanded } from '../commands';
import styled from 'styled-components';
import { colors, gridSize } from '@atlaskit/theme';
import Tooltip from '@atlaskit/tooltip';

// interface Props {
//   node: PmNode;
//   portalProviderAPI: PortalProviderAPI;
//   view: EditorView;
//   getPos: () => number;
//   intl: InjectedIntl;
// }

const Icon = styled.div`
  cursor: pointer;
  display: flex;
  color: ${colors.N90};
  border-radius: ${gridSize() / 2}px;
  width: 24px;
  height: 24px;

  &:hover {
    background: ${colors.N30A};
  }

  svg {
    ${({ collapsed }: any) => !collapsed && `transform: rotate(90deg);`}
    transition: 0.2s ${akEditorSwoopCubicBezier};
  }
`;

const TooltipWrapper = styled.div`
  width: 24px;
  height: 24px;
`;

const toDOM = (node: PmNode) =>
  [
    'div',
    {
      // prettier-ignore
      'class': `ak-editor-expand ${node.attrs.__expanded ? 'ak-editor-expand__expanded' : undefined}`
    },
    [
      'div',
      // prettier-ignore
      { 'class': 'ak-editor-expand__title-container', 'contenteditable': 'false' },
      // prettier-ignore
      ['span', { 'class': 'ak-editor-expand__icon' }],
      [
        'div',
        {
          // prettier-ignore
          'class': `ak-editor-expand__title-input-wrapper`
        },
        [
          'input',
          {
            // prettier-ignore
            'class': 'ak-editor-expand__title-input',
            value: node.attrs.title,
            type: 'text',
          },
        ],
      ],
    ],
    // prettier-ignore
    ['div', { 'class': 'ak-editor-expand__content' }, 0],
  ] as DOMOutputSpec;

export class PmExpandNodeView implements NodeView {
  node: PmNode;
  dom: HTMLElement;
  contentDOM: HTMLElement;
  icon: HTMLElement;
  input: HTMLElement;
  getPos: getPosHandler;

  constructor(node: PmNode, getPos: getPosHandler, reactContext?: any) {
    const { dom, contentDOM } = DOMSerializer.renderSpec(document, toDOM(node));
    this.getPos = getPos;
    this.node = node;
    this.dom = dom as HTMLElement;
    this.contentDOM = contentDOM as HTMLElement;
    this.icon = this.dom.querySelector(
      '.ak-editor-expand__icon',
    ) as HTMLElement;
    this.input = this.dom.querySelector(
      '.ak-editor-expand__title-input',
    ) as HTMLElement;
    this.renderIcon(reactContext);
    this.initHandlers();
  }

  private initHandlers() {
    this.dom.addEventListener('click', this.handleClick);
    this.dom.addEventListener('input', this.handleInput);
  }

  private renderIcon(reactContext: any) {
    const { intl } = reactContext();
    const label = intl.formatMessage(
      false ? expandMessages.expandNode : expandMessages.collapseNode,
    );
    ReactDOM.render(
      <Tooltip content={label} position="top" tag={TooltipWrapper}>
        <Icon collapsed={false} role="button">
          <ChevronRightIcon label={label} />
        </Icon>
      </Tooltip>,
      this.icon,
    );
  }

  private handleClick(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    // todo
    const target = event.target as HTMLElement;
    if (target === this.icon) {
      console.log('toggle');
      toggleExpandExpanded(this.getPos(), this.node.type);
    }
  }
  private handleInput(event: Event) {
    event.stopPropagation();
    // todo
    const target = event.target as HTMLInputElement;
    if (target === this.input) {
      updateExpandTitle(target.value, this.getPos(), this.node.type);
    }
  }

  stopEvent(event: Event) {
    const target = event.target as HTMLElement;
    // console.log(target);
    return (
      target === this.input ||
      target === this.icon ||
      target.nodeName === 'SPAN'
    );
  }

  destroy() {
    if (this.dom) {
      this.dom.removeEventListener('click', this.handleClick);
      this.dom.removeEventListener('input', this.handleInput);
    }
  }
}

export default function ExpandNodeView(
  portalProviderAPI: PortalProviderAPI,
  reactContext?: any,
) {
  return (node: PmNode, view: EditorView, getPos: () => number): NodeView =>
    new PmExpandNodeView(node, getPos, reactContext);
}

// class ExpandNode extends ReactNodeView<Props> {
//   input: HTMLInputElement | null = null;
//   intl: any | undefined;

//   constructor(props: Props) {
//     super(props.node, props.view, props.getPos, props.portalProviderAPI);

//     this.intl = props.intl;
//     this._onInputChange = this._onInputChange.bind(this);
//   }

//   getContentDOM() {
//     const dom = document.createElement('div');
//     dom.className = `${this.node.type.name}-content-dom-wrapper`;

//     const contentDOM = document.createElement('div');
//     contentDOM.className = `${this.node.type.name}-content-wrapper`;
//     const inputContainer = document.createElement('div');

//     const { intl } = this.intl();
//     console.log(intl);
//     const placeholder =
//       intl && intl.formatMessage(expandMessages.expandPlaceholderText);
//     this.input = getTitleInputElement(this.node, placeholder || '');
//     this.input.addEventListener('input', this._onInputChange);

//     inputContainer.contentEditable = 'false';
//     inputContainer.className = `${this.node.type.name}-title-input-wrapper`;
//     inputContainer.appendChild(this.input);

//     dom.appendChild(inputContainer);
//     dom.appendChild(contentDOM);
//     return { dom, contentDOM };
//   }

//   setDomAttrs(node: PmNode) {
//     const { dom } = this;
//     if (dom) {
//       Object.keys(node.attrs).forEach(attr => {
//         dom.setAttribute(`data-${attr}`, node.attrs[attr]);
//       });
//       dom.setAttribute('data-node-type', node.type.name);
//     }
//   }

//   render({}, forwardRef: ForwardRef) {
//     return (
//       <Expand
//         node={this.node}
//         view={this.view}
//         pos={this.getPos()}
//         contentDOMRef={forwardRef}
//       />
//     );
//   }

//   stopEvent(event: Event) {
//     const target = event.target as HTMLElement;
//     console.log(target);
//     return target === this.input || target.tagName === 'SPAN';
//   }

//   ignoreMutation(mutation: MutationRecord) {
//     return true;
//   }

//   destroy() {
//     if (this.input) {
//       this.input.removeEventListener('input', this._onInputChange);
//     }
//     super.destroy();
//   }

//   private _onInputChange(event: Event) {
//     const { getPos, node, view } = this;
//     const target = event.target as HTMLInputElement;
//     updateExpandTitle(target.value, getPos(), node.type)(
//       view.state,
//       view.dispatch,
//     );
//   }
// }
