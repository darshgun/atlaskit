#!/usr/bin/env node
// @flow
const axios = require('axios');
const pWaitFor = require('p-wait-for');
/*
   This script is a stop gap solution until this code is moved into landkid.
   It simply waits until there is no build running in master.
   We run this at the end of a landkid build so that we never merge a PR whilst
   master is still running.
*/

const BUILDS_PER_PAGE = 30;
const {
  BITBUCKET_REPO_FULL_NAME,
  BITBUCKET_USER,
  BITBUCKET_PASSWORD,
} = process.env;

if (!BITBUCKET_REPO_FULL_NAME || !BITBUCKET_USER || !BITBUCKET_PASSWORD) {
  throw Error(
    '$BITBUCKET_REPO_FULL_NAME or $BITBUCKET_USER or $BITBUCKET_PASSWORD environment variables are not set',
  );
}

const axiosRequestConfig = {
  auth: {
    username: BITBUCKET_USER,
    password: BITBUCKET_PASSWORD,
  },
  params: {
    pagelen: BUILDS_PER_PAGE,
    // get the most recent builds first
    sort: '-created_on',
    'target.ref_name': 'master',
    'target.ref_type': 'BRANCH',
  },
};

function noMasterRunning() {
  console.log(+new Date(), 'Checking if master is running...');
  // We add a queryString to ensure we dont get cached responses
  return axios
    .get(
      `https://api.bitbucket.org/2.0/repositories/${BITBUCKET_REPO_FULL_NAME}/pipelines/?${+new Date()}`,
      axiosRequestConfig,
    )
    .then(response => {
      const allPipelines = response.data.values;
      const runningPipelines = allPipelines
        .filter(
          pipeline =>
            pipeline.state.name === 'IN_PROGRESS' ||
            pipeline.state.name === 'PENDING',
        )
        // remove the scheduled builds (website, etc)
        .filter(job => job.trigger.name !== 'SCHEDULE');
      console.log(runningPipelines.length, 'master build running');
      return runningPipelines.length === 0;
    })
    .catch(err => {
      throw Error(`${err}`);
    });
}

console.log(
  'Waiting until there is no master build running so that we can merge...',
);

pWaitFor(noMasterRunning, 5000);
