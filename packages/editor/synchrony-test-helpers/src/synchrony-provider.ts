import { CLJSModule, CollabProviderModule } from './types';
import { getProfile } from './user-profile';
import { CollabEditProvider } from '@atlaskit/editor-common';

const INSTRUCTIONS_WARNING = `
You're running Atlaskit passing "SYNCHRONY_URL={url}" parameter.
You should install "@atlassian/prosemirror-synchrony-plugin" locally without saving
in "package.json" nor "yarn.lock" files by running the command

1. Install "@atlassian/prosemirror-synchrony-plugin" globally

yarn global add @atlassian/prosemirror-synchrony-plugin

2. Link the package in website folder located in atlaskit repository

cd "$(yarn global dir)/node_modules/@atlassian/prosemirror-synchrony-plugin" && yarn link

cd <your-atlaskit-folder>/packages/editor/synchrony-test-helpers && yarn link "@atlassian/prosemirror-synchrony-plugin"

3. Go back to the root folder of atlaskit repository, rerun the website again passing 'SYNCHRONY_URL={url}' as a prefix

cd <your-atlaskit-folder>
SYNCHRONY_URL={url} bolt <your-command>`;

export default async function createSynchronyProvider(
  serverUrl: string,
): Promise<CollabEditProvider | null> {
  let provider: CollabProviderModule;
  let cljs: CLJSModule;
  try {
    [provider, cljs] = await Promise.all([
      import(/*webpackChunkName: "@atlassian/prosemirror-synchrony-plugin/collab-provider" */ '@atlassian/prosemirror-synchrony-plugin/build/collab-provider'),
      import(/*webpackChunkName: "@atlassian/prosemirror-synchrony-plugin/collab-provider" */ '@atlassian/prosemirror-synchrony-plugin/build/cljs'),
    ]);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`${INSTRUCTIONS_WARNING}\n${error}`);
    return null;
  }
  const params = new URL(String(document.location)).searchParams;
  const host: string | null = params.get('host');
  const port: string = params.get('port') || '10123';
  const docns: string = params.get('docns') || 'myapp';
  const docid: string = params.get('docid') || 'atldemo';
  const jwtduration: string | number = params.get('jwtduration') || 30;

  let synchronyURl: string = `${serverUrl}/v1`;
  if (host) {
    synchronyURl = `http://${host}:${port}/v1`;
  }

  const entityId: string = `${docns}/${docid}`;

  const jwt = () => {
    const duration =
      typeof jwtduration === 'string' ? parseInt(jwtduration, 10) : jwtduration;
    return cljs.default.create_development_token(
      synchronyURl,
      `${docns}/\*`,
      duration,
    );
  };
  return new provider.Provider(
    { url: synchronyURl, jwt, entityId },
    getProfile,
  );
}
