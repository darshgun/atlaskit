/* eslint-disable global-require */
//@flow
const compose = require('docker-compose');
const path = require('path');
const ip = require('ip');
const exec = require('child_process').execSync;
const semver = require('semver');

const cwd = path.join(__dirname);
const log = true;

process.env.HOST_IP = ip.address();

async function startDocker() {
  console.log('starting docker');
  try {
    await compose.upAll({ cwd, log });
  } catch (err) {
    err.message = `docker-compose up failed. Visit go/ak-vr-setup and join go/ak-build-channel for help.\n${err.message}`;
    throw err;
  }
}

async function stopDocker() {
  console.log('stopping docker');
  return compose.stop({ cwd, log });
}

const getDockerImageProdVersion = () =>
  require('../pipelines-docker-image/package.json').version;

const getDockerImageLocalVersion = async () => {
  const table = exec(`docker images`)
    .toString()
    .trim();

  const images = table
    .split('\n')
    .map(line =>
      line
        .split('  ')
        .filter(Boolean)
        .map(item => item.trim()),
    )
    .map(([repository, tag]) => ({ repository, tag }))
    .filter(({ tag }) => tag !== '<none>');

  const vrImages = images
    .filter(({ repository }) => repository === `atlassianlabs/atlaskit-mk-2-vr`)
    .sort(({ tag: a }, { tag: b }) => semver.compare(b, a));

  const image = vrImages[0];

  if (!image) {
    return undefined;
  }

  return image.tag;
};

async function isSameVersion(
  localVersion /*: string | typeof undefined */,
  prodVersion /*: string */,
) {
  return localVersion ? prodVersion === localVersion : false;
}

async function deleteOldDockerImage() {
  const prodVersion = await getDockerImageProdVersion();
  const localVersion = await getDockerImageLocalVersion();
  const isLatest = await isSameVersion(localVersion, prodVersion);

  console.info('Latest docker image version:', prodVersion);

  if (typeof localVersion === 'string') {
    console.info('Local docker image version:', localVersion);
  } else {
    console.info('No local docker image found');
  }

  if (!isLatest && typeof localVersion === 'string') {
    console.info(
      'Old version of docker image found, updating docker image .....',
    );
    await compose.down({ cwd, log });
    const deleteVRImage = `docker rmi -f visual-regression_chromium:latest`;
    const deleteVRBaseImage = `docker rmi -f atlassianlabs/atlaskit-mk-2-vr:${localVersion}`;
    const deletedVRImage = await exec(deleteVRImage).toString();
    const deletedVRBaseImage = await exec(deleteVRBaseImage).toString();
    console.info(deletedVRImage, deletedVRBaseImage);
  } else {
    console.info('Your docker image is up to date...');
  }
}

module.exports = {
  startDocker,
  stopDocker,
  deleteOldDockerImage,
  isSameVersion,
  getDockerImageProdVersion,
  getDockerImageLocalVersion,
};
