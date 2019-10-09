import { Transaction, EditorState } from 'prosemirror-state';
import { Step } from 'prosemirror-transform';

export interface Participant {
  lastActive: number;
  sessionId: string;
  avatar: string;
  name: string;
  email: string;
}

export interface InitData {
  doc?: any;
  json?: any;
  version?: number;
  sid?: string;
}

export interface RemoteData {
  json?: any;
  newState?: EditorState;
  userIds?: string[];
}

export interface ConnectionData {
  sid: string;
}

export interface PresenceData {
  joined?: Participant[];
  left?: { sessionId: string }[];
}

export interface TelepointerData {
  type: 'telepointer';
  selection: SendableSelection;
  sessionId: string;
}

export interface SendableSelection {
  type: 'textSelection' | 'nodeSelection';
  anchor: number;
  head: number;
}

export type CollabEvent =
  | 'init'
  | 'connected'
  | 'data'
  | 'telepointer'
  | 'presence'
  | 'error'
  | 'local-steps'
  | 'editor-appearance';

export interface CollabEventData {
  init: InitData;
  connected: ConnectionData;
  data: RemoteData;
  telepointer: TelepointerData;
  presensense: PresenceData;
  error: any;
}

export interface CollabEditProvider {
  initialize(getState: () => any, createStep: (json: object) => Step): this;
  send(tr: Transaction, oldState: EditorState, newState: EditorState): void;
  on(evt: CollabEvent, handler: (...args: any) => void): this;
  off(evt: CollabEvent, handler: (...args: any) => void): this;
  unsubscribeAll(evt: CollabEvent): this;
  sendMessage<T extends keyof CollabEventData>(
    data: { type: T } & CollabEventData[T],
  ): void;
}
