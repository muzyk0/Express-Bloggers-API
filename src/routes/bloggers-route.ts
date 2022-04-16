import express, { Request, Response } from "express";
import { MONGO_URI } from "../constants";
import { bloggersService } from "../domain/bloggersService";
import { setErrors } from "../lib/errorsHelpers";

export const bloggersRouter = express.Router();

bloggersRouter
    .get(`/`, async (req: Request, res: Response) => {
        const bloggers = await bloggersService.findBloggers();
        res.status(200).send(bloggers);
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

        const blogger = await bloggersService.findBloggerById(id);

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

        res.status(200).send(blogger);
    })
    .post(
        "/",
        async (
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
                /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/;

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
                return;
            }

            const newBlogger = await bloggersService.createBlogger(
                name,
                youtubeUrl
            );

            res.status(201).send(newBlogger);
        }
    )
    .put(
        "/:id",
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

            const blogger = await bloggersService.updateBlogger(id, {
                name,
                youtubeUrl,
            });

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

            res.status(200).send(blogger);
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

        const bloggerIsDeleted = await bloggersService.deleteBlogger(id, {
            softRemove: true,
        });

        if (!bloggerIsDeleted) {
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
