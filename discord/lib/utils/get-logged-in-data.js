/**
 * Batch custom fetch requests to several urls at once
 * @param {Function} fetch Fetch implementation
 * @param {string[]} urls Endpoints to fetch against
 * @returns List of request results
 */
const batchRequests = async (fetch, urls) => {
  const requests = await Promise.all(urls.map(url => fetch(url)));
  return await Promise.all(requests.map(r => r.json()));
};

/**
 * Get guild from list by id
 * @param {*} guilds List of guilds
 * @param {string} guildId Id of guild
 * @returns Guild if present, else undefined
 */
const selectGuildById = (guilds, guildId) => guilds.find(({ id }) => id === guildId); 
 
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
  const guild = Array.isArray(guilds) && selectGuildById(guilds, guildId);

  const data = {
    avatar,
    discriminator,
    guild,
    id,
    username,
  };
  return data;
};

module.exports = {
  batchRequests,
  getLoggedInData,
  selectGuildById,
};
