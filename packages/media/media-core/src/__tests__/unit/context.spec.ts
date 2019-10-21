import { ContextFactory } from '../..';
import {
  asMock,
  getDefaultMediaClientConfig,
  fakeMediaClient,
} from '@atlaskit/media-test-helpers';
import * as MediaClientModule from '@atlaskit/media-client';

describe('ContextFactory', () => {
  beforeEach(() => {
    // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
    //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
    jest.spyOn(MediaClientModule, 'MediaClient');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return new mediaClient on ContextFactory.create call', () => {
    const mediaClientConfig = getDefaultMediaClientConfig();
    const mediaClient = fakeMediaClient();

    asMock(MediaClientModule.MediaClient).mockImplementation(() => mediaClient);
    const context = ContextFactory.create(mediaClientConfig);
    expect(context).toBe(mediaClient);
  });
});
