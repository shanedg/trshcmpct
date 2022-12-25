import config from '../config.json' assert { type: 'json' };
import { getFetchWithOauth } from '../utils';

const { guildId } = config;

/**
 * Handler to check membership in our guild
 * @param {Object} request
 * @param {Object} response
 * @param {Function} next
 * @returns 
 */
export const getGuildMembership = async (request, response, next) => {
  if (request.session.oauth && request.session.oauth.access_token) {
    const fetchWithOauth = getFetchWithOauth(fetch, request.session.oauth);

    // https://discord.com/developers/docs/resources/user#get-current-user-guild-member
    const guildMembershipRequest = await fetchWithOauth(`https://discord.com/api/users/@me/guilds/${guildId}/member`);
    const guildMembershipData = await guildMembershipRequest.json();

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
  
    request.log.error(`problem checking guild membership: ${guildMembershipData}`);
    next();
    return;
  }

  request.log.error('missing authentication');
  next();
};
