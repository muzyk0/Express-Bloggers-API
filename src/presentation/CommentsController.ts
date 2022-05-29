import { Request, Response } from "express";
import { Post } from "../entity/Post";
import { CommentsService } from "../domain/commentsService";
import { Comment } from "../entity/Comments/Comments";

export class CommentsController {
    constructor(
        private commentsService: CommentsService,
    ) {}

    // .get("/:id")
    async getCommentById(req: Request<{ id: string }>, res: Response) {
        const commentId = req.params.id;

        {
            const postValidation = new Comment();

            postValidation.id = commentId;

            const errors = await Post.validate(postValidation);

            if (errors) {
                res.status(400).send(errors);
                return;
            }
        }

        const comment = await this.commentsService.getComment(commentId);

        if (!comment) {
            res.status(404).send(
                Post.setErrors([
                    {
                        field: "",
                        message: `Comment doesn't exist`,
                    },
                ])
            );
            return;
        }

        res.status(200).send(comment);
    }


    // // .put("/:id")
    // async updatePost(
    //     req: Request<
    //         { id: string },
    //         {},
    //         {
    //             title: string;
    //             shortDescription: string;
    //             content: string;
    //             bloggerId: IBlogger["id"];
    //         }
    //     >,
    //     res: Response
    // ) {
    //     const { title, bloggerId, content, shortDescription } = req.body;
    //     const id = req.params.id;
    //
    //     {
    //         const postValidation = new Post();
    //
    //         postValidation.id = id;
    //         postValidation.title = title?.trim();
    //         postValidation.bloggerId = bloggerId;
    //         postValidation.content = content?.trim();
    //         postValidation.shortDescription = shortDescription;
    //
    //         const errors = await Post.validate(postValidation);
    //
    //         if (errors) {
    //             res.status(400).send(errors);
    //             return;
    //         }
    //     }
    //
    //     const blogger = await this.commentsService.findBloggerById(bloggerId);
    //
    //     if (!blogger) {
    //         res.status(400).send(
    //             Post.setErrors([
    //                 {
    //                     field: "bloggerId",
    //                     message: `Blogger doesn't exist`,
    //                 },
    //             ])
    //         );
    //         return;
    //     }
    //
    //     const post = await this.commentsService.updatePost({
    //         id,
    //         title,
    //         shortDescription,
    //         bloggerId,
    //         content,
    //     });
    //
    //     if (!post) {
    //         res.status(404).send(
    //             Post.setErrors([
    //                 {
    //                     field: "",
    //                     message: `Post doesn't updated`,
    //                 },
    //             ])
    //         );
    //         return;
    //     }
    //
    //     res.status(204).send(post);
    // }
    //
    // // .delete("/:id")
    // async deleteBlogger(req: Request<{ id: string }>, res: Response) {
    //     const bloggerId = req.params.id;
    //
    //     {
    //         const postValidation = new Post();
    //
    //         postValidation.id = bloggerId;
    //
    //         const errors = await Post.validate(postValidation);
    //
    //         if (errors) {
    //             res.status(400).send(errors);
    //             return;
    //         }
    //     }
    //
    //     const isDeleted = await this.commentsService.deletePost(bloggerId);
    //
    //     if (!isDeleted) {
    //         res.status(404).send(
    //             Post.setErrors([
    //                 {
    //                     field: "",
    //                     message: `Post doesn't deleted`,
    //                 },
    //             ])
    //         );
    //         return;
    //     }
    //
    //     res.sendStatus(204);
    // }

}
