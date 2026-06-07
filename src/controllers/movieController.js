import prisma from "../lib/prisma.js";

export async function addMovie(req, res) {
    try {
        const userId = req.user.userId;
        const { tmdbMovieId, status, isFavorite } = req.body;

        if (!tmdbMovieId || !status) {
            return res.status(400).json({ error: "tmdbMovieId and status are required"});
        }

        const movie = await prisma.userMovie.create({
            data: {
                userId,
                tmdbMovieId,
                status,
                isFavorite: isFavorite ?? false
            },
        });
        return res.json(movie);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error!" });
    }
}