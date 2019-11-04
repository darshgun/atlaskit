import { createCommand } from '.';
import { IOSScrollActionTypes } from './actions';

export const setKeyboardHeight = (keyboardHeight: number) =>
  createCommand({
    type: IOSScrollActionTypes.SET_KEYBOARD_HEIGHT,
    keyboardHeight,
  });

export const setHeightDiff = (heightDiff: number) =>
  createCommand({
    type: IOSScrollActionTypes.SET_HEIGHT_DIFF,
    heightDiff,
  });
