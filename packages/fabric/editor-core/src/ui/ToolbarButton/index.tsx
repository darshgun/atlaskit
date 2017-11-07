import Tooltip from '@atlaskit/tooltip';
import * as React from 'react';
import { PureComponent, ReactElement } from 'react';
import { AkButton } from './styles';

export interface Props {
  className?: string;
  disabled?: boolean;
  hideTooltip?: boolean;
  href?: string;
  iconAfter?: ReactElement<any>;
  iconBefore?: ReactElement<any>;
  onClick?: () => void;
  selected?: boolean;
  spacing?: 'default' | 'compact' | 'none';
  target?: string;
  theme?: 'dark';
  title?: string;
  titlePosition?: string;
}

export default class ToolbarButton extends PureComponent<Props, {}> {
  static defaultProps = {
    className: '',
  };

  render() {
    const button = (
      <AkButton
        appearance="subtle"
        ariaHaspopup={true}
        className={this.props.className}
        href={this.props.href}
        iconAfter={this.props.iconAfter}
        iconBefore={this.props.iconBefore}
        isDisabled={this.props.disabled}
        isSelected={this.props.selected}
        onClick={this.handleClick}
        spacing={this.props.spacing || 'none'}
        target={this.props.target}
        theme={this.props.theme}
      >
        {this.props.children}
      </AkButton>
    );

    const placement = this.props.titlePosition || 'top';
    const showTooltip = this.props.title && !this.props.hideTooltip;

    return showTooltip ? (
      <Tooltip
        content={this.props.title}
        hideTooltipOnClick
        placement={placement}
      >
        {button}
      </Tooltip>
    ) : button;
  }

  private handleClick = () => {
    const { disabled, onClick } = this.props;

    if (!disabled && onClick) onClick();
  }
}
