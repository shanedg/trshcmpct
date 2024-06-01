import React, { StrictMode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './App.css';

import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { NewWorld } from './components/NewWorld';
import { WorldDetail } from './components/WorldDetail';
import { Worlds } from './components/Worlds';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/worlds',
    element: <Worlds />,
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

export const App = () => {
  return (
    <StrictMode>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          justifyContent: 'space-between',
          padding: '6px 15px 0',
          width: '100vw',
        }}
      >
        <div>
          <Header />
          <RouterProvider router={router} />
        </div>
        <Footer />
      </div>
    </StrictMode>
  );
};
