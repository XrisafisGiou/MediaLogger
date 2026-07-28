import igdbService from "../services/igdbService.js";

export async function searchGames(req, res) {
  const games = await igdbService.searchGames(
    req.query.query,
  );

  return res.json(games);
}

export async function getGameDetails(req, res) {
  const game = await igdbService.getGameDetails(
    req.params.id,
  );

  return res.json(game);
}

export async function getGameImages(req, res) {
  const images = await igdbService.getGameImages(
    req.params.id,
  );

  return res.json(images);
}