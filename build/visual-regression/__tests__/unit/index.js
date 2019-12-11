// @flow
import { isSameVersion, getDockerImageLocalVersion } from '../../docker-helper';

let mockImages = `REPOSITORY    TAG    IMAGE ID    CREATED    SIZE`;

jest.mock('child_process', () => {
  return {
    execSync: jest.fn(command => {
      if (command === 'docker images') {
        return mockImages;
      }
      return '';
    }),
  };
});

describe('getDockerImageLocalVersion', () => {
  test('returns undefined for empty image list', async () => {
    const latestVersion = await getDockerImageLocalVersion();
    expect(latestVersion).toBeUndefined();
  });

  test('returns tag of atlassianlabs/atlaskit-mk-2-vr image', async () => {
    mockImages = `
      REPOSITORY                      TAG      IMAGE ID      CREATED       SIZE
      atlassianlabs/atlaskit-mk-2-vr  1.33.7  b98b50bdcd9a   2 months ago  861MB
    `;
    const latestVersion = await getDockerImageLocalVersion();
    expect(latestVersion).toBe('1.33.7');
  });

  test('returns tag of latest atlassianlabs/atlaskit-mk-2-vr image', async () => {
    mockImages = `
      REPOSITORY                       TAG      IMAGE ID      CREATED       SIZE
      atlassianlabs/atlaskit-mk-2-vr   1.33.7   b98b50bdcd9a  2 months ago  861MB
      atlassianlabs/atlaskit-mk-2-vr   1.33.8   b98b50bdcd9a  2 months ago  861MB
    `;
    const latestVersion = await getDockerImageLocalVersion();
    expect(latestVersion).toBe('1.33.8');
  });

  test('discards <none> tags', async () => {
    mockImages = `
      REPOSITORY                       TAG      IMAGE ID      CREATED       SIZE
      atlassianlabs/atlaskit-mk-2-vr   <none>   b98b50bdcd9a  2 months ago  861MB
    `;
    const latestVersion = await getDockerImageLocalVersion();
    expect(latestVersion).toBeUndefined();
  });
});

describe('isSameVersion', () => {
  test('returns false for version < production version', async () => {
    expect(await isSameVersion('99.99.98', '99.99.99')).toBe(false);
  });

  test('returns true for version === production version', async () => {
    expect(await isSameVersion('99.99.99', '99.99.99')).toBe(true);
  });

  test('returns false for undefined version', async () => {
    expect(await isSameVersion(undefined, '99.99.99')).toBe(false);
  });
});
