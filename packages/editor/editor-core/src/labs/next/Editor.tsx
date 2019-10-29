import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { PortalRenderer, PortalProvider } from '../../ui/PortalProvider';
import { EditorInternal } from './internal/components/EditorInternal';
import {
  usePresetContext,
  PresetProvider,
} from './internal/context/preset-context';
import {
  EditorSharedConfig,
  EditorSharedConfigConsumer,
} from './internal/context/shared-config';
import { EditorContent } from './internal/components/EditorContent';
import { EditorProps } from './internal/editor-props-type';

function Editor(props: EditorProps) {
  const plugins = usePresetContext();

  return (
    <IntlProvider locale="en">
      <PortalProvider
        render={portalProviderAPI => (
          <>
            <EditorInternal
              {...props}
              plugins={plugins.length ? plugins : props.plugins}
              portalProviderAPI={portalProviderAPI}
              handleAnalyticsEvent={props.handleAnalyticsEvent}
            />
            <PortalRenderer portalProviderAPI={portalProviderAPI} />
          </>
        )}
      />
    </IntlProvider>
  );
}

/**
 *
 * Public API Exports.
 *
 */

export {
  // Components
  PresetProvider,
  Editor,
  EditorContent,
  EditorSharedConfigConsumer,
  // Types
  EditorProps,
  EditorSharedConfig,
};
