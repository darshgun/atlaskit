import {
  BaseItem,
  Decision,
  Item,
  ObjectKey,
  RendererContext,
  ServiceDecision,
  ServiceItem,
  ServiceTask,
  Task,
  TaskState,
} from './types';

export const isDecision = (item: Item): item is Decision =>
  !!(item && item.type === 'DECISION');
export const isTask = (item: Item): item is Task =>
  !!(item && item.type === 'TASK');

export const isServiceDecision = (item: ServiceItem): item is ServiceDecision =>
  !!(item && item.type === 'DECISION');
export const isServiceTask = (item: ServiceItem): item is ServiceTask =>
  !!(item && item.type === 'TASK');

export const toObjectKey = (
  item: Item | ServiceDecision | ServiceTask | BaseItem<any>,
): ObjectKey => {
  const { localId, objectAri } = item;
  return {
    localId,
    objectAri,
  };
};

export const toRendererContext = (item: Item | ObjectKey): RendererContext => {
  const { containerAri, objectAri } = item;
  return {
    containerAri,
    objectAri,
  };
};

export const objectKeyToString = (objectKey: ObjectKey) => {
  const { containerAri, objectAri, localId } = objectKey;
  const containerAriKey = (containerAri && `${containerAri}:`) || '';
  return `${containerAriKey}${objectAri}:${localId}`;
};

export const toggleTaskState = (state: TaskState): TaskState =>
  state === 'DONE' ? 'TODO' : 'DONE';
