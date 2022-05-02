import cors from "cors";
import "dotenv/config";
import express from "express";
import { BASE_URL, PORT } from "./constants";
import { CheckBodyIsEmpty } from "./middlewares/CheckBodyEmpty";
import { bloggersRouter } from "./routes/bloggers-route";
import { postsRoute } from "./routes/posts-route";
import { usersRoute } from "./routes/users-route";

export const app = express();

try {
    (async () => {
        app.use(cors());
        app.use(express.json());

        app.use(CheckBodyIsEmpty);
        app.use(`${BASE_URL}/bloggers`, bloggersRouter);
        app.use(`${BASE_URL}/posts`, postsRoute);
        app.use(`${BASE_URL}/users`, usersRoute);
    })();
} catch (error) {
    console.error(error);
}
