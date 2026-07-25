export function getTmdbImageUrl(path, size = "w342") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : undefined;
}
