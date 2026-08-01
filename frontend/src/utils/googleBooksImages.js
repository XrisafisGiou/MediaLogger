export function getGoogleBooksImageUrl(url) {
  if (!url) {
    return undefined;
  }

  return String(url).replace(
    /^http:\/\//i,
    "https://",
  );
}