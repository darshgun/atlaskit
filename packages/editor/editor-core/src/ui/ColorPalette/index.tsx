import * as React from 'react';
import { PureComponent } from 'react';
import Color from './Color';

import { ColorPaletteWrapper } from './styles';
import { PaletteColor } from './Palettes/type';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { colors } from '@atlaskit/theme';
import { getContrastColor } from '@atlaskit/editor-common';

export interface Props {
  palette: PaletteColor[];
  selectedColor: string | null;
  onClick: (value: string) => void;
  cols?: number;
  className?: string;
}

class ColorPalette extends PureComponent<Props & InjectedIntlProps, any> {
  render() {
    const {
      palette,
      cols = 7,
      onClick,
      selectedColor,
      className,
      intl: { formatMessage },
    } = this.props;

    return (
      <ColorPaletteWrapper
        className={className}
        style={{ maxWidth: cols * 32 }}
      >
        {palette.map(({ value, label, border, message }) => (
          <Color
            key={value}
            value={value}
            borderColor={border}
            label={message ? formatMessage(message) : label}
            onClick={onClick}
            isSelected={value === selectedColor}
            checkMarkColor={getContrastColor(value, [colors.N0, colors.N500])}
          />
        ))}
      </ColorPaletteWrapper>
    );
  }
}

export default injectIntl(ColorPalette);
