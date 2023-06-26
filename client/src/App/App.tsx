import React, { StrictMode } from 'react';

import { Nav } from './Nav';
import { useGuildMemberData } from './use-guild-member-data';
import { Welcome } from './Welcome';

type GuildUserData = ReturnType<typeof useGuildMemberData>

const getWelcomeMessage = (guildUser: GuildUserData) => {
  const welcome = 'welcome to the trash compactor';

  if (guildUser?.user?.username) {
    return `${welcome}, ${guildUser.user.username}`;
  }

  return `${welcome}, <unknown>`;
};

const App = () => {
  const guildUser = useGuildMemberData();

  return (
    <StrictMode>
      <h1>trshcmpctr</h1>
      {guildUser ?
        <Welcome message={getWelcomeMessage(guildUser)} /> :
        <p>loading ...</p>
      }
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
