import { batchRequests } from './batch-requests';
import { selectGuildById } from './select-guild-by-id';

/**
 * Get data for authenticated view
 * @param {Function} fetch Fetch implementation
 * @param {Object} data Required data
 * @returns Authenticated template local variables
 */
const getLoggedInData = async (fetch, { guildId }) => {
  const commonEndpointUrls = [
    'https://discord.com/api/users/@me',
    'https://discord.com/api/users/@me/guilds',
    // TODO: alternatively: https://discord.com/developers/docs/resources/user#get-current-user-guild-member
    // requires: guilds.members.read
    // `https://discord.com/api/users/@me/guilds/${guildId}/member`
  ];
  const [user, guilds] = await batchRequests(fetch, commonEndpointUrls);
  const { avatar, discriminator, id, username } = user;

  // Guilds won't be an array if the request fails (rate limited).
  const guild = Array.isArray(guilds) && selectGuildById(guilds, guildId);

  const data = {
    // TODO: avatar can be null
    avatar,
    discriminator,
    // TODO: guild.icon can be null
    guild,
    id,
    username,
  };
  return data;
};

export {
  getLoggedInData,
};
