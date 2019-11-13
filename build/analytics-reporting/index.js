// @flow
const fetch = require('node-fetch');

// eslint-disable-next-line func-names
module.exports = function(body /*: Object */) {
  return fetch('https://analytics.atlassian.com/analytics/events', {
    method: 'POST',
    headers: {
      Accept: 'application/json, */*',
      'Content-Type': 'application/json',
    },
    body,
  });
};
