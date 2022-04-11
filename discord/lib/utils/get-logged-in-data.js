const {
  batchRequests,
  getGuildById,
} = require('../utils');

/**
 * Get data for logged-in view
 * @param {Function} fetch Fetch implementation
 * @param {Object} data Required data
 * @returns Logged-in template local variables
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
  const guild = Array.isArray(guilds) && getGuildById(guilds, guildId);

  const data = {
    avatar,
    discriminator,
    guild,
    id,
    username,
  };
  return data;
};

module.exports = { getLoggedInData };
