import * as React from 'react';
import { PureComponent } from 'react';

import { ContentWrapper, Wrapper } from '../styled/Item';

import { Appearance, ContentRef } from '../types';
import { Placeholder } from '../styled/Placeholder';

export interface Props {
  icon: JSX.Element;
  children?: any;
  appearance?: Appearance;
  contentRef?: ContentRef;
  placeholder?: string;
  showPlaceholder?: boolean;
}

export default class Item extends PureComponent<Props, {}> {
  public static defaultProps: Partial<Props> = {
    appearance: 'inline',
  };

  private renderPlaceholder() {
    const { children, placeholder, showPlaceholder } = this.props;
    if (!showPlaceholder || !placeholder || children) {
      return null;
    }
    return <Placeholder contentEditable={false}>{placeholder}</Placeholder>;
  }

  renderMessageAppearance() {
    const { contentRef, children, icon } = this.props;
    return (
      <Wrapper>
        {icon}
        {this.renderPlaceholder()}
        <ContentWrapper innerRef={contentRef}>{children}</ContentWrapper>
      </Wrapper>
    );
  }

  render() {
    return this.renderMessageAppearance();
  }
}
