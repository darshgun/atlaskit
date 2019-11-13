// @flow
/* Script to send step failure events data to the fabric build stats service. */
/* The repository is available there: https://bitbucket.org/atlassian/fabric-build-stats-service.
/* The service is available in dev: https://fabric-build-stats-service.dev.services.atlassian.com.
/* The service is available in prod: https://fabric-build-stats-service.services.atlassian.com. */

const { getStepEvents } = require('./buildEventsUtils/getBuildEvents');

const {
  sendBuildEventsPayload,
} = require('./buildEventsUtils/sendBuildEventsPayload');

(async () => {
  try {
    const buildId = process.env.BITBUCKET_BUILD_NUMBER || '';
    const stepEvents = await getStepEvents(buildId);
    // Data are only sent to the service on failures.
    if (stepEvents && stepEvents.build_status === 'FAILED') {
      await sendBuildEventsPayload(stepEvents);
    }
  } catch (err) {
    console.error(`You face some issues while sending data: ${err.message}`);
    // It is not required to fail the step.
    process.exit(0);
  }
})();
