import { randomUUID } from 'node:crypto';

/**
 * Handle a request to launch a new world
 * @param {Low} db lowdb database
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
export const handleLaunchNew = async (db, request, response, next) => {
  const id = randomUUID();
  try {
    await db.update(({ worlds }) => {
      worlds.push({
        id,
        name: request.body.name,
        status: 'pending',
      });
    });
  } catch (e) {
    return next(e);
  }
  return response
    // 202 Accepted
    .status(202)
    .redirect(`/worlds/${id}`);
};
