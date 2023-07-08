import React, { StrictMode } from 'react';
import { createBrowserRouter, RouterProvider, Link, useParams, Outlet } from 'react-router-dom';

import './App.css';
import { useGuildMemberData } from './use-guild-member-data';
import { Welcome } from './Welcome';

type GuildUserData = ReturnType<typeof useGuildMemberData>;

const getWelcomeMessage = (guildUser: GuildUserData) => {
  const welcome = 'welcome to the trash compactor';

  if (guildUser?.user?.username) {
    return `${welcome}, ${guildUser.user.username}`;
  }

  return `${welcome}, <unknown>`;
};

const Home = () => {
  const guildUser = useGuildMemberData();

  if (guildUser) {
    return (
      <>
        <ul className="navigation-list">
          <li>
            <Link to="/new">new</Link>
          </li>
          <li>
            <Link to="/worlds">worlds</Link>
          </li>
        </ul>
        <Welcome message={getWelcomeMessage(guildUser)} />
      </>
    );
  }

  return (<p>loading...</p>);
};

const WorldsList = () => {
  const fakeWorlds = [
    {
      id: 1,
      label: 'world one',
      version: '1.16.5',
      createdAt: '2023/06/28',
      lastOnline: '2023/06/28',
      createdBy: '@shaned.gg'
    },
    {
      id: 2,
      label: 'world two',
      version: '1.19.0',
      createdAt: '2023/06/28',
      lastOnline: '2023/06/28',
      createdBy: '@shaned.gg'
    },
    {
      id: 3,
      label: 'world three',
      version: '1.20.1',
      createdAt: '2023/06/28',
      lastOnline: '2023/06/28',
      createdBy: '@shaned.gg'
    },
  ];

  return (
    <>
      <ul className="navigation-list">
        <li>
          <Link to="/">back</Link>
        </li>
      </ul>
      <table>
        <thead>
          <tr>
            <td>name</td>
            <td>version</td>
            <td>created</td>
            <td>last online</td>
            <td>created by</td>
          </tr>
        </thead>
        <tbody>
          {fakeWorlds.map(({ id, label, version, createdAt, createdBy, lastOnline }) => {
            return (
              <tr key={`${id}-${label}-${version}`}>
                <td><Link to={`${id}`}>{label}</Link></td>
                <td>{version}</td>
                <td>{new Date(createdAt).toLocaleDateString()}</td>
                <td>{new Date(lastOnline).toLocaleDateString()}</td>
                <td>{createdBy}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Outlet />
    </>
  );
};

const WorldDetail = () => {
  const { worldId } = useParams();
  return (
    <>
      <h2>{worldId}</h2>
    </>
  );
};

const NewWorld = () => {
  return (
    <>
      <ul className="navigation-list">
        <li>
          <Link to="/">back</Link>
        </li>
      </ul>
      <form>
        <label htmlFor="version">version</label>
        <select name="version">
          <option>1.20.1</option>
        </select>
        <label htmlFor="name">name</label>
        <input name="name" />
        <button>create</button>
      </form>
    </>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/worlds',
    element: <WorldsList />,
    children: [
      {
        path: ':worldId',
        element: <WorldDetail />,
      },
    ],
  },
  {
    path: '/new',
    element: <NewWorld />,
  },
]);

const App = () => {
  return (
    <StrictMode>
      <h1>trshcmpctr</h1>
      <RouterProvider router={router} />
    </StrictMode>
  );
};

export default App;
