ED-8005 ProviderFactory now has types for mentionProvider and emojiProvider

BREAKING CHANGE:

Before:
`ProviderFactory.mentionProvider` -> `any`
`ProviderFactory.emojiProvider` -> `any`

Now:
`ProviderFactory.mentionProvider` -> `Promise<MentionProvider> | undefined`
`ProviderFactory.emojiProvider` -> `Promise<EmojiProvider> | undefined`
