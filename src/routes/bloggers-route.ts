import express, { Request, Response } from "express";
import { bloggersService } from "../domain/bloggersService";
import { Blogger } from "../entity/Blogger";
import { setErrors } from "../lib/ValidationErrors";
import { Paginator } from "../lib/Paginator";
import { postsService } from "../domain/postsService";
import { Post } from "../entity/Post";
import { isAuthWithBase } from "../middlewares/isAuthWithBase";

export const bloggersRouter = express.Router();

bloggersRouter
    .get(`/`, async (req: Request, res: Response) => {
        const paginatorValues = new Paginator(req.query);

        const paginatorValidateErrors = await Paginator.validate(
            paginatorValues
        );

        if (paginatorValidateErrors) {
            return res.status(400).send(paginatorValidateErrors);
        }

        const bloggers = await bloggersService.findBloggers(
            paginatorValues.searchNameTerm,
            {
                pageNumber: paginatorValues.pageNumber,
                pageSize: 100,
            }
        );
        res.status(200).send(bloggers.items);
    })
    .get("/:id", async (req: Request<{ id: string }>, res: Response) => {
        const id = parseInt(req.params.id);

        const bloggerForValidation = new Blogger();

        bloggerForValidation.id = id;

        const errors = await Blogger.validate(bloggerForValidation);

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        const blogger = await bloggersService.findBloggerById(id);

        if (!blogger) {
            res.status(404).send(
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
    })
    .get(`/:id/posts`, async (req: Request, res: Response) => {
        const { searchNameTerm, pageNumber, pageSize } = new Paginator(
            req.query
        );

        const bloggerId = Number(req.params.id);

        const postValidator = new Post();

        postValidator.bloggerId === bloggerId;

        const errors = await Post.validate(postValidator);

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        const bloggers = await postsService.findPosts(
            { searchNameTerm, bloggerId },
            {
                pageNumber: pageNumber,
                pageSize: pageSize,
            }
        );
        res.status(200).send(bloggers);
    })
    .post(
        "/",
        isAuthWithBase,
        async (
            req: Request<{}, {}, { name: string; youtubeUrl: string }>,
            res: Response
        ) => {
            const { name, youtubeUrl } = req.body;

            let blogger = new Blogger();

            blogger.name = name?.trim();
            blogger.youtubeUrl = youtubeUrl;

            const errors = await Blogger.validate(blogger);

            if (errors) {
                res.status(400).send(errors);
                return;
            }

            const newBlogger = await bloggersService.createBlogger(
                name,
                youtubeUrl
            );

            res.status(201).send(newBlogger);
        }
    )
    .post(
        "/:bloggerId/posts",
        isAuthWithBase,
        async (
            req: Request<
                { bloggerId: string },
                {},
                {
                    title: string;
                    shortDescription: string;
                    content: string;
                }
            >,
            res: Response
        ) => {
            const { title, content, shortDescription } = req.body;

            const bloggerId = +req.params.bloggerId;

            const postValidation = new Post();

            postValidation.title = title;
            postValidation.bloggerId = bloggerId;
            postValidation.content = content;
            postValidation.shortDescription = shortDescription;

            const errors = await Post.validate(postValidation);

            if (errors) {
                res.status(400).send(errors);
                return;
            }

            try {
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
            } catch (error) {
                res.status(400).send(
                    setErrors([
                        {
                            field: "",
                            message: (error as Error).message,
                        },
                    ])
                );
                return;
            }
        }
    )
    .put(
        "/:id",
        isAuthWithBase,
        async (
            req: Request<
                { id: string },
                {},
                { name: string; youtubeUrl: string }
            >,
            res: Response
        ) => {
            const { name, youtubeUrl } = req.body;
            const id = parseInt(req.params.id);

            {
                let blogger = new Blogger();

                blogger.id = id;
                blogger.name = name?.trim();
                blogger.youtubeUrl = youtubeUrl;

                const errors = await Blogger.validate(blogger);

                if (errors) {
                    res.status(400).send(errors);
                    return;
                }
            }

            const blogger = await bloggersService.updateBlogger(id, {
                name,
                youtubeUrl,
            });

            if (!blogger) {
                res.status(404).send(
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
        }
    )
    .delete(
        "/:id",
        isAuthWithBase,
        async (req: Request<{ id: string }>, res: Response) => {
            const id = parseInt(req.params.id);

            {
                let blogger = new Blogger();

                blogger.id = id;

                const errors = await Blogger.validate(blogger);

                if (errors) {
                    res.status(400).send(errors);
                    return;
                }
            }

            const bloggerIsDeleted = await bloggersService.deleteBlogger(id);

            if (!bloggerIsDeleted) {
                res.status(404).send(
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
        }
    );
