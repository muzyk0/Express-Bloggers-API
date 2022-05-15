import cors from "cors";
import "dotenv/config";
import express from "express";
import { BASE_URL } from "./constants";
import { CheckBodyIsEmpty } from "./middlewares/CheckBodyEmpty";
import { authRoute } from "./routes/auth-route";
import { bloggersRouter } from "./routes/bloggers-route";
import { postsRoute } from "./routes/posts-route";
import { usersRoute } from "./routes/users-route";

export const app = express();
app.use(cors());
app.use(express.json());
app.use(CheckBodyIsEmpty);

try {
    (async () => {
        app.use(`${BASE_URL}/bloggers`, bloggersRouter);
        app.use(`${BASE_URL}/posts`, postsRoute);
        app.use(`${BASE_URL}/users`, usersRoute);
        app.use(`${BASE_URL}/auth`, authRoute);
    })();
} catch (error) {
    console.error(error);
}
