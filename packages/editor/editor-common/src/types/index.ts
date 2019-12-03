import { Node } from 'prosemirror-model';

export interface Transformer<T> {
  encode(node: Node): T;
  parse(content: T): Node;
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
  NO_ORDER = 'no_order',
}

export {
  CollabEditProvider,
  CollabEvent,
  CollabEventData,
  CollabEventConnectionData,
  CollabEventInitData,
  CollabParticipant,
  CollabeEventPresenceData,
  CollabEventRemoteData,
  CollabSendableSelection,
  CollabEventTelepointerData,
} from './collab';
