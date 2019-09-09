import React from 'react';
import { PopupProps } from '../src/types';
import { StyledPopup } from '../src/styled';
import { layers } from '@atlaskit/theme/constants';

//A terrible hack as extract-react-types-loader! doesn't seem to recognize functional Components
export default class PopupTypeExport extends React.Component<PopupProps> {
  static defaultProps = {
    shouldFlip: true,
    lockBodyScroll: false,
    popupComponent: StyledPopup,
    zIndex: layers.layer(),
  };
  render() {
    return <div />;
  }
}
