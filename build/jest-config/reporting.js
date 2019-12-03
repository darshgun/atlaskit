// @flow
const sendLogs = require('@atlaskit/analytics-reporting');

module.exports = {
  reportLongRunningTests(tests /*: string[] */, threshold /*: number*/) {
    return sendLogs(
      // $FlowFixMe - type issue
      JSON.stringify({
        events: tests.map(result => {
          return {
            name: 'atlaskit.qa.unit_test.testtimes',
            server: process.env.CI ? 'master' : 'test',
            product: 'atlaskit',
            properties: {
              // $FlowFixMe - type issue
              timeTaken: result.timeTaken,
              // $FlowFixMe - type issue
              testFilePath: result.testFilePath,
              threshold,
            },
            user: process.env.CI ? '-' : process.env.USER, // On CI we send as an anonymous user
            serverTime: Date.now(),
          };
        }),
      }),
    ).then(() => {
      console.log(
        `Sent ${tests.length} long running tests event${
          tests.length > 1 ? 's' : ''
        }`,
      );
    });
  },
};
