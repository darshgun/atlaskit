import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { InjectedIntl, defineMessages } from 'react-intl';
import { EditorView, NodeView, Decoration } from 'prosemirror-view';
import { colors } from '@atlaskit/theme';
import Tooltip from '@atlaskit/tooltip';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import {
  Node as PmNode,
  DOMSerializer,
  DOMOutputSpec,
} from 'prosemirror-model';
import {
  expandMessages,
  ExpandIconWrapper,
  ExpandTooltipWrapper,
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

const messages = defineMessages({
  ...expandMessages,
  expandPlaceholderText: {
    id: 'fabric.editor.expandPlaceholder',
    defaultMessage: 'Give this expand a title...',
    description: 'Placeholder text for an expand node title input field',
  },
});

function buildExpandClassName(type: string, expanded: boolean) {
  return `${expandClassNames.prefix} ${expandClassNames.type(type)} ${
    expanded ? expandClassNames.expanded : ''
  }`;
}

const toDOM = (node: PmNode, intl?: InjectedIntl): DOMOutputSpec => [
  'div',
  {
    // prettier-ignore
    'class': buildExpandClassName(node.type.name, node.attrs.__expanded),
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
          placeholder:
            (intl && intl.formatMessage(messages.expandPlaceholderText)) ||
            messages.expandPlaceholderText.defaultMessage,
          type: 'text',
        },
      ],
    ],
  ],
  // prettier-ignore
  ['div', { 'class': expandClassNames.content }, 0],
];

type ReactContext = { [key: string]: any } | undefined;
type ReactContextFn = () => ReactContext;

export class ExpandNodeView implements NodeView {
  node: PmNode;
  view: EditorView;
  dom?: HTMLElement;
  contentDOM?: HTMLElement;
  icon?: HTMLElement | null;
  input?: HTMLInputElement | null;
  getPos: getPosHandlerNode;
  pos: number;
  reactContext: ReactContext;

  constructor(
    node: PmNode,
    view: EditorView,
    getPos: getPosHandlerNode,
    reactContext: ReactContextFn,
  ) {
    this.reactContext = reactContext() || {};
    const { dom, contentDOM } = DOMSerializer.renderSpec(
      document,
      toDOM(node, this.reactContext.intl),
    );
    this.getPos = getPos;
    this.pos = getPos();
    this.view = view;
    this.node = node;
    this.view = view;
    this.dom = dom as HTMLElement;
    this.contentDOM = contentDOM as HTMLElement;
    this.icon = this.dom.querySelector<HTMLElement>(
      `.${expandClassNames.icon}`,
    );
    this.input = this.dom.querySelector<HTMLInputElement>(
      `.${expandClassNames.titleInput}`,
    );
    this.renderIcon(this.reactContext.intl);
    this.initHandlers();
  }

  private initHandlers() {
    if (this.dom) {
      this.dom.addEventListener('click', this.handleClick);
      this.dom.addEventListener('input', this.handleInput);
    }
  }

  private renderIcon(intl?: InjectedIntl) {
    if (!this.icon) {
      return;
    }

    const { __expanded } = this.node.attrs;
    const message = __expanded
      ? expandMessages.collapseNode
      : expandMessages.expandNode;
    const label =
      (intl && intl.formatMessage(message)) || message.defaultMessage;
    ReactDOM.render(
      <Tooltip content={label} position="top" tag={ExpandTooltipWrapper}>
        <ExpandIconWrapper
          expanded={__expanded}
          role="button"
          className={expandClassNames.iconContainer}
        >
          <ChevronRightIcon label={label} primaryColor={colors.N80A} />
        </ExpandIconWrapper>
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
        this.renderIcon(this.reactContext && this.reactContext.intl);
      }

      // During a collab session the title doesn't sync with other users
      // since we're intentionally being less aggressive about re-rendering.
      // We also apply a rAF to avoid abrupt continuous replacement of the title.
      window.requestAnimationFrame(() => {
        if (this.input && this.node.attrs.title !== this.input.value) {
          this.input.value = this.node.attrs.title;
        }
      });

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

export default function(reactContext: ReactContextFn) {
  return (node: PmNode, view: EditorView, getPos: getPosHandler): NodeView =>
    new ExpandNodeView(node, view, getPos as getPosHandlerNode, reactContext);
}
