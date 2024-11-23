/**
 * Handle a request for available worlds
 * @param {Low} db lowdb database
 * @param {*} _request
 * @param {*} response
 */
export const handleGetWorlds = (db, _request, response) =>
  response.send(db.data.worlds || []);
