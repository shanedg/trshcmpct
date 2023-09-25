/**
 * Middleware handler for responding to requests for guild membership data
 * @param {express.Request} request
 * @param {express.Response} response
 */
export const handleGetGuildMembership = (request, response) => {
  request.log.debug('send guild membership data');
  response.send(request.session.guildMembershipData);
};
