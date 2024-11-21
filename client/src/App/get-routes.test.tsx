import React from 'react';

import { transformRoutesForBrowserRouter } from './get-routes';

describe('transformRoutes', () => {
  it('transforms a route with no children', () => {
    expect(transformRoutesForBrowserRouter({
      '/': {
        element: <>root</>,
      }
    })).toStrictEqual([
      {
        element: <>root</>,
        path: '/',
      }
    ]);
  });

  it('transforms a route with one child', () => {
    expect(transformRoutesForBrowserRouter({
      '/': {
        children: {
          '/worlds': {
            element: <>worlds</>,
          },
        },
        element: <>root</>,
      }
    })).toStrictEqual([
      {
        children: [
          {
            element: <>worlds</>,
            path: '/worlds',
          },
        ],
        element: <>root</>,
        path: '/',
      }
    ]);
  });

  it('transforms a route with a child that has its own children', () => {
    expect(transformRoutesForBrowserRouter({
      '/':{
        element: <>root</>,
        children: {
          '/worlds': {
            children: {
              ':world': {
                element: <>world detail</>,
              }
            },
            element: <>worlds</>,
          },
        },
      }
    })).toStrictEqual([
      {
        children: [
          {
            children: [
              {
                element: <>world detail</>,
                path: ':world',
              },
            ],
            element: <>worlds</>,
            path: '/worlds',
          },
        ],
        element: <>root</>,
        path: '/',
      }
    ]);
  });

  it('transforms a route with a child with a child with a child', () => {
    expect(transformRoutesForBrowserRouter({
      '/': {
        children: {
          '/worlds': {
            children: {
              ':world': {
                children: {
                  '/settings': {
                    element: <>settings</>,
                  }
                },
                element: <>world detail</>,
              }
            },
            element: <>worlds</>,
          },
        },
        element: <>root</>,
      }
    })).toStrictEqual([
      {
        children: [
          {
            children: [
              {
                path: ':world',
                element: <>world detail</>,
                children: [
                  {
                    path: '/settings',
                    element: <>settings</>,
                  },
                ],
              },
            ],
            element: <>worlds</>,
            path: '/worlds',
          },
        ],
        element: <>root</>,
        path: '/',
      }
    ]);
  });

  it('transforms a route with >1 child', () => {
    expect(transformRoutesForBrowserRouter({
      '/': {
        element: <>root</>,
        children: {
          '/worlds': {
            element: <>worlds</>
          },
          '/launch': {
            element: <>launch</>,
          },
        },
      }
    })).toStrictEqual([
      {
        children: [
          {
            path: '/worlds',
            element: <>worlds</>,
          },
          {
            path: '/launch',
            element: <>launch</>,
          },
        ],
        element: <>root</>,
        path: '/',
      }
    ]);
  });

  it('transforms a route with >1 child that has its own children', () => {
    expect(transformRoutesForBrowserRouter({
      '/': {
        element: <>root</>,
        children: {
          '/worlds': {
            element: <>worlds</>,
            children: {
              ':world': {
                element: <>world detail</>,
              }
            }
          },
          '/launch': {
            element: <>launch</>,
            children: {
              '/new': {
                element: <>new</>,
              }
            }
          },
        },
      }
    })).toStrictEqual([
      {
        children: [
          {
            path: '/worlds',
            element: <>worlds</>,
            children: [
              {
                path: ':world',
                element: <>world detail</>,
              }
            ],
          },
          {
            path: '/launch',
            element: <>launch</>,
            children: [
              {
                path: '/new',
                element: <>new</>,
              }
            ],
          },
        ],
        element: <>root</>,
        path: '/',
      }
    ]);
  });
});
