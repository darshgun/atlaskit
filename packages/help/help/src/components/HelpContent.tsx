import * as React from 'react';
import { withHelp, HelpContextInterface } from './HelpContext';
import Header from './Header';

import Search from './Search';
import ArticleComponent from './Article';

import {
  Container,
  HelpBody,
  HelpFooter,
  Section,
  DefaultContent,
} from './styled';

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
            <DefaultContent isArticleVisible={help.isArticleVisible()}>
              {help.defaultContent}
            </DefaultContent>
          </HelpBody>
          {help.isFooter() ? <HelpFooter>{help.footer}</HelpFooter> : null}
        </Section>
      </Container>
    </>
  );
};

export default withHelp(HelpContent);
