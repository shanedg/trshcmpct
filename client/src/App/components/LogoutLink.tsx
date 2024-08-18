import React from 'react';
import { Link } from 'react-router-dom';

export const LogoutLink = () => {
  return (
    <Link reloadDocument to="/logout">logout</Link>
  );
};
