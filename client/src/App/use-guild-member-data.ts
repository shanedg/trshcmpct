import axios from 'axios';
import { useEffect, useState } from 'react';

import type { APIGuildMember } from 'discord-api-types/v10';

/**
 * Custom hook for fetching guild membership data from the authorized endpoint
 * @returns APIGuildMember | undefined
 */
export const useGuildMemberData = () => {
  console.log('using guild member data!');
  const [guildMember, setGuildMember] = useState<APIGuildMember>();

  useEffect(() => {
    console.log('effect body');
    axios.get<APIGuildMember>('/api/v1/authorized', { baseURL: 'http://localhost:53134' })
      .then(response => setGuildMember(response.data))
      .catch(reason => {
        throw new Error(
          'Something went wrong fetching guild membership data',
          { cause: reason }
        );
      });
  }, []);

  return guildMember;
};
