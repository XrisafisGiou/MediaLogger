import { MEDIA_TYPES } from "../config/mediaTypes.js";
import prisma from "../lib/prisma.js";
import { MediaService } from "./mediaService.js";

export class BookService extends MediaService {
  constructor(prismaClient = prisma) {
    super(MEDIA_TYPES.book, prismaClient);
  }

  addBook(...args) {
    return this.add(...args);
  }

  getBooks(...args) {
    return this.getAll(...args);
  }

  updateBook(...args) {
    return this.update(...args);
  }

  deleteBook(...args) {
    return this.delete(...args);
  }

  getBookStatus(...args) {
    return this.getStatus(...args);
  }
}

export default new BookService();