import { fetchWithOauth } from '../utils/get-fetch-with-oauth';

/**
 * Middleware handler that ensures a request is authorized
 * by checking for membership in a particular Discord server
 * @param {Function} fetch
 * @param {string} guildId Discord server id
 * @param {express.Request} request
 * @param {express.Response} response
 * @param {express.NextFunction} next
 */
export const requireGuildMembership = async (fetch, guildId, request, response, next) => {
  if (Object.prototype.hasOwnProperty.call(request.session, 'authorized')) {
    if (request.session.authorized) {
      request.log.debug('[session-cache] guild member authorized');
      return next();
    }

    request.log.debug('[session-cache] missing guild membership - 403');
    return response.sendStatus(403);
  }

  try {
    // https://discord.com/developers/docs/resources/user#get-current-user-guild-member
    const guildMembershipRequest = await fetchWithOauth(fetch, request.session.oauth, `https://discord.com/api/v10/users/@me/guilds/${guildId}/member`);
    const guildMembershipData = await guildMembershipRequest.json();

    // Expected not-a-member response: { message: 'Unknown Guild', code: 10004 }
    // But we really only care if the response is missing a value for the `user` key
    if (guildMembershipData.user) {
      request.session.guildMembershipData = guildMembershipData;
      request.session.authorized = true;
      request.log.debug('guild member authorized');
      return next();
    }
  } catch (guildMembershipFetchError) {
    request.log.error(guildMembershipFetchError);
    return next(new Error('unable to check guild membership', { cause: guildMembershipFetchError }));
  }

  // Authenticated but not authorized (not a guild member)
  request.session.authorized = false;

  // 403 Forbidden - "you're not allowed to do that"
  request.log.debug('missing guild membership - 403');
  return response.sendStatus(403);
};
