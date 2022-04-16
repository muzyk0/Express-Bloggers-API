import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";
import { runDB } from "./domain/db";
import { bloggersService } from "./domain/bloggersService";
import { bloggersRouter } from "./routes/bloggers-route";
import { postsRoute } from "./routes/posts-route";
const PORT = process.env.PORT ?? 5000;

/**
 * This is base URL for API.
 * @use "/api"
 */
const BASE_URL = "";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(`${BASE_URL}/bloggers`, bloggersRouter);
app.use(`${BASE_URL}/posts`, postsRoute);

app.listen(PORT, async () => {
    await runDB();
    console.log(`Example app listening on port ${PORT}`);
});
