import queryString from 'query-string';
import { Location, Routes, HistoryAction } from '../../types';
import matchRoute from '../match-route';

export const getRouteContext = (
  location: Location,
  routes: Routes,
  action: HistoryAction = 'POP',
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
    route: matchedRoute && matchedRoute.route ? matchedRoute.route : null,
    match: matchedRoute && matchedRoute.match ? matchedRoute.match : null,
    action,
  };
};
