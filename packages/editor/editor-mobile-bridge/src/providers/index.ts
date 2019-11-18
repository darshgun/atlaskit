import EmojiProvider from './emojiProvider';
import MentionProvider from './mentionProvider';
import MediaProvider from './mediaProvider';
import TaskDecisionProvider from './taskDecisionProvider';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

export { default as MediaProvider } from './mediaProvider';
export { default as MentionProvider } from './mentionProvider';
export { default as TaskDecisionProvider } from './taskDecisionProvider';
export { default as EmojiProvider } from './emojiProvider';
export { default as MockEmojiProvider } from './mockEmojiProvider';
export {
  MobileSmartCardClient,
  EditorMobileCardProvider,
} from './cardProvider';

export const providerFactory = ProviderFactory.create({
  mentionProvider: Promise.resolve(MentionProvider),
  emojiProvider: Promise.resolve(EmojiProvider),
  mediaProvider: Promise.resolve(MediaProvider),
  taskAndDecisionProvider: Promise.resolve(TaskDecisionProvider()),
});
