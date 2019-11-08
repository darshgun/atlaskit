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
import { useProviderFactory } from '@atlaskit/editor-common/provider-factory';

/**
 * Main Editor component. Use in combination with `EditorContent` and a `Preset`.
 * Internally it constructs `ProseMirror View` and mounts it to `EditorContent`.
 *
 * `EditorContent` can be wrapped to implement any layout/design requirements.
 *
 * ```js
 * <Preset>
 *   <Editor>
 *     <EditorContent/>
 *   </Editor>
 * </Preset>
 * ```
 */
function Editor(props: EditorProps) {
  const plugins = usePresetContext();
  const providerFactory = useProviderFactory();

  return (
    <IntlProvider locale="en">
      <PortalProvider
        render={portalProviderAPI => (
          <>
            <EditorInternal
              {...props}
              plugins={plugins.length ? plugins : props.plugins}
              portalProviderAPI={portalProviderAPI}
              providerFactory={providerFactory}
              onAnalyticsEvent={props.onAnalyticsEvent}
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
