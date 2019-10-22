import React from 'react';
import { InjectedIntl } from 'react-intl';
import { EditorView } from 'prosemirror-view';
import {
  FloatingToolbarButton,
  FloatingToolbarCustom,
  FloatingToolbarConfig,
} from '../../floating-toolbar/types';
import { Command } from '../../../types';
import { openMediaAltTextMenu } from '../pm-plugins/alt-text/commands';
import * as keymaps from '../../../keymaps';
import { MediaToolbarBaseConfig } from '../types';
import { messages } from '../pm-plugins/alt-text/messages';
import AltTextEdit from '../pm-plugins/alt-text/ui/AltTextEdit';
import { CONTAINER_WIDTH_IN_PX } from '../pm-plugins/alt-text/ui/AltTextEdit';

export const altTextButton = (
  intl: InjectedIntl,
): FloatingToolbarButton<Command> => {
  return {
    title: 'Alt text',
    type: 'button',
    onClick: openMediaAltTextMenu,
    showTitle: true,
    tooltipContent: keymaps.renderTooltipContent(
      intl.formatMessage(messages.altText),
      keymaps.addAltText,
    ),
  };
};

export const altTextEditComponent = (): FloatingToolbarCustom => {
  return {
    type: 'custom',
    render: (view?: EditorView, idx?: number) => {
      if (!view) {
        return null;
      }

      return <AltTextEdit view={view} key={idx} />;
    },
  };
};

export const getAltTextToolbar = (
  toolbarBaseConfig: MediaToolbarBaseConfig,
): FloatingToolbarConfig => {
  return {
    ...toolbarBaseConfig,
    width: CONTAINER_WIDTH_IN_PX,
    items: [altTextEditComponent()],
  };
};
