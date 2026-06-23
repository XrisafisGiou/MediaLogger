import prisma from "../lib/prisma.js";

export async function addMovie(req, res) {
    try {
        const userId = req.user.userId;
        const { tmdbMovieId, title, posterPath, status, isFavorite } = req.body;

        if (!tmdbMovieId || !status) {
            return res.status(400).json({ error: "tmdbMovieId and status are required"});
        }

        //Check if movie exists
        let movie = await prisma.movie.findUnique({
            where: { tmdbMovieId },
        });

        if (!movie) {
            movie = await prisma.movie.create({
                data: {
                    tmdbMovieId,
                    title,
                    posterPath,
                },
            });
        }

        const userMovie = await prisma.userMovie.create({
            data: {
                userId,
                movieId: movie.id,
                status,
                isFavorite: isFavorite ?? false,
            },
        });

        return res.json(userMovie);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error!" });
    }
}

export async function getMovies(req, res) {
    try {
        const movies = await prisma.userMovie.findMany({
        where: { userId: req.user.userId },
        include: {
            movie: true
        }
        });
        res.json(movies);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error!" });
    }
}

export const updateMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const {status, isFavorite} = req.body;

        const movie = await prisma.userMovie.findFirst({
            where: {
                id: Number(id),
                userId: req.user.userId
            }
        });

        if (!movie) {
            return res.status(404).json({
                error: "Movie not found!"
            });
        }

        const updatedMovie = await prisma.userMovie.update({
            where: {
                id: Number(id)
            },
            data: {
                status, isFavorite
            }
        });
        
        res.json(updatedMovie);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error!" });
    }
}

export const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;

        const movie = await prisma.userMovie.findFirst({
            where: {
                id: Number(id),
                userId: req.user.userId
            }
        });

        if (!movie) {
            return res.status(404).json({
                error: "Movie not found!"
            });
        }

        await prisma.userMovie.delete({
            where: {
                id: movie.id,
            }
        });

        res.json({message: "Movie deleted successfully",});
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error!" });
    }
}