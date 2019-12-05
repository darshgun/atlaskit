import { IOSScrollPluginState } from './index';
import { IOSScrollAction, IOSScrollActionTypes } from './actions';

export default function(
  state: IOSScrollPluginState,
  action: IOSScrollAction,
): IOSScrollPluginState {
  switch (action.type) {
    case IOSScrollActionTypes.SET_KEYBOARD_HEIGHT:
      return {
        ...state,
        keyboardHeight: action.keyboardHeight,
      };

    case IOSScrollActionTypes.SET_HEIGHT_DIFF:
      return {
        ...state,
        heightDiff: action.heightDiff,
      };
  }
  return state;
}
