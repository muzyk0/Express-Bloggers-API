import { Request, Response } from "express";
import { Post } from "../entity/Post";
import { CommentsService } from "../domain/commentsService";
import { Comment } from "../entity/Comments/Comments";

export class CommentsController {
    constructor(private commentsService: CommentsService) {}

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

    // .put("/:id")
    async updateComment(
        req: Request<
            { id: string },
            {},
            {
                content: string;
            }
        >,
        res: Response
    ) {
        const { content } = req.body;
        const { id } = req.params;

        {
            const commentValidation = new Comment();

            commentValidation.id = id;
            commentValidation.content = content?.trim();

            const errors = await Post.validate(commentValidation);

            if (errors) {
                res.status(400).send(errors);
                return;
            }
        }

        const isOwnership = this.commentsService.checkCredentials(
            id,
            req.ctx!.userId
        );

        if (!isOwnership) {
            res.sendStatus(403);
            return;
        }

        const comment = await this.commentsService.updateComment({
            commentId: id,
            comment: content,
        });

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

        res.status(204).send(comment);
    }

    // // .delete("/:id")
    async deleteComment(req: Request<{ id: string }>, res: Response) {
        const commentId = req.params.id;

        {
            const commentValidation = new Comment();

            commentValidation.id = commentId;

            const errors = await Post.validate(commentValidation);

            if (errors) {
                res.status(400).send(errors);
                return;
            }
        }

        const isDeleted = await this.commentsService.removePostComment(
            commentId
        );

        if (!isDeleted) {
            res.status(404).send(
                Post.setErrors([
                    {
                        field: "",
                        message: `Comment doesn't deleted`,
                    },
                ])
            );
            return;
        }

        res.sendStatus(204);
    }
}
