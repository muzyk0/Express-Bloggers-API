import cors from "cors";
import "dotenv/config";
import express from "express";
import { CheckBodyIsEmpty } from "./middlewares/CheckBodyEmpty";
import { runDB } from "./respositories/db";
import { bloggersRouter } from "./routes/bloggers-route";
import { postsRoute } from "./routes/posts-route";
const PORT = process.env.PORT ?? 5000;

/**
 * This is base URL for API.
 * @use "/api"
 */
const BASE_URL = process.env.BASE_URL ?? "";

try {
    (async () => {
        const app = express();
        app.use(cors());
        app.use(express.json());

        app.use(CheckBodyIsEmpty);
        app.use(`${BASE_URL}/bloggers`, bloggersRouter);
        app.use(`${BASE_URL}/posts`, postsRoute);

        app.listen(PORT, async () => {
            await runDB();
            console.log(`Example app listening on port ${PORT}`);
        });
    })();
} catch (error) {
    console.error(error);
}
