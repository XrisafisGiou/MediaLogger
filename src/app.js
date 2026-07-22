import "dotenv/config";
import express from "express";
import cors from "cors";
import userRouter from "./routes/users.js";
import movieRouter from "./routes/movies.js";
import tmdbRouter from "./routes/tmdb.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hi");
});

app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/tmdb", tmdbRouter);

app.use(errorMiddleware);

export default app;
