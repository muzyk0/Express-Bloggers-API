import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { BASE_PREFIX } from './constants';
import { CheckBodyIsEmpty } from './middlewares/CheckBodyEmpty';
import { authRoute } from './routes/auth-route';
import { bloggersRouter } from './routes/bloggers-route';
import { postsRoute } from './routes/posts-route';
import { usersRoute } from './routes/users-route';
import { commentsRoute } from './routes/comments-route';

export const app = express();
app.use(cors());
app.use(express.json());
app.use(CheckBodyIsEmpty);

try {
    (async () => {
        console.log(BASE_PREFIX);
        app.use(`${BASE_PREFIX}/bloggers`, bloggersRouter);
        app.use(`${BASE_PREFIX}/posts`, postsRoute);
        app.use(`${BASE_PREFIX}/users`, usersRoute);
        app.use(`${BASE_PREFIX}/auth`, authRoute);
        app.use(`${BASE_PREFIX}/comments`, commentsRoute);
    })();
} catch (error) {
    console.error(error);
}
