import axios from 'axios';
import { useEffect, useState } from 'react';

import type { APIGuildMember } from 'discord-api-types/v10';

const cache = {} as { guildMember?: APIGuildMember };
let isFetching = false;

/**
 * Custom hook for fetching guild membership data from the authorized endpoint
 * Caches the returned membership data for the length of the current session
 * @returns APIGuildMember | undefined
 */
export const useGuildMemberData = () => {
  const [guildMember, setGuildMember] = useState<APIGuildMember>();

  useEffect(() => {
    // Avoid triggering duplicate fetch requests between renders
    if (isFetching) {
      return;
    }

    isFetching = true;

    if (cache.guildMember) {
      setGuildMember(cache.guildMember);
      isFetching = false;
      return;
    }

    axios.get<APIGuildMember>('/api/v1/authorized')
      .then(response => {
        cache.guildMember = response.data;
        setGuildMember(response.data);
        isFetching = false;
      })
      .catch((cause: unknown) => {
        isFetching = false;
        throw new Error(
          'Something went wrong fetching guild membership data',
          { cause }
        );
      });
  }, []);

  return guildMember;
};
