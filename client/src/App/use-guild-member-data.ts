import axios from 'axios';
import { useEffect, useState } from 'react';

import type { APIGuildMember } from 'discord-api-types/v10';

/**
 * Custom hook for fetching guild membership data from the authorized endpoint
 * @returns APIGuildMember | undefined
 */
export const useGuildMemberData = () => {
  const [guildMember, setGuildMember] = useState<APIGuildMember>();

  useEffect(() => {
    axios.get<APIGuildMember>('/api/v1/authorized')
      .then(response => setGuildMember(response.data))
      .catch((cause: unknown) => {
        throw new Error(
          'Something went wrong fetching guild membership data',
          { cause }
        );
      });
  }, []);

  return guildMember;
};
