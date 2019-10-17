/*
 * NOTE: This is just used for testing. We can remove this file once we have a proper profile/user-integration
 *
 */
import { ParticipantData, SynchronyUser } from './types';
import { CollabParticipant } from '@atlaskit/editor-common';

type AvailableParticipants = 'rick' | 'morty' | 'summer';

export const participants: Record<AvailableParticipants, ParticipantData> = {
  rick: {
    sid: 'rick',
    name: 'Rick Sanchez',
    avatar:
      'https://pbs.twimg.com/profile_images/897250392022540288/W1T-QjML_400x400.jpg',
  },
  morty: {
    sid: 'morty',
    name: 'Morty Smith',
    avatar:
      'https://pbs.twimg.com/profile_images/685489227082129408/YhGfwW73_400x400.png',
  },
  summer: {
    sid: 'summer',
    name: 'Summer Smith',
    avatar:
      'https://pbs.twimg.com/profile_images/878646716328812544/dYdU_OKZ_400x400.jpg',
  },
};

const participantsArray = Object.keys(participants).map(
  (key: string) => participants[key as AvailableParticipants],
);

export const getProfile = (
  user: SynchronyUser,
): Omit<CollabParticipant, 'email'> => {
  return {
    ...getUserData(user.origin),
    lastActive: user.joinedAt,
    sessionId: user.origin,
  };
};

const getUserData = (sid: string): Pick<ParticipantData, 'name' | 'avatar'> => {
  let hash = 0;

  for (let i = 0; i < sid.length; i++) {
    hash = (hash << 5) - hash + sid.charCodeAt(i);
    hash = hash & hash;
  }

  return participantsArray[Math.abs(hash) % participantsArray.length];
};
