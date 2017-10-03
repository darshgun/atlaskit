// @flow
import React, { type Node } from 'react';
import styled from 'styled-components';

const PageContainer = styled.main`
  max-width: 60rem;
  margin: 2rem auto;
  padding: 0 2rem;
`;

type PageProps = {
  children: Node,
};

export default class Page extends React.PureComponent<PageProps> {
  props: PageProps;

  render() {
    return (
      <PageContainer>
        {this.props.children}
      </PageContainer>
    );
  }
}
