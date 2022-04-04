import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";
const PORT = process.env.PORT ?? 5000;

/**
 * This is base URL for API.
 * @use "/api"
 */
const BASE_URL = "";

const app = express();
app.use(cors());
app.use(bodyParser.json());

interface Blogger {
    id: number;
    name: string;
    youtubeUrl: string;
}
interface Post {
    id: number;
    title: string;
    shortDescription: string;
    content: string;
    bloggerId: Blogger["id"];
    bloggerName: Blogger["name"];
}

//=================================================================================

interface ErrorMessage {
    message: string;
    field: string;
}

interface ResponseType {
    errorsMessages: ErrorMessage[];
}

/**
 * Функция возвращает массив ошибок.
 * @param errors
 * @returns
 */
const setErrors = (errors: ErrorMessage[]): ResponseType => {
    return {
        errorsMessages: errors,
    };
};

//=================================================================================

const mockBloggers: Blogger[] = [
    {
        id: 1,
        name: "Dimych",
        youtubeUrl: "https://www.youtube.com/c/ITKAMASUTRA",
    },
    {
        id: 2,
        name: "Muzyk0",
        youtubeUrl: "https://www.youtube.com/channel/UCcZ18YvVGS7tllvrxN5IAAQ",
    },
];
let mockPosts: Post[] = [
    {
        id: 1,
        title: "Kak stat back-end programetom",
        bloggerId: 1,
        bloggerName: "Dimych",
        content: "Yo krutoe Video Skoro budet",
        shortDescription: "No description",
    },
    {
        id: 2,
        title: "Hello world",
        bloggerId: 1,
        bloggerName: "Dimych",
        content: "This is new hello world app",
        shortDescription: "No description",
    },
    {
        id: 3,
        title: "I'm coded this program a day ago.",
        bloggerId: 2,
        bloggerName: "Muzyk0",
        content: "Very good program",
        shortDescription: "No description",
    },
];

//=================================================================================
// Bloggers

app.get(`${BASE_URL}/bloggers`, (req: Request, res: Response) => {
    res.status(200).send(mockBloggers);
});
app.post(
    `${BASE_URL}/bloggers`,
    (
        req: Request<{}, {}, { name: string; youtubeUrl: string }>,
        res: Response
    ) => {
        const { name, youtubeUrl } = req.body;

        if (name.length <= 0) {
            res.status(400).send(
                setErrors([
                    {
                        field: "name",
                        message: `The field cannot be empty`,
                    },
                ])
            );
            return;
        }

        if (youtubeUrl.length <= 0) {
            res.status(400).send(
                setErrors([
                    {
                        field: "youtubeUrl",
                        message: `The field cannot be empty`,
                    },
                ])
            );
            return;
        }

        const regExpString =
            "https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$";
        const checkHttpLinkRegex = new RegExp(regExpString);

        if (!youtubeUrl.match(checkHttpLinkRegex)) {
            res.status(400).send(
                setErrors([
                    {
                        field: "youtubeUrl",
                        message: `The field must match the regular expression ${regExpString}`,
                    },
                ])
            );
            console.log("Yo");

            // return;
        }
        console.log("Yo 2");
        const newBlogger = { id: +new Date(), name, youtubeUrl };
        mockBloggers.push(newBlogger);
        res.status(200).send(newBlogger);
    }
);
app.get(
    `${BASE_URL}/bloggers/:id`,
    (req: Request<{ id: string }>, res: Response) => {
        const id = parseInt(req.params.id);

        if (isNaN(id) || id <= 0) {
            res.status(400).send(
                setErrors([
                    {
                        field: "id",
                        message: `In URI params cannot be empty`,
                    },
                ])
            );
            return;
        }

        const blogger = mockBloggers.find((blogger) => blogger.id === id);

        if (blogger === undefined) {
            res.status(400).send(
                setErrors([
                    {
                        field: "",
                        message: `Blogger doesn't exist`,
                    },
                ])
            );
            return;
        }

        res.status(200).send(blogger);
    }
);
app.put(
    `${BASE_URL}/bloggers/:id`,
    (
        req: Request<{ id: string }, {}, { name: string; youtubeUrl: string }>,
        res: Response
    ) => {
        const { name, youtubeUrl } = req.body;
        const id = parseInt(req.params.id);

        if (name.length <= 0) {
            res.status(400).send(
                setErrors([
                    {
                        field: "name",
                        message: `The field cannot be empty`,
                    },
                ])
            );
            return;
        }

        if (youtubeUrl.length <= 0) {
            res.status(400).send(
                setErrors([
                    {
                        field: "youtubeUrl",
                        message: `The field cannot be empty`,
                    },
                ])
            );
            return;
        }

        const blogger = mockBloggers.find((blogger) => blogger.id === id);

        if (blogger === undefined) {
            res.status(400).send(
                setErrors([
                    {
                        field: "",
                        message: `Blogger doesn't exist`,
                    },
                ])
            );
            return;
        }

        blogger.name = name;
        blogger.youtubeUrl = youtubeUrl;

        res.status(200).send(blogger);
    }
);
app.delete(
    `${BASE_URL}/bloggers/:id`,
    (req: Request<{ id: string }>, res: Response) => {
        const id = parseInt(req.params.id);

        if (isNaN(id) || id <= 0) {
            res.status(400).send(
                setErrors([
                    {
                        field: "id",
                        message: `In URI params cannot be empty`,
                    },
                ])
            );
            return;
        }

        const bloggerIndex = mockBloggers.findIndex(
            (blogger) => blogger.id === id
        );

        if (bloggerIndex < 0) {
            res.status(400).send(
                setErrors([
                    {
                        field: "",
                        message: `Blogger doesn't exist`,
                    },
                ])
            );
            return;
        }

        mockBloggers.splice(bloggerIndex, 1);

        mockPosts = mockPosts.filter((post) => post.bloggerId !== id);

        res.sendStatus(204);
    }
);

//=================================================================================
// Posts

app.get(`${BASE_URL}/posts`, (req: Request, res: Response) => {
    res.status(200).send(mockPosts);
});
app.post(
    `${BASE_URL}/posts`,
    (
        req: Request<
            {},
            {},
            {
                title: string;
                shortDescription: string;
                content: string;
                bloggerId: number;
            }
        >,
        res: Response
    ) => {
        const { title, bloggerId, content, shortDescription } = req.body;

        if (title.length <= 0) {
            res.status(400).send(
                setErrors([
                    {
                        field: "title",
                        message: `The field cannot be empty`,
                    },
                ])
            );
            return;
        }

        if (bloggerId <= 0) {
            res.status(400).send(
                setErrors([
                    {
                        field: "bloggerId",
                        message: `The field cannot be not number`,
                    },
                ])
            );
            return;
        }

        if (typeof content !== "string") {
            res.status(400).send(
                setErrors([
                    {
                        field: "content",
                        message: `The field cannot be not string`,
                    },
                ])
            );
            return;
        }

        if (typeof shortDescription !== "string") {
            res.status(400).send(
                setErrors([
                    {
                        field: "shortDescription",
                        message: `The field cannot be not string`,
                    },
                ])
            );
            return;
        }

        const blogger = mockBloggers.find(
            (blogger) => blogger.id === bloggerId
        );

        if (!blogger) {
            res.status(400).send(
                setErrors([
                    {
                        field: "",
                        message: `Blogger doesn't exist`,
                    },
                ])
            );
            return;
        }

        const newPost: Post = {
            id: +new Date(),
            title,
            bloggerId,
            bloggerName: blogger.name,
            content,
            shortDescription,
        };

        mockPosts.push(newPost);

        res.status(200).send(newPost);
    }
);
app.get(
    `${BASE_URL}/posts/:id`,
    (req: Request<{ id: string }>, res: Response) => {
        const id = parseInt(req.params.id);

        if (isNaN(id) || id <= 0) {
            res.status(400).send(
                setErrors([
                    {
                        field: "id",
                        message: `In URI params cannot be empty`,
                    },
                ])
            );
            return;
        }

        const blogger = mockPosts.find((blogger) => blogger.id === id);

        if (blogger === undefined) {
            res.status(400).send(
                setErrors([
                    {
                        field: "",
                        message: `Blogger doesn't exist`,
                    },
                ])
            );
        }

        res.status(200).send(blogger);
    }
);
app.put(
    `${BASE_URL}/posts/:id`,
    (
        req: Request<
            { id: string },
            {},
            {
                title: string;
                shortDescription: string;
                content: string;
                bloggerId: number;
            }
        >,
        res: Response
    ) => {
        const { title, bloggerId, content, shortDescription } = req.body;
        const id = parseInt(req.params.id);

        if (isNaN(id) || id <= 0) {
            res.status(400).send(
                setErrors([
                    {
                        field: "id",
                        message: `In URI params cannot be empty`,
                    },
                ])
            );
            return;
        }

        if (title.length <= 0) {
            res.status(400).send(
                setErrors([
                    {
                        field: "title",
                        message: `The field cannot be empty`,
                    },
                ])
            );
            return;
        }
        if (bloggerId <= 0) {
            res.status(400).send(
                setErrors([
                    {
                        field: "bloggerId",
                        message: `The field cannot be not number`,
                    },
                ])
            );
            return;
        }
        if (typeof content !== "string") {
            res.status(400).send(
                setErrors([
                    {
                        field: "content",
                        message: `The field cannot be not string`,
                    },
                ])
            );
            return;
        }
        if (typeof shortDescription !== "string") {
            res.status(400).send(
                setErrors([
                    {
                        field: "shortDescription",
                        message: `The field cannot be not string`,
                    },
                ])
            );
            return;
        }

        const post = mockPosts.find((post) => post.id === id);

        if (post === undefined) {
            res.status(400).send(
                setErrors([
                    {
                        field: "post",
                        message: `post doesn't exist`,
                    },
                ])
            );
            return;
        }

        const blogger = mockBloggers.find(
            (blogger) => blogger.id === bloggerId
        );

        if (!blogger) {
            res.status(400).send(
                setErrors([
                    {
                        field: "",
                        message: `Blogger doesn't exist`,
                    },
                ])
            );
            return;
        }

        post.title = title;
        post.shortDescription = shortDescription;
        post.content = content;
        post.bloggerId = bloggerId;
        post.bloggerName = blogger.name;

        res.status(200).send(post);
    }
);
app.delete(
    `${BASE_URL}/posts/:id`,
    (req: Request<{ id: string }>, res: Response) => {
        const id = parseInt(req.params.id);

        if (isNaN(id) || id <= 0) {
            res.status(400).send(
                setErrors([
                    {
                        field: "id",
                        message: `In URI params cannot be empty`,
                    },
                ])
            );
            return;
        }

        const bloggerIndex = mockPosts.findIndex(
            (blogger) => blogger.id === id
        );

        if (bloggerIndex < 0) {
            res.status(400).send(
                setErrors([
                    {
                        field: "",
                        message: `Blogger doesn't exist`,
                    },
                ])
            );
            return;
        }

        mockPosts.splice(bloggerIndex, 1);

        res.sendStatus(204);
    }
);

//=================================================================================

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
