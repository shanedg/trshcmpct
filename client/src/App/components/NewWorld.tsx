import React from 'react';
import { Link } from 'react-router';

import { LogoutLink } from './LogoutLink';

export const NewWorld = () => {
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
        <h2>new</h2>
        <form action="/api/v1/launch" method="post">
          <label htmlFor="label">name</label>
          <input
            defaultValue=""
            name="name"
            placeholder="name"
            type="text"
          />
          <button type="submit">create</button>
        </form>
      </article>
    </>
  );
};
