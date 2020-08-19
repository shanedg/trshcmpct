import React, {
  lazy,
  Suspense,
} from 'react';
import {
  BrowserRouter,
  Link,
  Route,
  Switch,
} from 'react-router-dom';

const LazyApp = lazy(() => import('../App/App'));

const Fallback: React.FC = () => (<h1>loading...</h1>);

const Shell: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/subapp">Sub</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/subapp">
            <h1>switcheddd</h1>
          </Route>
          <Route path="/">
            <Suspense
              fallback={<Fallback />}>
              <LazyApp />
            </Suspense>
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
};

export default Shell;
