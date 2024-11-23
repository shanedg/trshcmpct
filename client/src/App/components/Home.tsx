import { type APIGuildMember } from 'discord-api-types/v10';
import React from 'react';
import { Link } from 'react-router-dom';

import { ErrorCard } from './ErrorCard';
import { LoadingContent } from './LoadingContent';
import { LogoutLink } from './LogoutLink';
import { Unauthorized } from './Unauthorized';
import { Welcome } from './Welcome';
import { useLatestRequest } from '../hooks/use-latest-request';

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
  const useAuthorizedGuildMemberData = useLatestRequest<APIGuildMember>('/api/v1/authorized');
  const { data: guildUser, error } = useAuthorizedGuildMemberData();

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
            <li>
              <LogoutLink />
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

  if (error?.message.includes('403')) {
    return <Unauthorized />;
  }

  if (error) {
    return <ErrorCard error={error} />;
  }

  return (<LoadingContent />);
};
