import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { InjectedIntl, defineMessages } from 'react-intl';
import { EditorView, NodeView, Decoration } from 'prosemirror-view';
import { Selection } from 'prosemirror-state';
import { colors } from '@atlaskit/theme';
import Tooltip from '@atlaskit/tooltip';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import { keyName } from 'w3c-keyname';
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
  deleteExpand,
} from '../commands';
import { expandClassNames } from '../ui/class-names';
import { GapCursorSelection, Side } from '../../../plugins/gap-cursor';

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
  content?: HTMLElement | null;
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
    this.content = this.dom.querySelector<HTMLDivElement>(
      `.${expandClassNames.content}`,
    );

    this.renderIcon(this.reactContext.intl);
    this.initHandlers();
  }

  private initHandlers() {
    if (this.dom) {
      this.dom.addEventListener('click', this.handleClick);
      this.dom.addEventListener('input', this.handleInput);
    }
    if (this.input) {
      this.input.addEventListener('keydown', this.handleTitleKeydown);
    }
  }

  private renderIcon(intl?: InjectedIntl, node?: PmNode) {
    if (!this.icon) {
      return;
    }

    const { __expanded } = (node && node.attrs) || this.node.attrs;
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
      updateExpandTitle(
        target.value,
        this.getPos(),
        this.node.type,
      )(state, dispatch);
    }
  };

  private handleTitleKeydown = (event: KeyboardEvent) => {
    switch (keyName(event)) {
      case 'Enter':
        this.toggleExpand();
        break;
      case 'ArrowDown':
        if (this.node.attrs.__expanded) {
          this.moveCursorInsideContent(event);
        } else {
          this.moveCursorAfterExpand(event);
        }
        break;
      case 'ArrowRight':
        this.setRightGapCursor(event);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        this.setLeftGapCursor(event);
        break;
      case 'Backspace':
        this.deleteExpand(event);
        break;
    }
  };

  private deleteExpand = (event: KeyboardEvent) => {
    if (!this.input) {
      return;
    }
    const { selectionStart, selectionEnd } = this.input;
    if (selectionStart === selectionEnd && selectionStart === 0) {
      this.moveCursorInsideContent(event);
      deleteExpand()(this.view.state, this.view.dispatch);
    }
  };

  private toggleExpand = () => {
    const { state, dispatch } = this.view;
    toggleExpandExpanded(this.getPos(), this.node.type)(state, dispatch);
  };

  private moveCursorInsideContent = (event: KeyboardEvent) => {
    event.preventDefault();
    const { state, dispatch } = this.view;
    const expandPos = this.getPos();
    if (typeof expandPos !== 'number') {
      return;
    }
    const sel = Selection.findFrom(state.doc.resolve(expandPos), 1, true);
    if (sel) {
      // If the input has focus, ProseMirror doesn't
      // Give PM focus back before changing our selection
      this.view.focus();
      dispatch(state.tr.setSelection(sel));
    }
  };

  private moveCursorAfterExpand = (event: KeyboardEvent) => {
    event.preventDefault();
    const { state, dispatch } = this.view;
    const expandPos = this.getPos();
    if (typeof expandPos !== 'number') {
      return;
    }
    const sel = Selection.findFrom(
      state.doc.resolve(expandPos + this.node.nodeSize),
      1,
      true,
    );
    if (sel) {
      this.view.focus();
      dispatch(state.tr.setSelection(sel));
    }
  };

  private setRightGapCursor = (event: KeyboardEvent) => {
    if (!this.input) {
      return;
    }
    const { value, selectionStart, selectionEnd } = this.input;
    if (selectionStart === selectionEnd && selectionStart === value.length) {
      const { state, dispatch } = this.view;
      event.preventDefault();
      this.view.focus();
      dispatch(
        state.tr.setSelection(
          new GapCursorSelection(
            state.doc.resolve(this.node.nodeSize + this.getPos()),
            Side.RIGHT,
          ),
        ),
      );
    }
  };

  private setLeftGapCursor = (event: KeyboardEvent) => {
    if (!this.input) {
      return;
    }
    const { selectionStart, selectionEnd } = this.input;
    if (selectionStart === selectionEnd && selectionStart === 0) {
      event.preventDefault();
      const { state, dispatch } = this.view;
      this.view.focus();
      dispatch(
        state.tr.setSelection(
          new GapCursorSelection(state.doc.resolve(this.getPos()), Side.LEFT),
        ),
      );
    }
  };

  stopEvent(event: Event) {
    const target = event.target as HTMLElement;
    return (
      target === this.input ||
      target === this.icon ||
      !!closestElement(target, `.${expandClassNames.icon}`)
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
        this.renderIcon(this.reactContext && this.reactContext.intl, node);
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
    if (this.input) {
      this.input.removeEventListener('keydown', this.handleTitleKeydown);
    }

    if (this.icon) {
      ReactDOM.unmountComponentAtNode(this.icon);
    }

    this.dom = undefined;
    this.contentDOM = undefined;
    this.icon = undefined;
    this.input = undefined;
    this.content = undefined;
  }
}

export default function(reactContext: ReactContextFn) {
  return (node: PmNode, view: EditorView, getPos: getPosHandler): NodeView =>
    new ExpandNodeView(node, view, getPos as getPosHandlerNode, reactContext);
}
