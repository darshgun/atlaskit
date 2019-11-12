import { RouteResourceResponse } from '../../../../common/types';
import {
  DEFAULT_RESOURCE_MAX_AGE,
  BASE_DEFAULT_STATE_SLICE,
} from '../../constants';
import { getExpiresAt } from '../expires-at';

export const getDefaultStateSlice = (): RouteResourceResponse => ({
  ...BASE_DEFAULT_STATE_SLICE,
  expiresAt: getExpiresAt(DEFAULT_RESOURCE_MAX_AGE),
});
