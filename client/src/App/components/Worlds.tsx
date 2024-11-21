import React, { createContext, useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';

import { LogoutLink } from './LogoutLink';
import { useLatestRequest } from '../hooks/use-latest-request';

export type World = {
  id: string,
  name: string,
  status: string,
};

type Worlds = World[];

const WorldContext = createContext<Worlds | null>(null);

export const useWorldContext = () => useContext(WorldContext);

export const Worlds = () => {
  const useWrapped = useLatestRequest<Worlds>('/api/v1/worlds');
  const { data: worlds } = useWrapped();

  return (
    <WorldContext.Provider value={worlds}>
      <nav>
        <ul className="navigation-list">
          <li>
            <Link to="/">back</Link>
          </li>
          <li>
            <LogoutLink />
          </li>
        </ul>
      </nav>
      <article>
        <h2>worlds</h2>
        <table>
          <thead>
            <tr>
              <td>id</td>
              <td>name</td>
              <td>status</td>
            </tr>
          </thead>
          <tbody>
            {worlds && worlds.map(({ id, name, status }) => {
              return (
                <tr key={`${id}-${name}`}>
                  <td>{id}</td>
                  <td><Link to={`${id}`}>{name}</Link></td>
                  <td>{status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </article>
      <Outlet />
    </WorldContext.Provider>
  );
};
