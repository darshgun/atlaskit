import { ReactElement } from 'react';
import { CollabEditProvider } from './provider';

export {
  Participant,
  InitData,
  RemoteData,
  ConnectionData,
  PresenceData,
  TelepointerData,
  SendableSelection,
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
