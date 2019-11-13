// @flow
function isRunningInPipelines() {
  const { CI } = process.env;
  const { BITBUCKET_BUILD_NUMBER } = process.env;
  return !!CI && !!BITBUCKET_BUILD_NUMBER;
}

module.exports = isRunningInPipelines;
