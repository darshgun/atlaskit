import {
  Query,
  ServiceTask,
  ServiceTaskResponse,
  Task,
  TaskResponse,
  ServiceTaskState,
  BaseItem,
  TaskState,
} from '../types';

export interface ResponseConverter<S, C> {
  (serviceDecisionResponse: S, query?: Query): C;
}

export const convertServiceTaskToTask = (serviceTask: ServiceTask): Task => {
  const { creationDate, lastUpdateDate, ...other } = serviceTask;

  return {
    creationDate: new Date(creationDate),
    lastUpdateDate: new Date(lastUpdateDate),
    ...other,
  };
};

export const convertServiceTaskStateToBaseItem = (
  serviceTaskInfo: ServiceTaskState,
): BaseItem<TaskState> => {
  const { lastUpdateDate, ...other } = serviceTaskInfo;

  return {
    type: 'TASK',
    lastUpdateDate: new Date(lastUpdateDate),
    ...other,
  };
};

export const convertServiceTaskResponseToTaskResponse = (
  serviceResponse: ServiceTaskResponse,
  query?: Query,
): TaskResponse => {
  const tasks = serviceResponse.tasks.map(convertServiceTaskToTask);
  let nextQuery: Query | undefined;
  if (query && serviceResponse.meta && serviceResponse.meta.cursor) {
    nextQuery = {
      ...query,
      cursor: serviceResponse.meta.cursor,
    };
  }

  return {
    tasks,
    nextQuery,
  };
};

export const findIndex = (
  array: any[],
  predicate: (item: any) => boolean,
): number => {
  let index = -1;
  array.some((item, i) => {
    if (predicate(item)) {
      index = i;
      return true;
    }
    return false;
  });

  return index;
};
