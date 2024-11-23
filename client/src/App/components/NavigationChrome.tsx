import React from 'react';
import { Link, Outlet, useLocation } from 'react-router';

import { getBreadcrumbs } from './get-breadcrumbs';

export function NavigationChrome() {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <>
      {breadcrumbs.length ? (
        <nav>
          {breadcrumbs.map((path, index) => (
            <span key={`${index}-${path}`}>
              <Link to={path} key={`${index}-${path}`}>{path}</Link>
              {index < breadcrumbs.length - 1 && (
                <span> - </span>
              )}
            </span>
          ))}
        </nav>
      ) : (
        <span>&nbsp;</span>
      )}
      <p>you are on {location.pathname}</p>
      <Outlet />
    </>
  );
}
