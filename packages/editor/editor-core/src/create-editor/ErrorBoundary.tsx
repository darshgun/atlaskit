import * as React from 'react';
import { sendLogs } from '../utils/sendLogs';
import { ContextIdentifierProvider } from '@atlaskit/editor-common';

export type ErrorBoundaryProps = {
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
};

export type ErrorBoundaryState = {
  error?: Error;
};

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state = {
    error: undefined,
  };

  async componentDidCatch(error: Error, errorInfo: any) {
    let product = 'atlaskit';
    if (this.props.contextIdentifierProvider) {
      const context = await this.props.contextIdentifierProvider;
      if (context.product) {
        product = context.product;
      }
    }
    await sendLogs({
      events: [
        {
          name: 'atlaskit.fabric.editor.editorCrash',
          product,
          properties: {
            error: error.message,
            stack: error.stack,
            componentTrace: errorInfo,
          },
          serverTime: new Date().getTime(),
          server: 'local',
          user: '-',
        },
      ],
    });
    this.setState({
      error,
    });
  }

  render() {
    if (this.state.error) {
      throw new Error(this.state.error);
    }
    return this.props.children;
  }
}
