// @flow
const axios = require('axios');

const config = require('../config');

const { baseUrl } = config;

(async () => {
  const { data } = await axios.get(`${baseUrl}/api/current-state`);
  console.log(JSON.stringify(data, null, 2));
})();
