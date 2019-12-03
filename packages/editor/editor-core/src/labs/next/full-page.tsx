import rafSchedule from 'raf-schd';
import * as React from 'react';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { BaseTheme, akEditorMenuZIndex } from '@atlaskit/editor-common';
import ContentStyles from '../../ui/ContentStyles';
import WidthEmitter from '../../ui/WidthEmitter';
import { ClickAreaBlock } from '../../ui/Addon';
import { scrollbarStyles } from '../../ui/styles';
import { tableFullPageEditorStyles } from '../../plugins/table/ui/styles';
import Avatars from '../../plugins/collab-edit/ui/avatars';
import { akEditorToolbarKeylineHeight } from '../../styles';
import { EditorProps } from '../../types';
import EditorActions from '../../actions';
import {
  Editor,
  EditorContent,
  EditorSharedConfigConsumer,
  EditorSharedConfig,
} from './Editor';
import { Toolbar } from './Toolbar';
import { ContentComponents } from './ContentComponents';
import { useCreateAnalyticsHandler } from './internal/hooks/use-analytics';

const FullPageEditorWrapper = styled.div`
  min-width: 340px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;
FullPageEditorWrapper.displayName = 'FullPageEditorWrapper';

const ScrollContainer = styled(ContentStyles)`
  flex-grow: 1;
  overflow-y: scroll;
  position: relative;
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
  ${scrollbarStyles};
`;
ScrollContainer.displayName = 'ScrollContainer';

const GUTTER_PADDING = 32;

const ContentArea = styled.div`
  line-height: 24px;
  height: 100%;
  width: 100%;
  max-width: ${({ theme }: any) => theme.layoutMaxWidth + GUTTER_PADDING * 2}px;
  padding-top: 50px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-bottom: 55px;

  & .ProseMirror {
    flex-grow: 1;
    box-sizing: border-box;
  }

  && .ProseMirror {
    & > * {
      clear: both;
    }
    > p,
    > ul,
    > ol,
    > h1,
    > h2,
    > h3,
    > h4,
    > h5,
    > h6 {
      clear: none;
    }
  }
  ${tableFullPageEditorStyles};
`;
ContentArea.displayName = 'ContentArea';

interface MainToolbarProps {
  showKeyline: boolean;
}

const MainToolbar: React.ComponentClass<React.HTMLAttributes<{}> &
  MainToolbarProps> = styled.div`
  position: relative;
  align-items: center;
  box-shadow: ${(props: MainToolbarProps) =>
    props.showKeyline
      ? `0 ${akEditorToolbarKeylineHeight}px 0 0 ${colors.N30}`
      : 'none'};
  transition: box-shadow 200ms;
  z-index: ${akEditorMenuZIndex};
  display: flex;
  height: 80px;
  flex-shrink: 0;

  & object {
    height: 0 !important;
  }
`;
MainToolbar.displayName = 'MainToolbar';

const MainToolbarCustomComponentsSlot = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
`;
MainToolbarCustomComponentsSlot.displayName = 'MainToolbar';

const SecondaryToolbar = styled.div`
  box-sizing: border-box;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
  display: flex;
  padding: 24px 0;
`;
SecondaryToolbar.displayName = 'SecondaryToolbar';

function useKeyline() {
  const [showKeyline, setShowKeyline] = React.useState<boolean>(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let current = scrollContainerRef.current;

    const handleScroll = rafSchedule(() => {
      if (!current) {
        return;
      }

      const { scrollTop } = current;
      setShowKeyline(scrollTop > akEditorToolbarKeylineHeight);
    });

    if (!current) {
      return;
    }

    window.addEventListener('resize', handleScroll);
    current.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      if (current) {
        current.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return [showKeyline, scrollContainerRef] as const;
}

export type FullPageProps = EditorProps & {
  onMount: (actions: EditorActions) => void;
} & WithAnalyticsEventsProps;

function FullPage(props: FullPageProps) {
  const {
    primaryToolbarComponents,
    contentComponents,
    allowDynamicTextSizing,
    collabEdit,
    createAnalyticsEvent,
  } = props;
  const handleAnalyticsEvent = useCreateAnalyticsHandler(createAnalyticsEvent);
  const [showKeyline, scrollContainerRef] = useKeyline();

  return (
    <Editor {...props} onAnalyticsEvent={handleAnalyticsEvent}>
      <BaseTheme dynamicTextSizing={allowDynamicTextSizing}>
        <FullPageEditorWrapper className="akEditor">
          <MainToolbar showKeyline={showKeyline}>
            <Toolbar />
            <MainToolbarCustomComponentsSlot>
              <EditorSharedConfigConsumer>
                {config =>
                  !config ? null : (
                    <Avatars
                      editorView={config.editorView}
                      eventDispatcher={config.eventDispatcher}
                      inviteToEditHandler={
                        collabEdit && collabEdit.inviteToEditHandler
                      }
                      isInviteToEditButtonSelected={
                        collabEdit && collabEdit.isInviteToEditButtonSelected
                      }
                    />
                  )
                }
              </EditorSharedConfigConsumer>
              {primaryToolbarComponents}
            </MainToolbarCustomComponentsSlot>
          </MainToolbar>
          <ScrollContainer
            innerRef={scrollContainerRef}
            className="fabric-editor-popup-scroll-parent"
          >
            <EditorSharedConfigConsumer>
              {config => (
                <ClickAreaBlock
                  editorView={(config || ({} as EditorSharedConfig)).editorView}
                >
                  <ContentArea>
                    <div
                      style={{ padding: `0 ${GUTTER_PADDING}px` }}
                      className="ak-editor-content-area"
                    >
                      {contentComponents}
                      <EditorContent />
                      <ContentComponents />
                    </div>
                  </ContentArea>
                </ClickAreaBlock>
              )}
            </EditorSharedConfigConsumer>
          </ScrollContainer>
          <EditorSharedConfigConsumer>
            {config => (
              <WidthEmitter
                editorView={(config || ({} as EditorSharedConfig)).editorView!}
                contentArea={scrollContainerRef.current}
              />
            )}
          </EditorSharedConfigConsumer>
        </FullPageEditorWrapper>
      </BaseTheme>
    </Editor>
  );
}

FullPage.displayName = 'FullPageEditor';

const FullPageWithAnalytics = withAnalyticsEvents()(FullPage);

export { FullPageWithAnalytics as FullPage };
