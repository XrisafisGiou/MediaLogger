ALTER TABLE "Book"
RENAME COLUMN "googleBooksId" TO "openLibraryId";

ALTER INDEX "Book_googleBooksId_key"
RENAME TO "Book_openLibraryId_key";