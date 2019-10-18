import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { EditorProps } from 'prosemirror-view';
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

function Editor(props: EditorProps) {
  const plugins = usePresetContext();

  return (
    <IntlProvider locale="en">
      <PortalProvider
        render={portalProviderAPI => (
          <>
            <EditorInternal
              {...props}
              plugins={plugins}
              portalProviderAPI={portalProviderAPI}
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
  PresetProvider,
  Editor,
  EditorContent,
  EditorProps,
  EditorSharedConfigConsumer,
  EditorSharedConfig,
};
