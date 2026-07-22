import {
  NotFoundError,
  ValidationError,
} from "../errors/serviceErrors.js";
import prisma from "../lib/prisma.js";

export class MovieService {
  constructor(prismaClient = prisma) {
    this.prisma = prismaClient;
  }

  async addMovie(userId, movieData) {
    const { tmdbMovieId, title, posterPath, status, isFavorite } = movieData;

    if (!tmdbMovieId || !status) {
      throw new ValidationError("tmdbMovieId and status are required");
    }

    let movie = await this.prisma.movie.findUnique({
      where: { tmdbMovieId },
    });

    if (!movie) {
      movie = await this.prisma.movie.create({
        data: {
          tmdbMovieId,
          title,
          posterPath,
        },
      });
    }

    return this.prisma.userMovie.upsert({
      where: {
        userId_movieId: {
          userId,
          movieId: movie.id,
        },
      },
      update: {
        status,
        isFavorite: isFavorite ?? false,
      },
      create: {
        userId,
        movieId: movie.id,
        status,
        isFavorite: isFavorite ?? false,
      },
    });
  }

  getMovies(userId) {
    return this.prisma.userMovie.findMany({
      where: { userId },
      include: {
        movie: true,
      },
    });
  }

  async updateMovie(userId, id, updates) {
    const userMovieId = Number(id);
    const movie = await this.prisma.userMovie.findFirst({
      where: {
        id: userMovieId,
        userId,
      },
    });

    if (!movie) {
      throw new NotFoundError("Movie not found!");
    }

    const { status, isFavorite } = updates;

    return this.prisma.userMovie.update({
      where: { id: userMovieId },
      data: { status, isFavorite },
    });
  }

  async deleteMovie(userId, id) {
    const movie = await this.prisma.userMovie.findFirst({
      where: {
        id: Number(id),
        userId,
      },
    });

    if (!movie) {
      throw new NotFoundError("Movie not found!");
    }

    await this.prisma.userMovie.delete({
      where: { id: movie.id },
    });

    return { message: "Movie deleted successfully" };
  }

  checkMovie(userId, movieId) {
    return this.prisma.userMovie.findFirst({
      where: {
        userId,
        movieId: Number(movieId),
      },
    });
  }

  async getMovieStatus(userId, tmdbMovieId) {
    const userMovie = await this.prisma.userMovie.findFirst({
      where: {
        userId,
        movie: {
          tmdbMovieId: Number(tmdbMovieId),
        },
      },
    });

    if (!userMovie) {
      return null;
    }

    return {
      id: userMovie.id,
      status: userMovie.status,
      isFavorite: userMovie.isFavorite,
    };
  }
}

export default new MovieService();
