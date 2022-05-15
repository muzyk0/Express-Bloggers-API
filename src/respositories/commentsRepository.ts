import { EntityManager } from "../lib/entityManager";
import { CommentDTO, IComment } from "../entity/Comments";
import { PaginatorOptions, ResponseDataWithPaginator } from "../lib/Paginator";
import { db } from "./db";
import { OptionalId } from "mongodb";

const commentsCollection = db.collection<IComment>("posts");

export class CommentsRepository implements ICommentsRepository {
    constructor(private m: EntityManager) {}

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
            paginatorOptions
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
