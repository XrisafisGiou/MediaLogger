/*
  Warnings:

  - You are about to drop the column `title` on the `TvShow` table. All the data in the column will be lost.
  - Added the required column `name` to the `TvShow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TvShow" DROP COLUMN "title",
ADD COLUMN     "name" TEXT NOT NULL;
