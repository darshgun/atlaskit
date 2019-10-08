// @flow
import React, { Component, type Node } from 'react';
import { FormFooterWrapper } from './styled/FormFooter';

type Props = {
  /** Children to be rendered in the footer. */
  children?: Node,
  /** Footer contents should be left-aligned in single-page forms, flags, cards and section messages with the primary button on the left. */
  align?: 'start' | 'end',
};

export default class FormFooter extends Component<Props> {
  static defaultProps = {
    align: 'end',
  };

  render() {
    const { align, children } = this.props;
    return <FormFooterWrapper align={align}>{children}</FormFooterWrapper>;
  }
}
