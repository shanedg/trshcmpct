import React from 'react';
import { Link, Outlet } from 'react-router-dom';

import { LogoutLink } from './LogoutLink';
import { useLatestRequest } from '../hooks/use-latest-request';

export type World = {
  id: string,
  name: string,
  status: string,
};

type Worlds = World[];

export const Worlds = () => {
  const useWrapped = useLatestRequest<Worlds>('/api/v1/worlds');
  const { data: worlds } = useWrapped();

  return (
    <>
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
    </>
  );
};
