import { createElement } from 'react';

import { ErrorCard } from './components/ErrorCard';
import { Home } from './components/Home';
import { NavigationChrome } from './components/NavigationChrome';
import { NewWorld } from './components/NewWorld';
import { WorldDetail } from './components/WorldDetail';
import { Worlds } from './components/Worlds';

import type { RouteObject } from 'react-router';

type NamedRoute = Pick<RouteObject, 'element' | 'errorElement'>;

type NamedRouteWithChildren = NamedRoute & {
  children?: Record<string, NamedRouteWithChildren>;
}

export type NamedRoutes = Record<string, NamedRouteWithChildren>;

/**
 * A map of named routes declaring the application route hierarchy
 * Not understood by react-router browser router
 */
export const namedRoutes: NamedRoutes = {
  '/': {
    children: {
      '/': {
        element: createElement(Home),
        errorElement: createElement(ErrorCard, { error: Error('Problem rendering Home')}),
      },
      '/worlds': {
        children: {
          ':worldId': {
            element: createElement(WorldDetail),
            errorElement: createElement(ErrorCard, { error: Error('Problem rendering World')}),
          },
        },
        element: createElement(Worlds),
        errorElement: createElement(ErrorCard, { error: Error('Problem rendering Worlds')}),
      },
      '/new': {
        element: createElement(NewWorld),
        errorElement: createElement(ErrorCard, { error: Error('Problem rendering New')}),
      },
    },
    element: createElement(NavigationChrome),
    errorElement: createElement(ErrorCard, { error: Error('Problem rendering routes')}),
  },
};

/**
 * Transform named routes map into a list of routes for react-router browser router
 * @param routes Named routes
 * @returns A list of routes for browser router
 */
export function transformRoutesForBrowserRouter(routes: NamedRoutes): RouteObject[] {
  const childRoutes: RouteObject[] = [];
  for (const childPath in routes) {
    const { children, ...namedRoute } = routes[childPath];
    if (children) {
      childRoutes.push({
        ...namedRoute,
        children: transformRoutesForBrowserRouter(children),
        path: childPath,
      });
      // Skip the following push because it's already handled
      continue;
    }
    // Push a children-less version of the route if not handled above
    childRoutes.push({
      ...namedRoute,
      path: childPath,
    });
  }
  return childRoutes;
}

/**
 * Get app routes
 * @returns A list of routes for browser router
 */
export const getRoutes = () => transformRoutesForBrowserRouter(namedRoutes);
