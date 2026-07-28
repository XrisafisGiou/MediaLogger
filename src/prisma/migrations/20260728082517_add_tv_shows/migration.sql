-- CreateTable
CREATE TABLE "TvShow" (
    "id" SERIAL NOT NULL,
    "tmdbTvShowId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "posterPath" TEXT,

    CONSTRAINT "TvShow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTvShow" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tvShowId" INTEGER NOT NULL,
    "status" "MovieStatus" NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserTvShow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TvShow_tmdbTvShowId_key" ON "TvShow"("tmdbTvShowId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTvShow_userId_tvShowId_key" ON "UserTvShow"("userId", "tvShowId");

-- AddForeignKey
ALTER TABLE "UserTvShow" ADD CONSTRAINT "UserTvShow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTvShow" ADD CONSTRAINT "UserTvShow_tvShowId_fkey" FOREIGN KEY ("tvShowId") REFERENCES "TvShow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
