// @flow
/* Script to send build events data to the fabric build stats service. */
/* The repository is available there: https://bitbucket.org/atlassian/fabric-build-stats-service.
/* The service is available in dev: https://fabric-build-stats-service.dev.services.atlassian.com.
/* The service is available in prod: https://fabric-build-stats-service.services.atlassian.com. */

const {
  getPipelinesBuildEvents,
} = require('./buildEventsUtils/getBuildEvents');
const {
  sendBuildEventsPayload,
} = require('./buildEventsUtils/sendBuildEventsPayload');

(async () => {
  try {
    const buildId = process.env.BITBUCKET_BUILD_NUMBER || '';
    const buildEvents = (await getPipelinesBuildEvents(buildId)) || {};
    await sendBuildEventsPayload(buildEvents);
  } catch (err) {
    console.error(`You face some issues while sending data: ${err.message}`);
    // It is not required to fail the step.
    process.exit(0);
  }
})();
