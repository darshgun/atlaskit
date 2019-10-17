import { CollabEditProvider, CollabParticipant } from '@atlaskit/editor-common';

export type ParticipantData = Pick<CollabParticipant, 'name' | 'avatar'> & {
  sid: string;
};

export interface CollabProviderOptions {
  url: string;
  jwt: () => string;
  entityId: string;
}

export interface CollabProfile {
  avatar: string;
  name: string;
  lastActive: string;
  sessionId: string;
}

export interface SynchronyUser {
  joinedAt: number;
  origin: string;
}

export interface CollabProvider extends CollabEditProvider {
  new (
    options: CollabProviderOptions,
    getProfile: (user: SynchronyUser) => Omit<ParticipantData, 'sid'>,
  ): CollabEditProvider;
}

export interface CollabProviderModule {
  Provider: CollabProvider;
}
export interface CLJSModule {
  default: {
    create_development_token: (
      url: string,
      permission: string,
      duration: number,
    ) => string;
  };
}
