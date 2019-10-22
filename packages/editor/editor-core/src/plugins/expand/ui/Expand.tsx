import * as React from 'react';
import { defineMessages, injectIntl, InjectedIntlProps } from 'react-intl';
import { EditorView } from 'prosemirror-view';
import { Node as PmNode } from 'prosemirror-model';
import { findParentNodeOfTypeClosestToPos } from 'prosemirror-utils';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import Tooltip from '@atlaskit/tooltip';
import {
  Container,
  Input,
  Icon,
  Content,
  TitleButton,
  TitleContainer,
} from './styles';
import {
  selectExpand,
  updateExpandTitle,
  setCursorInsideExpand,
} from '../commands';

export const messages = defineMessages({
  expandNode: {
    id: 'fabric.editor.expand',
    defaultMessage: 'Expand',
    description: 'Expand the node',
  },
  collapseNode: {
    id: 'fabric.editor.collapse',
    defaultMessage: 'Collapse',
    description: 'Collapse the node',
  },
  expandPlaceholderText: {
    id: 'fabric.editor.expandPlaceholder',
    defaultMessage: 'Give this expand a title...',
    description: 'A placeholder text for expand node title input field',
  },
});

interface Props {
  node: PmNode;
  view: EditorView;
  contentDOMRef: (node: HTMLElement | null) => void;
  pos: number;
}

interface State {
  collapsed: boolean;
}

class Expand extends React.PureComponent<Props & InjectedIntlProps, State> {
  state = {
    collapsed: false,
  };

  render() {
    const {
      node,
      intl: { formatMessage },
    } = this.props;
    const { title } = node.attrs;
    const { collapsed } = this.state;
    const label = this.props.node.type.name;
    const tooltipMessage = formatMessage(
      collapsed ? messages.expandNode : messages.collapseNode,
    );

    return (
      <Container onClick={this.onSelect} collapsed={collapsed}>
        <TitleContainer onClick={this.onContentClick}>
          <TitleButton onClick={this.onCollapse} aria-label={tooltipMessage}>
            <Tooltip content={tooltipMessage} position="top">
              <Icon collapsed={collapsed} data-expand-buton>
                <ChevronRightIcon label={label} />
              </Icon>
            </Tooltip>
          </TitleButton>
          <Input
            type="text"
            value={title}
            placeholder={formatMessage(messages.expandPlaceholderText)}
            onChange={this.onTitleChange}
            onFocus={this.onTitleFocus}
          />
        </TitleContainer>
        {collapsed ? null : (
          <Content
            onClick={this.onContentClick}
            innerRef={ref => {
              this.props.contentDOMRef(ref);
            }}
          />
        )}
      </Container>
    );
  }

  private onContentClick = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  private onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { state, dispatch } = this.props.view;
    const pos = this.getPosFromInput(event.target);
    updateExpandTitle(event.target.value, pos, this.props.node.type)(
      state,
      dispatch,
    );
  };

  private onTitleFocus = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { view } = this.props;
    const { tr } = view.state;
    const pos = this.getPosFromInput(event.target);
    view.dispatch(setCursorInsideExpand(pos, tr, 1));
  };

  private onCollapse = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  private onSelect = () => {
    const { state, dispatch } = this.props.view;
    selectExpand(this.props.pos)(state, dispatch);
  };

  private getPosFromInput = (target: HTMLElement): number => {
    const { schema, doc } = this.props.view.state;
    const pos = this.props.view.posAtDOM(target, 0);
    const node = findParentNodeOfTypeClosestToPos(doc.resolve(pos), [
      schema.nodes.nestedExpand,
      schema.nodes.expand,
    ]);
    return node ? node.pos : this.props.pos;
  };
}

export default injectIntl(Expand);
