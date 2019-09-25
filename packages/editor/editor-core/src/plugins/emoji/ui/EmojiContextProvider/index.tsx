import * as React from 'react';
import * as PropTypes from 'prop-types';

export class EmojiContextProvider extends React.Component<any, any> {
  static childContextTypes = {
    emoji: PropTypes.object,
  };

  getChildContext() {
    return {
      emoji: {
        emojiProvider: this.props.emojiProvider,
      },
    };
  }

  render() {
    return this.props.children;
  }
}
