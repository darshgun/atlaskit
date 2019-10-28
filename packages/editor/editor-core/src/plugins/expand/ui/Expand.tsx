import * as React from 'react';
import styled from 'styled-components';
import { EditorView } from 'prosemirror-view';
import { Node as PmNode } from 'prosemirror-model';
import { Expand as CommonExpand, ExpandProps } from '@atlaskit/editor-common';
import { selectExpand } from '../commands';

export const Content = styled.div`
  cursor: text;
`;

interface Props {
  node: PmNode;
  view: EditorView;
  contentDOMRef: (node: HTMLElement | null) => void;
  pos: number;
}

interface State {
  collapsed: boolean;
}

class Expand extends React.PureComponent<Props, State> {
  state = {
    collapsed: false,
  };

  render() {
    const { node, contentDOMRef } = this.props;
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
        renderTitle={null}
      />
    );
  }

  private onContentClick = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  private onSelect = () => {
    const { state, dispatch } = this.props.view;
    selectExpand(this.props.pos)(state, dispatch);
  };
}

export default Expand;
