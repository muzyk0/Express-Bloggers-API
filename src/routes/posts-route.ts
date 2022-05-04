import express, { Request, Response } from "express";
import { postsService } from "../domain/postsService";
import { Post } from "../entity/Post";
import { setErrors } from "../lib/ValidationErrors";
import { Paginator } from "../lib/Paginator";
import { bloggersService } from "../domain/bloggersService";

export const postsRoute = express.Router();

postsRoute
    .get("/", async (req: Request, res: Response) => {
        const paginatorValues = new Paginator(req.query);

        const paginatorValidateErrors = await Paginator.validate(
            paginatorValues
        );

        if (paginatorValidateErrors) {
            return res.status(400).send(paginatorValidateErrors);
        }

        const posts = await postsService.findPosts(
            { searchNameTerm: paginatorValues.searchNameTerm },
            {
                pageNumber: paginatorValues.pageNumber,
                pageSize: 100,
            }
        );
        res.status(200).send(posts.items);
    })
    .get("/:id", async (req: Request<{ id: string }>, res: Response) => {
        const id = parseInt(req.params.id);

        {
            const postValidation = new Post();

            postValidation.id = id;

            const errors = await Post.validate(postValidation);

            if (errors) {
                res.status(400).send(errors);
                return;
            }
        }

        const post = await postsService.findPostById(id);

        if (!post) {
            res.status(404).send(
                setErrors([
                    {
                        field: "",
                        message: `Post doesn't exist`,
                    },
                ])
            );
            return;
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

            {
                const postValidation = new Post();

                postValidation.title = title?.trim();
                postValidation.bloggerId = bloggerId;
                postValidation.content = content?.trim();
                postValidation.shortDescription = shortDescription;

                const errors = await Post.validate(postValidation);

                if (errors) {
                    res.status(400).send(errors);
                    return;
                }
            }

            const blogger = await bloggersService.findBloggerById(bloggerId);

            if (!blogger) {
                res.status(400).send(
                    setErrors([
                        {
                            field: "bloggerId",
                            message: `Blogger doesn't exist`,
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
                            message: `Post doesn't created`,
                        },
                    ])
                );
                return;
            }

            res.status(201).send(newPost);
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

            {
                const postValidation = new Post();

                postValidation.id = id;
                postValidation.title = title?.trim();
                postValidation.bloggerId = bloggerId;
                postValidation.content = content?.trim();
                postValidation.shortDescription = shortDescription;

                const errors = await Post.validate(postValidation);

                if (errors) {
                    res.status(400).send(errors);
                    return;
                }
            }

            const blogger = await bloggersService.findBloggerById(bloggerId);

            if (!blogger) {
                res.status(400).send(
                    setErrors([
                        {
                            field: "bloggerId",
                            message: `Blogger doesn't exist`,
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
                res.status(404).send(
                    setErrors([
                        {
                            field: "",
                            message: `Post doesn't updated`,
                        },
                    ])
                );
                return;
            }

            res.status(204).send(post);
        }
    )
    .delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
        const id = parseInt(req.params.id);

        {
            const postValidation = new Post();

            postValidation.id = id;

            const errors = await Post.validate(postValidation);

            if (errors) {
                res.status(400).send(errors);
                return;
            }
        }

        const isDeleted = await postsService.deletePost(id);

        if (!isDeleted) {
            res.status(404).send(
                setErrors([
                    {
                        field: "",
                        message: `Post doesn't deleted`,
                    },
                ])
            );
            return;
        }

        res.sendStatus(204);
    });
