/**
 * Get guild from list by id
 * @param {*} guilds List of guilds
 * @param {string} guildId Id of guild
 * @returns Guild if present, else undefined
 */
export const selectGuildById = (guilds, guildId) => guilds.find(({ id }) => id === guildId);
