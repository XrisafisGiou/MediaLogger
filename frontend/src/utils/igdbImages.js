const imageSizes = {
  w342: "t_cover_big",
  w780: "t_screenshot_big",
  original: "t_1080p",
};

export function getIgdbImageUrl(
  imageId,
  size = "w342",
) {
  if (!imageId) {
    return undefined;
  }

  const imageSize = imageSizes[size] || size;

  return `https://images.igdb.com/igdb/image/upload/${imageSize}/${imageId}.jpg`;
}