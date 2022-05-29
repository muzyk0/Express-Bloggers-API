import { v4 } from "uuid";

import { CommentDTO, IComment } from "../entity/Comments";
import { PaginatorOptions, ResponseDataWithPaginator } from "../lib/Paginator";
import { CommentsRepository } from "../respositories/commentsRepository";
import { PostsService } from "./postsService";
import { UsersService } from "./usersService";

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
    // async updatePost(post: Required<PostInput>): Promise<IPost | null> {
    //     const blogger = await this.bloggersService.findBloggerById(
    //         post.bloggerId
    //     );

    //     if (!blogger) {
    //         return null;
    //     }

    //     const newPost: IPost = {
    //         ...post,
    //         bloggerName: blogger.name,
    //     };

    //     return this.postsRepository.updatePost(newPost);
    // }
    // async deletePost(id: IPost["id"]): Promise<boolean> {
    //     return this.postsRepository.deletePostById(id, { softRemove: false });
    // }
}

interface IPostsService {
    getPostComments(
        postId: string
    ): Promise<ResponseDataWithPaginator<CommentDTO> | null>;
    createComment(data: CreatePostQuery): Promise<CommentDTO | null>;
}

interface CreatePostQuery {
    postId: string;
    userId: string;
    userLogin: string;
    comment: string;
}
