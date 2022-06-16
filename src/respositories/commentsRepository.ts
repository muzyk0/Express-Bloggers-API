import { OptionalId } from 'mongodb';

import { EntityManager } from '../lib/entityManager';
import { PaginatorOptions, ResponseDataWithPaginator } from '../lib/Paginator';
import { db } from './db';
import { CommentDTO, IComment } from '../entity/Comments/Comments';
import { CommentsModel } from '../entity/Comments/CommentsModel';

const commentsCollection = db.collection<IComment>('comments');

export class CommentsRepository implements ICommentsRepository {
    constructor(private m: EntityManager) {}
    async getComment({
        commentId,
    }: {
        commentId?: string;
        withArchived?: boolean;
    }): Promise<CommentDTO | null> {
        const result = await CommentsModel.findOne(
            { id: commentId },
            { _id: false, postId: 0 }
        );

        // const result = await commentsCollection.findOne(
        //     { id: commentId },
        //     { projection: { _id: false, postId: false } }
        // );

        return result;
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
            'comments',
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

    async updatePostComment({
        commentId,
        comment,
    }: UpdatePostQuery): Promise<CommentDTO | null> {
        await commentsCollection.updateOne(
            { id: commentId },
            { $set: { content: comment } }
        );

        const updatedComment: CommentDTO | null =
            await commentsCollection.findOne(
                { id: commentId },
                { projection: { _id: false, postId: false } }
            );

        if (!updatedComment) {
            return null;
        }

        return updatedComment;
    }

    async removePostComment(commentId: string): Promise<boolean> {
        // const result = await CommentsModel.deleteOne({ id: commentId });

        const result = await commentsCollection.deleteOne({ id: commentId });

        return result.deletedCount > 0;
    }
}

interface ICommentsRepository {
    getPostComments(
        filter: { postId?: string; withArchived?: boolean },
        paginatorOptions?: PaginatorOptions
    ): Promise<ResponseDataWithPaginator<CommentDTO>>;

    createPostComment(comment: IComment): Promise<CommentDTO | null>;

    updatePostComment(comment: UpdatePostQuery): Promise<CommentDTO | null>;

    removePostComment(commentId: string): Promise<boolean>;
}

type UpdatePostQuery = {
    commentId: string;
    comment: string;
};
