// @flow
const mkdirp = require('mkdirp');

const formatFileName = path => {
  return path.toLowerCase().replace(/[\s.:/\\]/g, '-');
};

const hasSnapshotDiffFail = failedExpectations => {
  if (!failedExpectations || !failedExpectations.length) {
    return false;
  }
  return !!failedExpectations.find(failure =>
    failure.message.match(/different from snapshot/),
  );
};

/**
 * Reporter that takes a screenshot when a VR test fails due to an error
 * This helps debug timeout or page error failures
 */
class ScreenshotReporter {
  constructor(page /*: any */) {
    // $FlowFixMe - page error
    this.page = page;
    // $FlowFixMe - page error
    this.pendingScreenshots = [];
  }

  reset(page /*:any*/) {
    // $FlowFixMe - page error
    this.page = page;
    // $FlowFixMe - page error
    this.pendingScreenshots = [];
  }

  async waitForPendingScreenshots() {
    // $FlowFixMe - page error
    await Promise.all(this.pendingScreenshots);
  }

  async specDone(result /*: Object*/) {
    const { status, failedExpectations, fullName, testPath } = result;

    // Take screenshot if test failed for a reason other than screenshot diff - we will
    // already have a screenshot in that case so don't need to take another
    if (status === 'failed' && !hasSnapshotDiffFail(failedExpectations)) {
      const testDir = testPath.substring(0, testPath.lastIndexOf('/'));
      const testFileName = testPath.substring(testPath.lastIndexOf('/') + 1);
      const screenshotDir = `${testDir}/__image_snapshots__/__errors__`;
      const screenshotFileName = formatFileName(
        `${testFileName}-${fullName}-error`,
      );
      const path = `${screenshotDir}/${screenshotFileName}.png`;
      // $FlowFixMe - page error
      if (!this.page.isClosed()) {
        await mkdirp(screenshotDir);
        // $FlowFixMe - page error
        this.pendingScreenshots.push(this.page.screenshot({ path }));
      }
    }
  }
}

module.exports = ScreenshotReporter;
