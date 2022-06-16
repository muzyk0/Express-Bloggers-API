import { Request, Response } from 'express';
import { Paginator } from '../lib/Paginator';
import { BloggersService } from '../domain/bloggersService';
import { Blogger } from '../entity/Blogger/Blogger';
import { Post } from '../entity/Post';
import { PostsService } from '../domain/postsService';

export class BloggersController {
    constructor(
        private bloggersService: BloggersService,
        private postsService: PostsService
    ) {}

    // .get(`/`)
    async getAllBloggers(req: Request, res: Response) {
        const paginatorValues = new Paginator(req.query);

        const paginatorValidateErrors = await Paginator.validate(
            paginatorValues
        );

        if (paginatorValidateErrors) {
            return res.status(400).send(paginatorValidateErrors);
        }

        const bloggers = await this.bloggersService.findBloggers(
            paginatorValues.SearchNameTerm,
            {
                page: paginatorValues.PageNumber,
                pageSize: paginatorValues.PageSize,
            }
        );
        res.status(200).send(bloggers);
    }

    // .get("/:id")
    async getOneBlogger(req: Request<{ id: string }>, res: Response) {
        const bloggerId = req.params.id;

        const bloggerForValidation = new Blogger();

        bloggerForValidation.id = bloggerId;

        const errors = await Blogger.validate(bloggerForValidation);

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        const blogger = await this.bloggersService.findBloggerById(bloggerId);

        if (!blogger) {
            res.status(404).send(
                Blogger.setErrors([
                    {
                        field: '',
                        message: `Blogger doesn't exist`,
                    },
                ])
            );
            return;
        }

        res.status(200).send(blogger);
    }

    // .get(`/:id/posts`)
    async getBloggerPosts(req: Request, res: Response) {
        const {
            SearchNameTerm: searchNameTerm,
            PageNumber: pageNumber,
            PageSize: pageSize,
        } = new Paginator(req.query);

        const bloggerId = req.params.id;

        const postValidator = new Post();

        postValidator.bloggerId === bloggerId;

        const errors = await Post.validate(postValidator);

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        const blogger = await this.bloggersService.findBloggerById(bloggerId);

        if (!blogger) {
            res.status(404).send(
                Blogger.setErrors([
                    {
                        field: '',
                        message: `Blogger doesn't exist`,
                    },
                ])
            );
            return;
        }

        const posts = await this.postsService.findPosts(
            { searchNameTerm, bloggerId },
            {
                page: pageNumber,
                pageSize: pageSize,
            }
        );
        res.status(200).send(posts);
    }

    // .post("/")
    async createNewBlogger(
        req: Request<{}, {}, { name: string; youtubeUrl: string }>,
        res: Response
    ) {
        const { name, youtubeUrl } = req.body;

        let blogger = new Blogger();

        blogger.name = name?.trim();
        blogger.youtubeUrl = youtubeUrl;

        const errors = await Blogger.validate(blogger);

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        const newBlogger = await this.bloggersService.createBlogger(
            name,
            youtubeUrl
        );

        res.status(201).send(newBlogger);
    }

    async createNewBloggerPost(
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
    ) {
        const { title, content, shortDescription } = req.body;

        const bloggerId = req.params.bloggerId;

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

        const blogger = await this.bloggersService.findBloggerById(bloggerId);

        if (!blogger) {
            res.status(404).send(
                Post.setErrors([
                    {
                        field: 'bloggerId',
                        message: `Blogger doesn't exist`,
                    },
                ])
            );
            return;
        }

        const newPost = await this.postsService.createPost({
            title,
            bloggerId,
            content,
            shortDescription,
        });

        if (!newPost) {
            res.status(400).send(
                Post.setErrors([
                    {
                        field: '',
                        message: `Post doesn't created`,
                    },
                ])
            );
            return;
        }

        res.status(201).send(newPost);
    }

    // .put("/:id")
    async updateBloggerPost(
        req: Request<{ id: string }, {}, { name: string; youtubeUrl: string }>,
        res: Response
    ) {
        const { name, youtubeUrl } = req.body;
        const id = req.params.id;

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

        const blogger = await this.bloggersService.updateBlogger(id, {
            name,
            youtubeUrl,
        });

        if (!blogger) {
            res.status(404).send(
                Blogger.setErrors([
                    {
                        field: '',
                        message: `Blogger doesn't exist`,
                    },
                ])
            );
            return;
        }

        res.sendStatus(204);
    }

    // .delete("/:id")
    async deleteBlogger(req: Request<{ id: string }>, res: Response) {
        const bloggerId = req.params.id;

        {
            let blogger = new Blogger();

            blogger.id = bloggerId;

            const errors = await Blogger.validate(blogger);

            if (errors) {
                res.status(400).send(errors);
                return;
            }
        }

        const bloggerIsDeleted = await this.bloggersService.deleteBlogger(
            bloggerId
        );

        if (!bloggerIsDeleted) {
            res.status(404).send(
                Blogger.setErrors([
                    {
                        field: '',
                        message: `Blogger doesn't exist`,
                    },
                ])
            );
            return;
        }

        res.sendStatus(204);
    }
}
