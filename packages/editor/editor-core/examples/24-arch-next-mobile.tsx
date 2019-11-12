import * as React from 'react';
import styled from 'styled-components';
import Button, { ButtonGroup } from '@atlaskit/button';

import { EditorActions } from '../src';
import { EditorProps } from '../src/types/editor-props';

/**
 * arch next imports
 */
import { EditorPresetMobile } from '../src/labs/next/presets/mobile';
import { Mobile as MobileEditor } from '../src/labs/next/mobile';

export const SaveAndCancelButtons = (props: {
  editorActions?: EditorActions;
}) => (
  <ButtonGroup>
    <Button
      tabIndex={-1}
      appearance="primary"
      onClick={() => {
        if (!props.editorActions) {
          return;
        }

        props.editorActions.getValue().then(value => {
          console.log(value);
        });
      }}
    >
      Publish
    </Button>
    <Button tabIndex={-1} appearance="subtle">
      Close
    </Button>
  </ButtonGroup>
);

export const Wrapper: any = styled.div`
  box-sizing: border-box;
  padding: 2px;
  height: calc(100vh - 32px);
`;
Wrapper.displayName = 'Wrapper';

export const Content: any = styled.div`
  padding: 0 20px;
  height: 100%;
  box-sizing: border-box;
`;
Content.displayName = 'Content';

export default function Example(props: EditorProps) {
  return (
    <Wrapper>
      <Content>
        <EditorPresetMobile placeholder="Use markdown shortcuts to format your page as you type, like * for lists, # for headers, and *** for a horizontal rule.">
          <MobileEditor {...props} />
        </EditorPresetMobile>
      </Content>
    </Wrapper>
  );
}
