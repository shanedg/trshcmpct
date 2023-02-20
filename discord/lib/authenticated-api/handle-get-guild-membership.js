import { fetchWithOauth } from '../utils/get-fetch-with-oauth';

/**
 * Handler function for responding to requests to check guild membership
 *
 * Express expects handler function signatures with only three parameters
 * where the first parameter is the request object (request, response, next).
 * It's useful to do *partial application* with Function.prototype.bind()
 * to prefill the first two arguments and support the expected signature.
 * e.g.
 * ```
 * // the returned function no longer expects the first two arguments because they are prefilled
 * const boundHandler = handleGetGuildMembership.prototype.bind(null, fetch, guildId)
 * ```
 * @param {Function} fetch
 * @param {string} guildId Discord server id
 * @param {express.Request} request
 * @param {express.Response} response
 * @param {express.NextFunction} next
 */
export const handleGetGuildMembership = async (fetch, guildId, request, response, next) => {
  if (!request.session.oauth || !request.session.oauth.access_token) {
    return next(new Error(`missing authentication: ${JSON.stringify(request.session)}`));
  }

  let guildMembershipData;
  try {
    // https://discord.com/developers/docs/resources/user#get-current-user-guild-member
    const guildMembershipRequest = await fetchWithOauth(fetch, request.session.oauth, `https://discord.com/api/users/@me/guilds/${guildId}/member`);
    guildMembershipData = await guildMembershipRequest.json();
  } catch (guildMembershipFetchError) {
    request.log.error(guildMembershipFetchError);
    return next(new Error('problem reaching discord api', { cause: guildMembershipFetchError }));
  }

  if (guildMembershipData.user) {
    request.log.debug('authorized guild member');
    return response.send(guildMembershipData);
  }

  // Not a member, response: { message: 'Unknown Guild', code: 10004 }
  if (guildMembershipData.message && guildMembershipData.message === 'Unknown Guild') {
    request.log.debug('not an authorized guild member');
    return response.sendStatus(403);
  }

  request.log.error(guildMembershipData);
  next(new Error('unknown membership response', { cause: guildMembershipData }));
};
