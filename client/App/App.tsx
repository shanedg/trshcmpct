/* eslint-disable react/no-unescaped-entities */
import React, {
  FC,
  // useEffect,
} from 'react';
import PropTypes, { InferProps } from 'prop-types';
import {
  RouteComponentProps,
  withRouter,
  MemoryRouter,
  Switch,
  Route,
  Link,
  // useLocation,
} from 'react-router-dom';

type AppProps = InferProps<typeof AppPropTypes> & RouteComponentProps;

const AppPropTypes = {
  pathFragment: PropTypes.string.isRequired,
  match: PropTypes.any.isRequired,
  location: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired
};

const Root: FC = () => (
  <>
    <h1>app root</h1>
  </>
);
const Page: FC = () => (<h1>app page</h1>);
const Deepr: FC = () => (<h1>app deepr</h1>);
const Perhaps: FC = () => (<h1>app perhaps</h1>);

// const simpleFakeSubRouter = (pathFragment: string) => {
//   switch (pathFragment) {
//   case '/app':
//     return <Root />;
//   case '/app/page':
//     return <Page />;
//   case '/app/page/deepr':
//     return <Deepr />;
//   case '/app/page/arbitrarily/deep/perhaps':
//     return <Perhaps />;
//   default:
//     return (<h1>Four, O' Four!</h1>);
//   }
// };

// const CustomLinkPropTypes = {
//   children: PropTypes.node.isRequired,
//   to: PropTypes.string.isRequired,
//   topHistory: PropTypes.object.isRequired,
// };

// type CustomLinkProps = InferProps<typeof CustomLinkPropTypes>;

// const CustomLink: FC<CustomLinkProps> = ({ children, to, topHistory }) => {
//   return (
//     <a
//       href={to}
//       onClick={click => {
//         click.preventDefault();
//         console.log(`trying to navigate to ${to}`);
//         // @ts-expect-error
//         topHistory.push(to);
//       }}
//     >
//       {children}
//     </a>
//   );
// };

// CustomLink.propTypes = CustomLinkPropTypes;

const App: FC<AppProps> = props => {
  // let location = useLocation();
  // useEffect(() => {
  //   console.log(JSON.stringify(location, null ,2));
  // }, [location]);

  return (
    <>
      <p>{props.pathFragment}</p>
      {/* <CustomLink
        to="/"
        topHistory={props.history}
      >/</CustomLink>
      {simpleFakeSubRouter(props.pathFragment)} */}
      <MemoryRouter>
        <h1>app links</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">[app] /</Link>
            </li>
            <li>
              <Link to="/page/deepr/perhaps">[app] /page/deepr/perhaps</Link>
            </li>
            <li>
              <Link to="/page/deepr">[app] /page/deepr</Link>
            </li>
            <li>
              <Link to="/page">[app] /page</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/page/deepr/perhaps">
            <Perhaps />
          </Route>
          <Route path="/page/deepr">
            <Deepr />
          </Route>
          <Route path="/page">
            <Page />
          </Route>
          <Route path="/">
            <Root />
          </Route>
        </Switch>
      </MemoryRouter>
    </>
  );
};

App.propTypes = AppPropTypes;

export default withRouter(App);
