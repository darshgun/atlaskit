import * as React from 'react';
import styled from 'styled-components';
import WithPluginState from '../../ui/WithPluginState';
import ContentStyles from '../../ui/ContentStyles';
import { EditorProps } from '../../types';
import {
  pluginKey as maxContentSizePluginKey,
  MaxContentSizePluginState,
} from '../../plugins/max-content-size';
import WithFlash from '../../ui/WithFlash';
import { ClickAreaMobile as ClickArea } from '../../ui/Addon';
import { EditorSharedConfigConsumer, Editor, EditorContent } from './Editor';
import { ContentComponents } from './ContentComponents';

export interface MobileEditorProps {
  isMaxContentSizeReached?: boolean;
  maxHeight?: number;
}

const MobileEditor: any = styled.div`
  min-height: 30px;
  width: 100%;
  max-width: inherit;
  box-sizing: border-box;
  word-wrap: break-word;

  div > .ProseMirror {
    outline: none;
    white-space: pre-wrap;
    padding: 0;
    margin: 0;
  }
`;
MobileEditor.displayName = 'MobileEditor';
const ContentArea = styled(ContentStyles)``;
ContentArea.displayName = 'ContentArea';

export class Mobile extends React.Component<EditorProps, any> {
  static displayName = 'MobileEditor';

  private renderMobile = ({
    maxContentSize,
  }: {
    maxContentSize: MaxContentSizePluginState;
  }) => {
    const { maxHeight } = this.props;
    const maxContentSizeReached =
      maxContentSize && maxContentSize.maxContentSizeReached;

    return (
      <EditorSharedConfigConsumer>
        {config => (
          <WithFlash animate={maxContentSizeReached}>
            <MobileEditor
              isMaxContentSizeReached={maxContentSizeReached}
              maxHeight={maxHeight}
            >
              <ClickArea
                editorView={(config && config.editorView) || undefined}
              >
                <ContentArea>
                  <ContentComponents />
                  <EditorContent />
                </ContentArea>
              </ClickArea>
            </MobileEditor>
          </WithFlash>
        )}
      </EditorSharedConfigConsumer>
    );
  };

  render() {
    return (
      <Editor {...this.props}>
        <EditorSharedConfigConsumer>
          {config => (
            <WithPluginState
              editorView={(config && config.editorView) || undefined}
              eventDispatcher={(config && config.eventDispatcher) || undefined}
              plugins={{
                maxContentSize: maxContentSizePluginKey,
              }}
              render={this.renderMobile}
            />
          )}
        </EditorSharedConfigConsumer>
      </Editor>
    );
  }
}
