import * as bolt from 'bolt';

export async function getWorkspaceDirs(packageEngine: string) {
  if (packageEngine === 'bolt') {
    const ws = await bolt.getWorkspaces();
    return ws.map(pkg => pkg.dir);
  } else if (packageEngine === 'yarn') {
    console.log('getWorkspaceDirs not implemented for yarn workspaces');
    return [];
  } else {
    throw new Error('Invalid package engine');
  }
}
