// @flow
const path = require('path');
const readline = require('readline');

const axios = require('axios');
const execa = require('execa');
const chalk = require('chalk');
const yaml = require('node-yaml');
const pWaitFor = require('p-wait-for');

const config = require('../config');

const { baseUrl } = config;
let defaultPauseReason = 'Pausing deployments - Landkid release is progress';
const args = process.argv.slice(2);

if (args.length === 1) {
  // eslint-disable-next-line prefer-destructuring
  defaultPauseReason = args[0];
}
function buildDockerImage(tag) {
  const cmd = 'docker';
  const argsBuild = [
    'build',
    '-t',
    `docker.atl-paas.net/atlaskit/atlaskid:${tag}`,
    '.',
  ];
  return execa(cmd, argsBuild, { stdio: 'inherit' });
}

function pushDockerImage(tag) {
  const cmd = 'docker';
  const argsPush = ['push', `docker.atl-paas.net/atlaskit/atlaskid:${tag}`];
  return execa(cmd, argsPush, { stdio: 'inherit' });
}

function deployToMicros() {
  const cmd = 'micros';
  const argsDeploy = ['service:deploy', 'atlaskit-atlaskid', '-e', 'stg-west'];
  return execa(cmd, argsDeploy, { stdio: 'inherit' });
}

function promptConfirm(prompt = 'Confirm?: ') {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    rl.question(prompt, answer => {
      const confirmed = answer === '' || answer === 'y' || answer === 'yes';
      resolve(confirmed);
    });
  });
}

async function pauseBuildsIfRequired() {
  const { data } = await axios.get(`${baseUrl}/api/current-state`);
  if (data.paused) {
    console.log('Builds already paused: ', data.pausedReason);
    return;
  }

  const cmd = 'yarn';
  const argsPause = ['pause', '--', `${defaultPauseReason}`];
  // eslint-disable-next-line consistent-return
  return execa(cmd, argsPause, { stdio: 'inherit' });
}

async function waitUntilNothingRunning() {
  const pollInterval = 5000;

  return pWaitFor(async () => {
    const { data } = await axios.get(`${baseUrl}/api/current-state`);
    const nothingRunning = Object.keys(data.running).length === 0;
    const queueEmpty = data.queue.length === 0;

    return nothingRunning && queueEmpty;
  }, pollInterval);
}

async function run() {
  const cwd = process.cwd();
  const serviceDescriptorPath = path.join(cwd, 'atlaskit-atlaskid.sd.yml');
  const data = yaml.readSync(serviceDescriptorPath);

  const currentTag = data.links.binary.tag;
  const [wholeMatch, tagNumber] = currentTag.match(/v([0-9]+)/);

  console.log('Current tag: ', wholeMatch, ' would you like to bump this tag?');
  const shouldBump = await promptConfirm('Confirm?: ');

  if (shouldBump) {
    const newTag = `v${+tagNumber + 1}`;
    data.links.binary.tag = newTag;
    console.log('Tag is now: ', chalk.green(newTag));
    console.log(chalk.blue('Writing yml file...'));
    yaml.writeSync(serviceDescriptorPath, data);
  }

  console.log(chalk.blue('Pausing builds...'));
  await pauseBuildsIfRequired();

  console.log(
    chalk.blue('Waiting for queue to be empty... (this may take a while)'),
  );
  await waitUntilNothingRunning();
  console.log('Ready!!');

  console.log(chalk.blue('Building docker image...'));
  await buildDockerImage(data.links.binary.tag);

  console.log(chalk.blue('Pushing docker image...'));
  await pushDockerImage(data.links.binary.tag);

  console.log(chalk.blue('Deploying to micros...'));
  await deployToMicros();

  console.log(chalk.green('Done'));
}

(async () => {
  await run();
  process.exit(0);
})();
