import { type APIGuildMember } from 'discord-api-types/v10';
import React from 'react';
import { Link } from 'react-router-dom';

import { LoadingContent } from './LoadingContent';
import { Welcome } from './Welcome';
import { useRequest } from '../hooks/use-request';

const getWelcomeMessage = (guildUser: APIGuildMember) => {
  const welcome = 'welcome to the trash compactor';

  if (guildUser?.user?.username) {
    return `${welcome}, ${guildUser.user.username}`;
  }

  return `${welcome}, <unknown>`;
};

/**
 * The home page
 */
export const Home = () => {
  const useAuthorizedGuildMemberData = useRequest<APIGuildMember>('/api/v1/authorized');
  const { data: guildUser } = useAuthorizedGuildMemberData();

  if (guildUser) {
    return (
      <>
        <nav>
          <ul className="navigation-list">
            <li>
              <Link to="/new">new</Link>
            </li>
            <li>
              <Link to="/worlds">worlds</Link>
            </li>
          </ul>
        </nav>
        <article>
          <h2>home</h2>
          <Welcome message={getWelcomeMessage(guildUser)} />
        </article>
      </>
    );
  }

  return (<LoadingContent />);
};
