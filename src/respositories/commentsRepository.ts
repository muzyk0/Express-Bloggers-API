import { OptionalId } from "mongodb";

import { CommentDTO, IComment } from "../entity/Comments";
import { CommentsModel } from "../entity/Comments/CommentsModel";
import { EntityManager } from "../lib/entityManager";
import { PaginatorOptions, ResponseDataWithPaginator } from "../lib/Paginator";
import { db } from "./db";

const commentsCollection = db.collection<IComment>("posts");

export class CommentsRepository implements ICommentsRepository {
    constructor(private m: EntityManager) {}
    async getComment({
        commentId,
    }: {
        commentId?: string;
        withArchived?: boolean;
    }): Promise<CommentDTO> {
        const result = await CommentsModel.findOne(
            { id: commentId },
            { postId: 0 }
        );

        return result as CommentDTO;

        // return this.m.findOne(
        //     "posts",
        //     {
        //         ...(commentId ? { commentId } : {}),
        //         withArchived,
        //     },
        //     paginatorOptions,
        //     { commentId: false }
        // );
    }

    async getPostComments(
        {
            postId: postId,
            withArchived,
        }: {
            postId?: string;
            withArchived?: boolean;
        },
        paginatorOptions?: PaginatorOptions
    ): Promise<ResponseDataWithPaginator<CommentDTO>> {
        return this.m.find(
            "posts",
            {
                ...(postId ? { postId: postId } : {}),
                withArchived,
            },
            paginatorOptions,
            { postId: false }
        );
    }

    async createPostComment(
        comment: OptionalId<IComment>
    ): Promise<CommentDTO | null> {
        await commentsCollection.insertOne(comment, {
            forceServerObjectId: true,
        });

        const newComment: CommentDTO | null = await commentsCollection.findOne(
            { id: comment.id },
            { projection: { _id: false, postId: false } }
        );

        if (!newComment) {
            return null;
        }

        return newComment;
    }
}

interface ICommentsRepository {
    getPostComments(
        filter: { postId?: string; withArchived?: boolean },
        paginatorOptions?: PaginatorOptions
    ): Promise<ResponseDataWithPaginator<CommentDTO>>;

    createPostComment(comment: IComment): Promise<CommentDTO | null>;
}
