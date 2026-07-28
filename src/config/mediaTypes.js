const mediaTypes = {
  movie: {
    key: "movie",
    label: "Movie",
    notFoundMessage: "Movie not found!",
    validation: {
      requiredFields: ["tmdbMovieId", "status"],
      requiredMessage: "tmdbMovieId and status are required",
      validateStatus: false,
    },
    prisma: {
      mediaModel: "movie",
      userMediaModel: "userMovie",
      relationField: "movie",
      foreignKeyField: "movieId",
      externalIdField: "tmdbMovieId",
      displayNameField: "title",
      compositeKey: "userId_movieId",
      includeOnWrite: false,
    },
    tmdb: {
      resource: "movie",
      creditsResource: "credits",
      errorLabel: "movie",
      errorPluralLabel: "movies",
    },
  },
  tvShow: {
    key: "tvShow",
    label: "TV show",
    notFoundMessage: "TV show not found",
    validation: {
      requiredFields: ["tmdbTvShowId", "name", "status"],
      requiredMessage: "tmdbTvShowId, name and status are required",
      validateStatus: true,
    },
    prisma: {
      mediaModel: "tvShow",
      userMediaModel: "userTvShow",
      relationField: "tvShow",
      foreignKeyField: "tvShowId",
      externalIdField: "tmdbTvShowId",
      displayNameField: "name",
      compositeKey: "userId_tvShowId",
      includeOnWrite: true,
    },
    tmdb: {
      resource: "tv",
      creditsResource: "aggregate_credits",
      errorLabel: "TV show",
      errorPluralLabel: "TV shows",
    },
  },
};

export const MEDIA_TYPES = Object.freeze(
  Object.fromEntries(
    Object.entries(mediaTypes).map(([key, value]) => [
      key,
      Object.freeze({
        ...value,
        validation: Object.freeze(value.validation),
        prisma: Object.freeze(value.prisma),
        tmdb: Object.freeze(value.tmdb),
      }),
    ]),
  ),
);

export function getMediaType(mediaType) {
  const config =
    typeof mediaType === "string" ? MEDIA_TYPES[mediaType] : mediaType;

  if (!config) {
    throw new TypeError(`Unsupported media type: ${mediaType}`);
  }

  return config;
}
