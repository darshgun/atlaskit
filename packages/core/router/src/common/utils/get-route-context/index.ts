import queryString from 'query-string';
import { Location, Routes, HistoryAction } from '../../types';
import matchRoute from '../match-route';
import { DEFAULT_ACTION, DEFAULT_MATCH, DEFAULT_ROUTE } from '../../constants';

export const getRouteContext = (
  location: Location,
  routes: Routes,
  action: HistoryAction = DEFAULT_ACTION,
) => {
  const { pathname, search, hash } = location;
  const query = queryString.parse(search);
  const matchedRoute = matchRoute(routes, pathname, query);

  return {
    location: {
      pathname,
      search,
      hash,
    },
    query,
    route:
      matchedRoute && matchedRoute.route ? matchedRoute.route : DEFAULT_ROUTE,
    match:
      matchedRoute && matchedRoute.match ? matchedRoute.match : DEFAULT_MATCH,
    action,
  };
};
