import { ReactElement } from 'react';
import { CollabEditProvider } from './provider';

export {
  CollabParticipant,
  CollabEventInitData,
  CollabEventRemoteData,
  CollabEventConnectionData,
  CollabeEventPresenceData,
  CollabEventTelepointerData,
  CollabSendableSelection,
} from '@atlaskit/editor-common';

export type InviteToEditComponentProps = {
  children: ReactElement<InviteToEditButtonProps>;
};

export type InviteToEditButtonProps = {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  selected: boolean;
};

export interface CollabInviteToEditProps {
  inviteToEditHandler?: (event: React.MouseEvent<HTMLElement>) => void;
  isInviteToEditButtonSelected?: boolean;
  inviteToEditComponent?: React.ComponentType<InviteToEditComponentProps>;
}

export type CollabEditOptions = {
  provider?: Promise<CollabEditProvider>;
  userId?: string;
  useNativePlugin?: boolean;
  allowUnsupportedContent?: boolean;
} & CollabInviteToEditProps;
