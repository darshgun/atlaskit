import * as React from 'react';
import { sendLogs } from '../utils/sendLogs';
import { ContextIdentifierProvider } from '@atlaskit/editor-common';

export type ErrorBoundaryProps = {
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
};

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  async componentDidCatch(error: any, errorInfo: any) {
    let product = 'atlaskit';
    if (this.props.contextIdentifierProvider) {
      const context = await this.props.contextIdentifierProvider;
      if (context.product) {
        product = context.product;
      }
    }
    sendLogs({
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
    return false;
  }

  render() {
    return this.props.children;
  }
}
