import { getFetchWithOauth } from '../utils';

/**
 * Function that creates a handler for checking guild membership
 * @param {Function} fetch
 * @param {string} guildId
 * @returns Handler to check membership in a guild
 */
export const createGetGuildMembership = (fetch, guildId) => {
  return async (request, response, next) => {
    if (request.session.oauth && request.session.oauth.access_token) {
      const fetchWithOauth = getFetchWithOauth(fetch, request.session.oauth);

      let guildMembershipData;
      try {
        // https://discord.com/developers/docs/resources/user#get-current-user-guild-member
        const guildMembershipRequest = await fetchWithOauth(`https://discord.com/api/users/@me/guilds/${guildId}/member`);
        guildMembershipData = await guildMembershipRequest.json();
      } catch (e) {
        request.log.error(`problem reaching discord api: ${e}`);
        next();
        return;
      }

      if (guildMembershipData.user) {
        request.log.debug('authorized guild member');
        response.send(guildMembershipData);
        return;
      }

      // Not a member, response: { message: 'Unknown Guild', code: 10004 }
      if (guildMembershipData.message && guildMembershipData.message === 'Unknown Guild') {
        request.log.debug('not an authorized guild member');
        response.sendStatus(403);
        return;
      }

      request.log.error(`unknown membership response: ${guildMembershipData}`);
      next();
      return;
    }

    request.log.error('missing authentication');
    next();
  };
};
