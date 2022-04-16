import express, { Request, Response } from "express";
import { postsService } from "../domain/postsService";
import { setErrors } from "../lib/errorsHelpers";

export const postsRoute = express.Router();

postsRoute
    .get("/", async (req: Request, res: Response) => {
        const posts = await postsService.findPosts();
        res.status(200).send(posts);
    })
    .get("/:id", async (req: Request<{ id: string }>, res: Response) => {
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

        const post = await postsService.findPostById(id);

        if (!post) {
            res.status(400).send(
                setErrors([
                    {
                        field: "",
                        message: `Blogger doesn't exist`,
                    },
                ])
            );
        }

        res.status(200).send(post);
    })
    .post(
        "/",
        async (
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

            const newPost = await postsService.createPost({
                title,
                bloggerId,
                content,
                shortDescription,
            });

            if (!newPost) {
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

            res.status(200).send(newPost);
        }
    )

    .put(
        "/:id",
        async (
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

            const post = await postsService.updatePost({
                id,
                title,
                shortDescription,
                bloggerId,
                content,
            });

            if (!post) {
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

            res.status(200).send(post);
        }
    )
    .delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
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

        const isDeleted = await postsService.deletePost(id);

        if (!isDeleted) {
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

        res.sendStatus(204);
    });
