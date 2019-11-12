import styled from 'styled-components';
import * as React from 'react';
import { MockActivityResource } from '@atlaskit/activity/dist/es5/support';
import Button, { ButtonGroup } from '@atlaskit/button';

import {
  cardProviderStaging,
  customInsertMenuItems,
  extensionHandlers,
  storyMediaProviderFactory,
  storyContextIdentifierProviderFactory,
  macroProvider,
  autoformattingProvider,
} from '@atlaskit/editor-test-helpers';
import { ProviderFactory } from '@atlaskit/editor-common';

import { EmojiProvider } from '@atlaskit/emoji/resource';
import {
  Provider as SmartCardProvider,
  Client as SmartCardClient,
} from '@atlaskit/smart-card';
import {
  mention,
  emoji,
  taskDecision,
  profilecard as profilecardUtils,
} from '@atlaskit/util-data-test';

import Editor, { EditorProps, EditorAppearance } from './../src/editor';
import EditorContext from './../src/ui/EditorContext';
import WithEditorActions from './../src/ui/WithEditorActions';
import quickInsertProviderFactory from '../example-helpers/quick-insert-provider';
import { DevTools } from '../example-helpers/DevTools';
import { TitleInput } from '../example-helpers/PageElements';
import { EditorActions, MentionProvider } from './../src';
import withSentry from '../example-helpers/withSentry';
import BreadcrumbsMiscActions from '../example-helpers/breadcrumbs-misc-actions';
import {
  DEFAULT_MODE,
  LOCALSTORAGE_defaultMode,
} from '../example-helpers/example-constants';
import { ExampleInlineCommentComponent } from '@atlaskit/editor-test-helpers';
import { ReactRenderer } from '@atlaskit/renderer';
import { ProfileClient, modifyResponse } from '@atlaskit/profilecard';

/**
 * +-------------------------------+
 * + [Editor core v] [Full page v] +  48px height
 * +-------------------------------+
 * +                               +  16px padding-top
 * +            Content            +
 * +                               +  16px padding-bottom
 * +-------------------------------+  ----
 *                                    80px - 48px (Outside of iframe)
 *
 */
export const Wrapper: any = styled.div`
  box-sizing: border-box;
  height: 100vh;
`;
Wrapper.displayName = 'Wrapper';

export const Content: any = styled.div`
  padding: 0;
  height: 100%;
  box-sizing: border-box;
`;
Content.displayName = 'Content';

// eslint-disable-next-line no-console
export const analyticsHandler = (actionName: string, props?: {}) =>
  console.log(actionName, props);
// eslint-disable-next-line no-console
const SAVE_ACTION = () => console.log('Save');

export const LOCALSTORAGE_defaultDocKey = 'fabric.editor.example.full-page';
export const LOCALSTORAGE_defaultTitleKey =
  'fabric.editor.example.full-page.title';

export const saveChanges = (props: {
  editorActions?: EditorActions;
  setMode?: (mode: boolean) => void;
}) => () => {
  if (!props.editorActions) {
    return;
  }

  props.editorActions.getValue().then(value => {
    // eslint-disable-next-line no-console
    console.log(value);
    localStorage.setItem(LOCALSTORAGE_defaultDocKey, JSON.stringify(value));
    if (props.setMode) {
      props.setMode(false);
    }
  });
};

export const SaveAndCancelButtons = (props: {
  editorActions?: EditorActions;
  setMode?: (mode: boolean) => void;
}) => (
  <ButtonGroup>
    <Button tabIndex={-1} appearance="primary" onClick={saveChanges(props)}>
      Publish
    </Button>

    <Button
      tabIndex={-1}
      appearance="subtle"
      onClick={() => {
        if (!props.editorActions) {
          return;
        }
        props.editorActions.clear();
        localStorage.removeItem(LOCALSTORAGE_defaultDocKey);
        localStorage.removeItem(LOCALSTORAGE_defaultTitleKey);
      }}
    >
      Close
    </Button>
  </ButtonGroup>
);

export type State = {
  disabled: boolean;
  title?: string;
  appearance: EditorAppearance;
};

export const providers: any = {
  emojiProvider: emoji.storyData.getEmojiResource({
    uploadSupported: true,
    currentUser: {
      id: emoji.storyData.loggedUser,
    },
  }) as Promise<EmojiProvider>,
  mentionProvider: Promise.resolve(mention.storyData.resourceProvider),
  taskDecisionProvider: Promise.resolve(
    taskDecision.getMockTaskDecisionResource(),
  ),
  contextIdentifierProvider: storyContextIdentifierProviderFactory(),
  activityProvider: Promise.resolve(new MockActivityResource()),
  macroProvider: Promise.resolve(macroProvider),
  autoformattingProvider: Promise.resolve(autoformattingProvider),
};

export const mediaProvider = storyMediaProviderFactory({
  includeUserAuthProvider: true,
});

export const quickInsertProvider = quickInsertProviderFactory();

export const getAppearance = (): EditorAppearance => {
  return (localStorage.getItem(LOCALSTORAGE_defaultMode) || DEFAULT_MODE) ===
    DEFAULT_MODE
    ? 'full-page'
    : 'full-width';
};

export interface ExampleProps {
  onTitleChange?: (title: string) => void;
  setMode?: (isEditing: boolean) => void;
}

export class ExampleEditorComponent extends React.Component<
  EditorProps & ExampleProps,
  State
> {
  state: State = {
    disabled: true,
    title: localStorage.getItem(LOCALSTORAGE_defaultTitleKey) || '',
    appearance: this.props.appearance || getAppearance(),
  };

  componentDidMount() {
    // eslint-disable-next-line no-console
    console.log(`To try the macro paste handler, paste one of the following links:

  www.dumbmacro.com?paramA=CFE
  www.smartmacro.com?paramB=CFE
    `);
  }

  componentDidUpdate(prevProps: EditorProps) {
    if (prevProps.appearance !== this.props.appearance) {
      this.setState(() => ({
        appearance: this.props.appearance || 'full-page',
      }));
    }
  }

  render() {
    return (
      <Wrapper>
        <Content>
          <SmartCardProvider client={new SmartCardClient('prod')}>
            <Editor
              analyticsHandler={analyticsHandler}
              allowAnalyticsGASV3={true}
              quickInsert={{ provider: Promise.resolve(quickInsertProvider) }}
              allowTextColor={true}
              allowTables={{
                advanced: true,
                allowColumnSorting: true,
              }}
              allowBreakout={true}
              allowJiraIssue={true}
              allowUnsupportedContent={true}
              allowPanel={true}
              allowExtension={{
                allowBreakout: true,
              }}
              allowRule={true}
              allowDate={true}
              allowLayouts={{
                allowBreakout: true,
                UNSAFE_addSidebarLayouts: true,
              }}
              allowTextAlignment={true}
              allowIndentation={true}
              allowDynamicTextSizing={true}
              allowTemplatePlaceholders={{ allowInserting: true }}
              UNSAFE_cards={{
                provider: Promise.resolve(cardProviderStaging),
              }}
              UNSAFE_allowExpand={true}
              annotationProvider={{
                component: ExampleInlineCommentComponent,
              }}
              allowStatus={true}
              allowNestedTasks
              {...providers}
              media={{
                provider: mediaProvider,
                allowMediaSingle: true,
                allowResizing: true,
                allowAnnotation: true,
                allowLinking: true,
                allowResizingInTables: true,
                UNSAFE_allowAltTextOnImages: true,
              }}
              allowHelpDialog
              placeholder="Use markdown shortcuts to format your page as you type, like * for lists, # for headers, and *** for a horizontal rule."
              shouldFocus={false}
              disabled={this.state.disabled}
              defaultValue={
                (localStorage &&
                  localStorage.getItem(LOCALSTORAGE_defaultDocKey)) ||
                undefined
              }
              contentComponents={
                <WithEditorActions
                  render={actions => (
                    <>
                      <BreadcrumbsMiscActions
                        appearance={this.state.appearance}
                        onFullWidthChange={this.setFullWidthMode}
                      />
                      <TitleInput
                        value={this.state.title}
                        onChange={this.handleTitleChange}
                        innerRef={this.handleTitleRef}
                        onFocus={this.handleTitleOnFocus}
                        onBlur={this.handleTitleOnBlur}
                        onKeyDown={(e: KeyboardEvent) => {
                          this.onKeyPressed(e, actions);
                        }}
                      />
                    </>
                  )}
                />
              }
              primaryToolbarComponents={[
                <WithEditorActions
                  key={1}
                  render={actions => (
                    <SaveAndCancelButtons
                      editorActions={actions}
                      setMode={this.props.setMode}
                    />
                  )}
                />,
              ]}
              onSave={SAVE_ACTION}
              insertMenuItems={customInsertMenuItems}
              extensionHandlers={extensionHandlers}
              {...this.props}
              appearance={this.state.appearance}
            />
          </SmartCardProvider>
        </Content>
      </Wrapper>
    );
  }
  private onKeyPressed = (e: KeyboardEvent, actions: EditorActions) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      // Move to the editor view
      this.setState({
        disabled: false,
      });
      actions.focus();
      return false;
    }
    return;
  };

  private handleTitleChange = (e: KeyboardEvent) => {
    const title = (e.target as HTMLInputElement).value;
    this.setState({
      title,
    });

    if (this.props.onTitleChange) {
      this.props.onTitleChange(title);
    }
  };

  private handleTitleOnFocus = () => this.setState({ disabled: true });
  private handleTitleOnBlur = () => this.setState({ disabled: false });
  private handleTitleRef = (ref?: HTMLElement) => {
    if (ref) {
      ref.focus();
    }
  };

  private setFullWidthMode = (fullWidthMode: boolean) => {
    this.setState({ appearance: fullWidthMode ? 'full-width' : 'full-page' });
  };
}

export const ExampleEditor = withSentry<EditorProps & ExampleProps>(
  ExampleEditorComponent,
);

const { getMockProfileClient: getMockProfileClientUtil } = profilecardUtils;
const MockProfileClient = getMockProfileClientUtil(
  ProfileClient,
  modifyResponse,
);

const mentionProvider = Promise.resolve({
  shouldHighlightMention(mention: { id: string }) {
    return mention.id === 'ABCDE-ABCDE-ABCDE-ABCDE';
  },
} as MentionProvider);

const emojiProvider = emoji.storyData.getEmojiResource();

const profilecardProvider = Promise.resolve({
  cloudId: 'DUMMY-CLOUDID',
  resourceClient: new MockProfileClient({
    cacheSize: 10,
    cacheMaxAge: 5000,
  }),
  getActions: (id: string) => {
    const actions = [
      {
        label: 'Mention',
        callback: () => console.log('profile-card:mention'),
      },
      {
        label: 'Message',
        callback: () => console.log('profile-card:message'),
      },
    ];

    return id === '1' ? actions : actions.slice(0, 1);
  },
});

const taskDecisionProvider = Promise.resolve(
  taskDecision.getMockTaskDecisionResource(),
);

const contextIdentifierProvider = storyContextIdentifierProviderFactory();

const providerFactory = ProviderFactory.create({
  mentionProvider,
  mediaProvider,
  emojiProvider,
  profilecardProvider,
  taskDecisionProvider,
  contextIdentifierProvider,
});

const Renderer = (props: {
  document: any;
  setMode: (mode: boolean) => void;
}) => (
  <div
    style={{
      margin: '30px 0',
    }}
  >
    <Button
      appearance="primary"
      onClick={() => props.setMode(true)}
      style={{
        position: 'absolute',
        right: '0',
        margin: '0 20px',
        zIndex: 100,
      }}
    >
      Edit
    </Button>
    <ReactRenderer
      allowHeadingAnchorLinks
      adfStage="stage0"
      dataProviders={providerFactory}
      extensionHandlers={extensionHandlers}
      document={props.document && JSON.parse(props.document)}
      appearance="full-page"
    />
  </div>
);

export default function Example(props: EditorProps & ExampleProps) {
  const [isEditingMode, setMode] = React.useState(true);
  const document =
    (localStorage && localStorage.getItem(LOCALSTORAGE_defaultDocKey)) ||
    undefined;

  return (
    <EditorContext>
      <div style={{ height: '100%' }}>
        <DevTools />
        {isEditingMode ? (
          <ExampleEditor {...props} setMode={setMode} />
        ) : (
          <Renderer document={document} setMode={setMode} />
        )}
      </div>
    </EditorContext>
  );
}
