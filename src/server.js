import "dotenv/config";
import express from "express";
import userRouter from "./routes/users.js";
import movieRouter from "./routes/movies.js";

const app = express();
 
app.use(express.json());

app.get('/', (req,res) =>{
    res.send('hi')
})

app.use("/users",userRouter)
app.use("/movies", movieRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});