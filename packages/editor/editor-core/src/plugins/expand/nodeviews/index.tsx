import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'styled-components';
import { InjectedIntl } from 'react-intl';
import { EditorView, NodeView, Decoration } from 'prosemirror-view';
import { colors, gridSize } from '@atlaskit/theme';
import Tooltip from '@atlaskit/tooltip';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import {
  Node as PmNode,
  DOMSerializer,
  DOMOutputSpec,
} from 'prosemirror-model';
import {
  expandMessages,
  akEditorSwoopCubicBezier,
} from '@atlaskit/editor-common';

import {
  getPosHandlerNode,
  getPosHandler,
} from '../../../nodeviews/ReactNodeView';
import { closestElement } from '../../../utils';
import {
  updateExpandTitle,
  toggleExpandExpanded,
  selectExpand,
} from '../commands';
import { expandClassNames } from '../ui/class-names';

const Icon = styled.div<{ expanded: boolean }>`
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
    ${props => (props.expanded ? 'transform: rotate(90deg);' : '')}
    transition: 0.2s ${akEditorSwoopCubicBezier};
  }
`;

const TooltipWrapper = styled.div`
  width: 24px;
  height: 24px;
`;

const toDOM = (node: PmNode, intl: InjectedIntl): DOMOutputSpec => [
  'div',
  {
    // prettier-ignore
    'class': `${expandClassNames.prefix} ${expandClassNames.type(node.type.name)} ${node.attrs.__expanded ? expandClassNames.expanded : ''}`,
    'data-node-type': node.type.name,
    'data-title': node.attrs.title,
  },
  [
    'div',
    // prettier-ignore
    { 'class': expandClassNames.titleContainer, 'contenteditable': 'false' },
    // prettier-ignore
    ['div', { 'class': expandClassNames.icon }],
    [
      'div',
      {
        // prettier-ignore
        'class': expandClassNames.inputContainer
      },
      [
        'input',
        {
          // prettier-ignore
          'class': expandClassNames.titleInput,
          value: node.attrs.title,
          placeholder: intl.formatMessage(expandMessages.expandPlaceholderText),
          type: 'text',
        },
      ],
    ],
  ],
  // prettier-ignore
  ['div', { 'class': expandClassNames.content }, 0],
];

type ReactContext = () => { [key: string]: any };

export class ExpandNodeView implements NodeView {
  node: PmNode;
  view: EditorView;
  dom?: HTMLElement;
  contentDOM?: HTMLElement;
  icon?: HTMLElement;
  input?: HTMLElement;
  getPos: getPosHandlerNode;
  pos: number;

  constructor(
    node: PmNode,
    view: EditorView,
    getPos: getPosHandlerNode,
    reactContext: ReactContext,
  ) {
    const { intl } = reactContext();
    const { dom, contentDOM } = DOMSerializer.renderSpec(
      document,
      toDOM(node, intl),
    );
    this.getPos = getPos;
    this.pos = getPos();
    this.view = view;
    this.node = node;
    this.view = view;
    this.dom = dom as HTMLElement;
    this.contentDOM = contentDOM as HTMLElement;
    this.icon = this.dom.querySelector(
      `.${expandClassNames.icon}`,
    ) as HTMLElement;
    this.input = this.dom.querySelector(
      `.${expandClassNames.titleInput}`,
    ) as HTMLElement;
    this.renderIcon(intl);
    this.initHandlers();
  }

  private initHandlers() {
    if (this.dom) {
      this.dom.addEventListener('click', this.handleClick);
      this.dom.addEventListener('input', this.handleInput);
    }
  }

  private renderIcon(intl: InjectedIntl) {
    if (!this.icon) {
      return;
    }

    const { __expanded } = this.node.attrs;
    const label = intl.formatMessage(
      __expanded ? expandMessages.collapseNode : expandMessages.expandNode,
    );
    ReactDOM.render(
      <Tooltip content={label} position="top" tag={TooltipWrapper}>
        <Icon
          expanded={__expanded}
          role="button"
          className={expandClassNames.iconContainer}
        >
          <ChevronRightIcon label={label} primaryColor={colors.N80A} />
        </Icon>
      </Tooltip>,
      this.icon,
    );
  }

  private handleClick = (event: Event) => {
    const target = event.target as HTMLElement;
    if (closestElement(target, `.${expandClassNames.icon}`)) {
      event.stopPropagation();
      const { state, dispatch } = this.view;
      toggleExpandExpanded(this.getPos(), this.node.type)(state, dispatch);
      return;
    }

    if (target === this.dom) {
      event.stopPropagation();
      const { state, dispatch } = this.view;
      selectExpand(this.getPos())(state, dispatch);
      return;
    }
  };

  private handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target === this.input) {
      event.stopPropagation();
      const { state, dispatch } = this.view;
      updateExpandTitle(target.value, this.getPos(), this.node.type)(
        state,
        dispatch,
      );
    }
  };

  stopEvent(event: Event) {
    const target = event.target as HTMLElement;
    return (
      target === this.input ||
      target === this.icon ||
      target.nodeName === 'SPAN'
    );
  }

  ignoreMutation() {
    return true;
  }

  update(node: PmNode, _decorations: Array<Decoration>) {
    if (this.node.type === node.type) {
      if (this.node.attrs.__expanded !== node.attrs.__expanded && this.dom) {
        // Instead of re-rendering the view on an expand toggle
        // we toggle a class name to hide the content and animate the chevron.
        this.dom.classList.toggle(expandClassNames.expanded);
      }
      this.node = node;
      return true;
    }
    return false;
  }

  destroy() {
    if (this.dom) {
      this.dom.removeEventListener('click', this.handleClick);
      this.dom.removeEventListener('input', this.handleInput);
    }

    if (this.icon) {
      ReactDOM.unmountComponentAtNode(this.icon);
    }

    this.dom = undefined;
    this.contentDOM = undefined;
    this.icon = undefined;
    this.input = undefined;
  }
}

export default function(reactContext: ReactContext) {
  return (node: PmNode, view: EditorView, getPos: getPosHandler): NodeView =>
    new ExpandNodeView(node, view, getPos as getPosHandlerNode, reactContext);
}
