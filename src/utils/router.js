import _ from 'lodash';
import { matchPath } from 'react-router-dom';

import routesConfig from '@/config/routes';

export function matchRoute(locationPath, r) {
  if (_.isUndefined(r)) return matchRoute(locationPath, routesConfig);
  return _.reduce(r, (res, value, key) => {
    const { path, exact = false, strict = false, sensitive = false, routes } = value;
    if (!_.isUndefined(path)) {
      if (!_.isUndefined(routes)) {
        const subRouteRes = matchRoute(locationPath, routes);
        if (!_.isUndefined(subRouteRes)) {
          return res || subRouteRes;
        }
      }
      const match = matchPath(locationPath, {
        path,
        exact,
        strict,
        sensitive,
      });
      if (!_.isNull(match)) {
        res = res || value;
      }
    }
    return res;
  }, undefined);
}

export function flatRoutes(iteratee, r) {
  if (!_.isFunction(iteratee)) return [];
  if (_.isUndefined(r)) return flatRoutes(iteratee, routesConfig);
  return _.reduce(r, (res, value, key) => {
    const { routes } = value;
    const keep = iteratee(value, key);
    if (keep) {
      res.push(value);
    }
    if (!_.isUndefined(routes)) {
      _.merge(res, flatRoutes(iteratee, routes));
    }
    return res;
  }, []);
}
