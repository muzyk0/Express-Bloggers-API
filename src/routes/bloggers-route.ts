import { validate, ValidationError } from "class-validator";
import express, { Request, Response } from "express";
import { MONGO_URI } from "../constants";
import { bloggersService } from "../domain/bloggersService";
import { ErrorMessage, setErrors } from "../lib/errorsHelpers";
import { Blogger } from "../respositories/bloggersRepository";

export const bloggersRouter = express.Router();

bloggersRouter
    .get(`/`, async (req: Request, res: Response) => {
        const bloggers = await bloggersService.findBloggers();
        res.status(200).send(bloggers);
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

            let blogger = new Blogger();

            blogger.name = name;
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

            {
                let blogger = new Blogger();

                blogger.id = id;
                blogger.name = name;
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

        {
            let blogger = new Blogger();

            blogger.id = id;

            const errors = await Blogger.validate(blogger);

            if (errors) {
                res.status(400).send(errors);
                return;
            }
        }

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
