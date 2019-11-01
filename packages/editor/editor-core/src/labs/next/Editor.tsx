import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { WithCreateAnalyticsEvent } from '@atlaskit/editor-common';
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
            <WithCreateAnalyticsEvent
              render={createAnalyticsEvent => (
                <EditorInternal
                  {...props}
                  plugins={plugins.length ? plugins : props.plugins}
                  portalProviderAPI={portalProviderAPI}
                  createAnalyticsEvent={createAnalyticsEvent}
                />
              )}
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
