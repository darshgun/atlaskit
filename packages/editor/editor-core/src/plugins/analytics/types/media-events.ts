import { TrackAEP, UIAEP } from './events';
import { ACTION_SUBJECT, ACTION, ACTION_SUBJECT_ID } from './enums';

type MediaLinkAEP<Action> = TrackAEP<
  Action,
  ACTION_SUBJECT.MEDIA_SINGLE,
  ACTION_SUBJECT_ID.MEDIA_LINK,
  undefined,
  undefined
>;

export type MediaImageAltTextAEP = UIAEP<
  ALT_TEXT_ACTION,
  ACTION_SUBJECT.MEDIA,
  ACTION_SUBJECT_ID.MEDIA,
  undefined,
  undefined
>;

export enum ALT_TEXT_ACTION {
  ADDED = 'alttext.added',
  EDITED = 'alttext.edited',
  CLEARED = 'alttext.cleared',
  OPENED = 'alttext.opened',
  CLOSED = 'alttext.closed',
}

export type MediaEventPayload =
  | MediaLinkAEP<ACTION.CHANGED_URL>
  | MediaLinkAEP<ACTION.UNLINK>
  | MediaLinkAEP<ACTION.VISITED>
  | MediaImageAltTextAEP;
