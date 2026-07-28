export function createMediaController(mediaService) {
  return {
    async add(req, res) {
      const media = await mediaService.add(req.user.userId, req.body);
      return res.json(media);
    },

    async getAll(req, res) {
      const media = await mediaService.getAll(req.user.userId);
      return res.json(media);
    },

    async update(req, res) {
      const media = await mediaService.update(
        req.user.userId,
        req.params.id,
        req.body,
      );
      return res.json(media);
    },

    async delete(req, res) {
      const result = await mediaService.delete(
        req.user.userId,
        req.params.id,
      );
      return res.json(result);
    },

    async check(req, res) {
      const media = await mediaService.check(
        req.user.userId,
        req.params.tmdbId,
      );
      return res.json(media);
    },

    async getStatus(req, res) {
      const status = await mediaService.getStatus(
        req.user.userId,
        req.params.tmdbId,
      );
      return res.json(status);
    },
  };
}
