import React from 'react';
import { Link } from 'react-router-dom';

export const NewWorld = () => {
  return (
    <>
      <nav>
        <ul className="navigation-list">
          <li>
            <Link to="/">back</Link>
          </li>
        </ul>
      </nav>
      <article>
        <h2>new</h2>
        <form>
          <label htmlFor="version">version</label>
          <select name="version">
            <option>1.20.1</option>
          </select>
          <label htmlFor="name">name</label>
          <input name="name" />
          <button>create</button>
        </form>
      </article>
    </>
  );
};
