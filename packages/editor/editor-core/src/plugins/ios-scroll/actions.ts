export enum IOSScrollActionTypes {
  SET_KEYBOARD_HEIGHT = 'SET_KEYBOARD_HEIGHT',
  SET_HEIGHT_DIFF = 'SET_HEIGHT_DIFF',
}

export interface SetKeyboardHeight {
  type: IOSScrollActionTypes.SET_KEYBOARD_HEIGHT;
  keyboardHeight: number;
}

export interface SetHeightDiff {
  type: IOSScrollActionTypes.SET_HEIGHT_DIFF;
  heightDiff: number;
}

export type IOSScrollAction = SetKeyboardHeight | SetHeightDiff;
