import * as React from 'react';
import { withHelp, HelpContextInterface } from './HelpContext';
import Header from './Header';

import Search from './Search';
import ArticleComponent from './Article';

import { Container, HelpBody, HelpFooter, Section } from './styled';

export interface Props {}

export const HelpContent = (props: Props & HelpContextInterface) => {
  const { help } = props;

  return (
    <>
      <Container>
        <Section>
          <Header />
          <HelpBody>
            {help.isSearchVisible() && <Search />}
            <ArticleComponent />
            {help.defaultContent}
          </HelpBody>
          {help.isFooter() ? <HelpFooter>{help.footer}</HelpFooter> : null}
        </Section>
      </Container>
    </>
  );
};

export default withHelp(HelpContent);
