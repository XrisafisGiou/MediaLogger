import openLibraryService from "../services/openLibraryService.js";

export async function searchBooks(req, res) {
  const result =
    await openLibraryService.searchBooks(
      req.query.query,
    );

  return res.json(result);
}

export async function getBookDetails(
  req,
  res,
) {
  const book =
    await openLibraryService.getBookDetails(
      req.params.id,
    );

  return res.json(book);
}

export async function getBookImages(
  req,
  res,
) {
  const images =
    await openLibraryService.getBookImages(
      req.params.id,
    );

  return res.json(images);
}