import { Request, Response } from "express";
import { BloggersService } from "../domain/bloggersService";
import { PostsService } from "../domain/postsService";
import { IBlogger } from "../entity/Blogger";
import { Post } from "../entity/Post";
import { Comment } from "../entity/Comments";
import { Paginator } from "../lib/Paginator";
import { CommentsService } from "../domain/commentsService";

export class PostsController {
    constructor(
        private bloggersService: BloggersService,
        private postsService: PostsService,
        private commentsService: CommentsService
    ) {}

    // .get("/")
    async getAllPosts(req: Request, res: Response) {
        const paginatorValues = new Paginator(req.query);

        const paginatorValidateErrors = await Paginator.validate(
            paginatorValues
        );

        if (paginatorValidateErrors) {
            return res.status(400).send(paginatorValidateErrors);
        }

        const posts = await this.postsService.findPosts(
            { searchNameTerm: paginatorValues.SearchNameTerm },
            {
                page: paginatorValues.PageNumber,
                pageSize: paginatorValues.PageSize,
            }
        );
        res.status(200).send(posts);
    }

    // .get("/:id")
    async getPostById(req: Request<{ id: string }>, res: Response) {
        const postId = req.params.id;

        {
            const postValidation = new Post();

            postValidation.id = postId;

            const errors = await Post.validate(postValidation);

            if (errors) {
                res.status(400).send(errors);
                return;
            }
        }

        const post = await this.postsService.findPostById(postId);

        if (!post) {
            res.status(404).send(
                Post.setErrors([
                    {
                        field: "",
                        message: `Post doesn't exist`,
                    },
                ])
            );
            return;
        }

        res.status(200).send(post);
    }

    // .post("/")
    async createNewPost(
        req: Request<
            {},
            {},
            {
                title: string;
                shortDescription: string;
                content: string;
                bloggerId: IBlogger["id"];
            }
        >,
        res: Response
    ) {
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

        const blogger = await this.bloggersService.findBloggerById(bloggerId);

        if (!blogger) {
            res.status(400).send(
                Post.setErrors([
                    {
                        field: "bloggerId",
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
                        field: "",
                        message: `Post doesn't created`,
                    },
                ])
            );
            return;
        }

        res.status(201).send(newPost);
    }

    // .put("/:id")
    async updatePost(
        req: Request<
            { id: string },
            {},
            {
                title: string;
                shortDescription: string;
                content: string;
                bloggerId: IBlogger["id"];
            }
        >,
        res: Response
    ) {
        const { title, bloggerId, content, shortDescription } = req.body;
        const id = req.params.id;

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

        const blogger = await this.bloggersService.findBloggerById(bloggerId);

        if (!blogger) {
            res.status(400).send(
                Post.setErrors([
                    {
                        field: "bloggerId",
                        message: `Blogger doesn't exist`,
                    },
                ])
            );
            return;
        }

        const post = await this.postsService.updatePost({
            id,
            title,
            shortDescription,
            bloggerId,
            content,
        });

        if (!post) {
            res.status(404).send(
                Post.setErrors([
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

    // .delete("/:id")
    async deleteBlogger(req: Request<{ id: string }>, res: Response) {
        const bloggerId = req.params.id;

        {
            const postValidation = new Post();

            postValidation.id = bloggerId;

            const errors = await Post.validate(postValidation);

            if (errors) {
                res.status(400).send(errors);
                return;
            }
        }

        const isDeleted = await this.postsService.deletePost(bloggerId);

        if (!isDeleted) {
            res.status(404).send(
                Post.setErrors([
                    {
                        field: "",
                        message: `Post doesn't deleted`,
                    },
                ])
            );
            return;
        }

        res.sendStatus(204);
    }

    // .get("/:id/comments")
    async getPostComments(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;

        const postValidation = new Post();

        postValidation.id = id;

        const errors = await Post.validate(postValidation);

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        const paginatorValues = new Paginator(req.query);

        const paginatorValidateErrors = await Paginator.validate(
            paginatorValues
        );

        if (paginatorValidateErrors) {
            return res.status(400).send(paginatorValidateErrors);
        }

        const comments = await this.commentsService.getPostComments(id, {
            page: paginatorValues.PageNumber,
            pageSize: paginatorValues.PageSize,
        });

        if (!comments || comments.items.length === 0) {
            const errors = Post.setErrors([
                { field: "", message: "Comments doesn't exist" },
            ]);
            res.status(404).send(errors);
            return;
        }

        res.status(200).send(comments);
    }

    // .post("/:id/comments")
    async createPostComment(
        req: Request<{ id: string }, {}, { content: string }>,
        res: Response
    ) {
        const { id } = req.params;
        const { content } = req.body;

        const postValidation = new Comment();

        postValidation.id = id;
        postValidation.content = content;

        const errors = await Post.validate(postValidation);

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        const comment = await this.commentsService.createComment({
            postId: id,
            comment: content,
            userId: req.ctx!.userId,
            userLogin: req.ctx!.login,
        });

        if (!comment) {
            const errors = Post.setErrors([
                { field: "", message: "Comment doesn't created" },
            ]);
            res.status(404).send(errors);
            return;
        }

        res.status(200).send(comment);
    }
}
