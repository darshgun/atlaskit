import { Plugin, PluginKey, PluginSpec } from 'prosemirror-state';
import { pluginFactory } from '../../utils/plugin-state-factory';
import { Dispatch } from '../../event-dispatcher';
import { EditorPlugin } from '../../types';
import reducer from './reducer';
import { IOSScrollAction, IOSScrollActionTypes } from './actions';
import { setHeightDiff } from './commands';

/**
 * Plugin to help fix behaviour of scrolling on iOS devices - ensures the user does
 * not end up typing behind the on-screen keyboard
 *
 * The viewport height on iOS does not change if the keyboard is showing or not,
 * it is always the full height. There is a bridge method which informs us of
 * the current height taken up by the keyboard which works with this plugin to
 * set the scroll margin/threshold to match
 */

export const iOSScrollPluginKey = new PluginKey('iosScroll');

// 44 pixels squared is the minimum size for a tap target as per Apple's UX design guidelines
export const MIN_TAP_SIZE_PX = 44;

export type ScrollValue =
  | number
  | { top: number; bottom: number; left: number; right: number };

export type IOSScrollPluginState = {
  /** Current height of keyboard (+ custom toolbar) in iOS app */
  keyboardHeight: number;
  /**
   * Diff in height between document.scrollingElement and window.innerHeight
   * iOS has some weird behaviour where the value of window.innerHeight changes as the
   * user scrolls - we need to factor this into our calculations
   */
  heightDiff: number;
};

const getInitialState = (): IOSScrollPluginState => ({
  keyboardHeight: -1,
  heightDiff: -1,
});

const { createPluginState, getPluginState, createCommand } = pluginFactory<
  IOSScrollPluginState,
  IOSScrollAction,
  IOSScrollPluginState
>(iOSScrollPluginKey, reducer);

const createPlugin = (dispatch: Dispatch) =>
  new Plugin({
    state: createPluginState(dispatch, getInitialState()),
    key: iOSScrollPluginKey,
    props: {
      scrollThreshold: undefined,
      scrollMargin: undefined,
      handleScrollToSelection(editorView) {
        // document.scrollingElement not supported in IE11, but as this is a plugin for iOS
        // only, we don't care
        // eslint-disable-next-line compat/compat
        const scrollElement = document.scrollingElement;
        if (!scrollElement) {
          return false;
        }

        const { keyboardHeight, heightDiff } = getPluginState(editorView.state);
        const newHeightDiff = scrollElement.clientHeight - window.innerHeight;

        if (heightDiff !== newHeightDiff) {
          setHeightDiff(newHeightDiff)(editorView.state, editorView.dispatch);
          updateScrollValues.call(
            this as PluginSpec,
            keyboardHeight,
            newHeightDiff,
          );
        }

        return false;
      },
    },
    appendTransaction(transactions, oldState, newState) {
      const setKeyboardHeightTr = transactions.find(tr => {
        const iosScrollAction = tr.getMeta(iOSScrollPluginKey);
        return (
          iosScrollAction &&
          iosScrollAction.type === IOSScrollActionTypes.SET_KEYBOARD_HEIGHT
        );
      });
      if (setKeyboardHeightTr) {
        const { keyboardHeight } = getPluginState(oldState);
        const {
          keyboardHeight: newKeyboardHeight,
          heightDiff,
        } = getPluginState(newState);
        if (keyboardHeight !== newKeyboardHeight) {
          updateScrollValues.call(this, newKeyboardHeight, heightDiff);
        }
      }
    },
  });

/**
 * Update the scroll values on the plugin props
 * These are used by ProseMirror to determine when and how far it should scroll
 */
const updateScrollValues = function(
  this: PluginSpec,
  keyboardHeight: number,
  heightDiff: number,
) {
  if (keyboardHeight === -1 || heightDiff === -1) {
    return;
  }

  const { scrollThreshold, scrollMargin } = calculateScrollValues(
    keyboardHeight,
    heightDiff,
  );
  if (this.props) {
    this.props.scrollThreshold = scrollThreshold;
    this.props.scrollMargin = scrollMargin;
  }
};

const calculateScrollValues = (
  keyboardHeight: number,
  heightDiff: number,
): { scrollThreshold: ScrollValue; scrollMargin: ScrollValue } => ({
  scrollThreshold: {
    top: 0,
    bottom: keyboardHeight + MIN_TAP_SIZE_PX - heightDiff,
    left: 0,
    right: 0,
  },
  scrollMargin: {
    top: 5,
    bottom: keyboardHeight - heightDiff + MIN_TAP_SIZE_PX,
    left: 0,
    right: 0,
  },
});

const iOSScrollPlugin = (): EditorPlugin => ({
  name: 'iOSScroll',
  pmPlugins() {
    return [
      {
        name: 'iOSScroll',
        plugin: ({ dispatch }) => createPlugin(dispatch),
      },
    ];
  },
});

export default iOSScrollPlugin;
export { createCommand, getPluginState };
