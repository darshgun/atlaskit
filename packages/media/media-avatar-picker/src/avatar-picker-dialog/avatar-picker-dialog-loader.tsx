import * as React from 'react';

import { ModalSpinner } from '@atlaskit/media-ui';

import { AvatarPickerDialog } from '.';
import { AvatarPickerDialogProps } from './types';

interface AsyncAvatarPickerDialogState {
  AvatarPickerDialog?: typeof AvatarPickerDialog;
}

export default class AsyncAvatarPickerDialog extends React.PureComponent<
  AvatarPickerDialogProps & AsyncAvatarPickerDialogState,
  AsyncAvatarPickerDialogState
> {
  static displayName = 'AsyncAvatarPickerDialog';
  static AvatarPickerDialog?: typeof AvatarPickerDialog;

  state = {
    // Set state value to equal to current static value of this class.
    AvatarPickerDialog: AsyncAvatarPickerDialog.AvatarPickerDialog,
  };

  componentWillMount() {
    if (!this.state.AvatarPickerDialog) {
      import(/* webpackChunkName:"@atlaskit-internal_smart-avatar-picker" */
      '.').then(module => {
        AsyncAvatarPickerDialog.AvatarPickerDialog = module.AvatarPickerDialog;
        this.setState({ AvatarPickerDialog: module.AvatarPickerDialog });
      });
    }
  }

  render() {
    if (!this.state.AvatarPickerDialog) {
      return <ModalSpinner mode="light" />;
    }

    return <this.state.AvatarPickerDialog {...this.props} />;
  }
}