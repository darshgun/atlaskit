export default {
  type: 'extension',
  attrs: {
    extensionType: 'com.atlassian.confluence.macro.core',
    extensionKey: 'jql-table',
    text: 'JQL table block extension demo',
    parameters: {
      macroParams: {},
      macroMetadata: {
        placeholder: [
          {
            data: { url: '' },
            type: 'icon',
          },
        ],
      },
    },
  },
};
