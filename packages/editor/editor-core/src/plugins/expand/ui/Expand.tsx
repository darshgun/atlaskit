import * as React from 'react';
import { defineMessages, injectIntl, InjectedIntlProps } from 'react-intl';
import { EditorView } from 'prosemirror-view';
import { Node as PmNode } from 'prosemirror-model';
import { findParentNodeOfTypeClosestToPos } from 'prosemirror-utils';
import { Expand as CommonExpand, ExpandProps } from '@atlaskit/editor-common';
import { Input, Content } from './styles';
import {
  selectExpand,
  updateExpandTitle,
  setCursorInsideExpand,
} from '../commands';

const messages = defineMessages({
  expandPlaceholderText: {
    id: 'fabric.editor.expandPlaceholder',
    defaultMessage: 'Give this expand a title...',
    description: 'Placeholder text for an expand node title input field',
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
      contentDOMRef,
    } = this.props;
    const { title } = node.attrs;

    return (
      <CommonExpand
        title={title}
        editable={true}
        nodeType={node.type.name as ExpandProps['nodeType']}
        onContainerClick={this.onSelect}
        renderContent={
          <Content onClick={this.onContentClick} innerRef={contentDOMRef} />
        }
        renderTitle={
          <Input
            type="text"
            value={title}
            placeholder={formatMessage(messages.expandPlaceholderText)}
            onClick={e => e.stopPropagation()}
            onChange={this.onTitleChange}
            onFocus={this.onTitleFocus}
          />
        }
      />
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
