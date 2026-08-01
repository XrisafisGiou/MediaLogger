import googleBooksService from "../services/googleBooksService.js";

export async function searchBooks(req, res) {
  const result = await googleBooksService.searchBooks(
    req.query.query,
  );

  return res.json(result);
}

export async function getBookDetails(req, res) {
  const book = await googleBooksService.getBookDetails(
    req.params.id,
  );

  return res.json(book);
}

export async function getBookImages(req, res) {
  const images = await googleBooksService.getBookImages(
    req.params.id,
  );

  return res.json(images);
}