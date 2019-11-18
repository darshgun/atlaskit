import emojiProvider from './emojiProvider';
import mentionProvider from './mentionProvider';
import mediaProvider from './mediaProvider';
import createTaskDecisionProvider from './taskDecisionProvider';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

export { default as mediaProvider } from './mediaProvider';
export { default as mentionProvider } from './mentionProvider';
export { default as createTaskDecisionProvider } from './taskDecisionProvider';
export { default as emojiProvider } from './emojiProvider';
export { default as MockEmojiProvider } from './mockEmojiProvider';
export {
  MobileSmartCardClient,
  EditorMobileCardProvider,
} from './cardProvider';

export const providerFactory = ProviderFactory.create({
  mentionProvider: Promise.resolve(mentionProvider),
  emojiProvider: Promise.resolve(emojiProvider),
  mediaProvider: Promise.resolve(mediaProvider),
  taskAndDecisionProvider: Promise.resolve(createTaskDecisionProvider()),
});
