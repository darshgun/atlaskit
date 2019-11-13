// @flow
const axios = require('axios');

const config = require('../config');

const args = process.argv.slice(2);
const pauseReason =
  args.length > 0 ? args[0] : 'Builds manually paused by admin';

const { baseUrl } = config;

(async () => {
  const data = JSON.stringify({ reason: pauseReason });
  const headers = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.post(`${baseUrl}/api/pause`, data, headers);
  if (response && response.data && response.data.paused) {
    console.log('Successfully paused');
  } else {
    console.log(
      'Something may have gone wrong... Try doing this manually instead.',
    );
  }
})();
