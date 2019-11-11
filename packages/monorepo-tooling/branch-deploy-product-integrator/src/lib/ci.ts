/** Product CI */
import fetch from 'node-fetch';

type Auth = {
  username: string;
  password: string;
};

function branchBuildRequest(
  planUrl: string,
  branchName: string,
  auth: Auth,
  method: 'GET' | 'PUT',
) {
  const branchPlanUrl = `${planUrl}/branch/${branchName}?os_authType=basic&vcsBranch=${branchName}&cleanupEnabled=true`;
  const credentials = Buffer.from(`${auth.username}:${auth.password}`).toString(
    'base64',
  );
  const headers = {
    Accept: 'application/json',
    Authorization: `Basic ${credentials}`,
  };

  return fetch(branchPlanUrl, {
    method,
    headers,
  });
}

export async function triggerProductBuild(
  planUrl: string,
  branchName: string,
  auth: Auth,
) {
  const existingBranchBuild = await branchBuildRequest(
    planUrl,
    branchName,
    auth,
    'GET',
  );
  if (existingBranchBuild.status === 200) {
    console.log('Branch build already exists, no need to trigger');
    return;
  }

  const newBranchBuild = await branchBuildRequest(
    planUrl,
    branchName,
    auth,
    'PUT',
  );

  if (newBranchBuild.status !== 200) {
    const payload = await newBranchBuild.text();
    throw Error(
      `Could not create branch build in product - Status code: ${
        newBranchBuild.status
      } - ${JSON.stringify(payload)}`,
    );
  }
}
