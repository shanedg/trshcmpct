/**
 * Handle a request to launch an existing world
 * @param {Low} db lowdb database
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
export const handleLaunchExisting = async (db, request, response, next) => {
  const id = request.params.id;
  if (!id) {
    return next('missing id param');
  }
  try {
    await db.update(({ worlds }) => {
      const found = worlds.find(world => world.id === id);
      if (found) {
        found.state = 'pending';
        return response
          // 202 Accepted
          .status(202)
          .redirect(`/worlds/${id}`);
      }
      return response
        .status(404)
        .redirect('/worlds');
    });
  } catch (e) {
    return next(e);
  }
};
