import React, { StrictMode } from 'react';

import { ClickjackDefense } from './ClickjackDefense';
import { Nav } from './Nav';
import { Welcome } from './Welcome';

const App = () => {
  return (
    <StrictMode>
      <h1>trshcmpctr</h1>
      <ClickjackDefense />
      <Welcome />
      <Nav links={[
        {
          href: '#one',
          label: 'one'
        },
        {
          href: '#two',
        },
        {
          href: '#three',
          label: 'three'
        },
      ]} />
    </StrictMode>
  );
};

export default App;
