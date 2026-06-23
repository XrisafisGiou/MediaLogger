/*
  Warnings:

  - You are about to drop the column `tmdbMovieId` on the `UserMovie` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,movieId]` on the table `UserMovie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `movieId` to the `UserMovie` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserMovie_userId_tmdbMovieId_key";

-- AlterTable
ALTER TABLE "UserMovie" DROP COLUMN "tmdbMovieId",
ADD COLUMN     "movieId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Movie" (
    "id" SERIAL NOT NULL,
    "tmdbMovieId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "posterPath" TEXT,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Movie_tmdbMovieId_key" ON "Movie"("tmdbMovieId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMovie_userId_movieId_key" ON "UserMovie"("userId", "movieId");

-- AddForeignKey
ALTER TABLE "UserMovie" ADD CONSTRAINT "UserMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
