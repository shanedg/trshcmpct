import React from 'react';
import { Link, Outlet } from 'react-router-dom';

import { LogoutLink } from './LogoutLink';
import { useLatestRequest } from '../hooks/use-latest-request';

type World = {
  id: number,
  label: string,
  version: string,
  createdAt: string,
  lastOnline: string,
  createdBy: string,
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
              <td>name</td>
              <td>version</td>
              <td>created</td>
              <td>last online</td>
              <td>created by</td>
            </tr>
          </thead>
          <tbody>
            {worlds && worlds.map(({ id, label, version, createdAt, createdBy, lastOnline }) => {
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
      </article>
      <Outlet />
    </>
  );
};
