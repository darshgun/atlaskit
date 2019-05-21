const axios = require('axios');
const util = require('util');
/**
 * NOTE: This utility will manage the browserstack build queues.
 * It checks the number of build running in BS and if the number is greater than the X limit, it will retry after Y time.
 * The goal is to prevent Browserstack to be hammered and reduce the number of timeout for users.
 * */
const numberOfTries = process.env.BS_RETRY || 3;
const numberOfBuildsAllowed = process.env.BS_BUILD_ALLOWED || 2; // Depending on the number of tests running each build even 3 may hammer BS
const auth = Buffer.from(
  `${process.env.BROWSERSTACK_USERNAME}:${process.env.BROWSERSTACK_KEY}`,
).toString('base64');

const sleep = util.promisify(setTimeout);

const getNumberOfBuildsRunning = data => {
  // Currently, there is a browserstack issue with Karma builds running but the duration is null.
  // See: https://product-fabric.atlassian.net/browse/BUILDTOOLS-137
  return data.filter(build => build.automation_build.duration !== null).length;
};

function checkBSBuildQueues() {
  return axios
    .get('https://api.browserstack.com/automate/builds.json?status=running', {
      headers: {
        Authorization: 'Basic ' + auth,
      },
    })
    .then(response => {
      const runningBuilds = getNumberOfBuildsRunning(response.data);
      if (runningBuilds > numberOfBuildsAllowed) {
        return Promise.reject(
          new Error(
            `Browserstack is currently running with ${runningBuilds} builds concurrently, please try again later`,
          ),
        );
      }
    });
}

async function main() {
  for (let i = 0; i < numberOfTries; i++) {
    try {
      await checkBSBuildQueues();
      process.exit(0);
    } catch (e) {
      console.log(e);
      await sleep(10000 * Math.pow(2, i));
    }
  }
  process.exit(1);
}
main();
