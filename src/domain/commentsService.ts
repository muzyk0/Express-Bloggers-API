import { v4 } from "uuid";

import { PaginatorOptions, ResponseDataWithPaginator } from "../lib/Paginator";
import { CommentsRepository } from "../respositories/commentsRepository";
import { PostsService } from "./postsService";
import { UsersService } from "./usersService";
import {CommentDTO, IComment} from "../entity/Comments/Comments";

export class CommentsService implements IPostsService {
    constructor(
        public postService: PostsService,
        public usersService: UsersService,
        public commentRepository: CommentsRepository
    ) {}
    async getComment(commentId: string): Promise<CommentDTO | null> {
        return this.commentRepository.getComment({
            commentId,
            withArchived: false,
        });
    }
    async getPostComments(
        postId: string,
        paginatorOptions?: PaginatorOptions
    ): Promise<ResponseDataWithPaginator<CommentDTO> | null> {
        return this.commentRepository.getPostComments(
            {
                postId,
                withArchived: false,
            },
            paginatorOptions
        );
    }

    async createComment({
        postId,
        userId,
        userLogin,
        comment,
    }: CreatePostQuery): Promise<CommentDTO | null> {
        const post = await this.postService.findPostById(postId);

        if (!post) {
            return null;
        }

        const newComment: IComment = {
            id: v4(),
            content: comment,
            userId,
            userLogin,
            postId: post.id,
            addedAt: new Date(),
        };

        return await this.commentRepository.createPostComment(newComment);
    }
    async updateComment(comment: UpdatePostQuery) {
        const updatedComment = await this.commentRepository.updatePostComment(
            comment
        );

        if (!updatedComment) {
            return null;
        }

        return updatedComment;
    }

    async removePostComment(commentId: string) {
        const updatedComment = await this.commentRepository.removePostComment(
            commentId
        );

        return updatedComment;
    }

    async checkCredentials(commentId: string, userId: string) {
        const comment = await this.commentRepository.getComment({ commentId });

        if (!comment) {
            return false;
        }

        if (comment.userId !== userId) {
            return false;
        }

        return true;
    }
}

interface IPostsService {
    getPostComments(
        postId: string
    ): Promise<ResponseDataWithPaginator<CommentDTO> | null>;
    createComment(data: CreatePostQuery): Promise<CommentDTO | null>;
    removePostComment(commentId: string): Promise<boolean>;
    checkCredentials(commentId: string, userId: string): Promise<boolean>;
}

interface CreatePostQuery {
    postId: string;
    userId: string;
    userLogin: string;
    comment: string;
}

type UpdatePostQuery = {
    commentId: string;
    comment: string;
};
