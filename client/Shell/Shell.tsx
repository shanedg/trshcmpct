/* eslint-disable react/prop-types */
import React, {
  FC,
  lazy,
  Suspense,
} from 'react';
import {
  BrowserRouter,
  Link,
  Route,
  Switch,
  useLocation,
} from 'react-router-dom';

type RouteConfig = {
  path: string,
  component: FC,
};
type RoutesList = RouteConfig[];
type NavProps = {
  routes: RoutesList,
};
type RouteSwitchProps = {
  routes: RoutesList,
};

const Nav: FC<NavProps> = ({ routes }) => {
  const extraPaths = [
    '/app/page',
    '/app/page/deepr',
    '/app/page/arbitrarily/deep/perhaps',
    '/app/not-found',
    '/undefined-path',
  ];

  return (
    <nav>
      <ul>
        {routes.map((route, index) => (
          <li key={`${route.path}-${index}`}>
            <Link to={route.path}>{route.path}</Link>
          </li>
        ))}

        {extraPaths.map((path, index) => (
          <li key={`${path}-${index}`}>
            <Link to={path}>{path}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const RouteSwitch: FC<RouteSwitchProps> = ({ routes }) => (
  <Switch>
    {routes.map((route, index) => (
      <Route
        key={`${route.path}-${index}`}
        path={route.path}
        render={() => (
          <route.component />
        )}
      />
    ))}
  </Switch>
);

const LazyApp = lazy(() => import('../App/App'));
const Fallback: FC<{pathFragment: string}> = props => (<h1>loading {props.pathFragment}...</h1>);

const SuspendedLazyApp: FC = () => {
  let { pathname } = useLocation();

  return (
    <>
      <Suspense
        fallback={<Fallback pathFragment={pathname} />}
      >
        <LazyApp
          pathFragment={pathname}
        />
      </Suspense>
    </>
  );
};

const Subapp: FC = () => <h1>subapp</h1>;
const Root: FC = () => <h1>shell root</h1>;

const Shell: FC = () => {
  const routes: RoutesList = [
    {
      path: '/subapp',
      component: Subapp,
    },
    {
      path: '/app',
      component: SuspendedLazyApp,
    },
    {
      path: '/',
      component: Root,
    },
  ];

  return (
    <>
      <BrowserRouter>
        <Nav routes={routes} />
        <RouteSwitch routes={routes} />
      </BrowserRouter>
    </>
  );
};

export default Shell;
