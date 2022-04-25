import { IPost, PostInput } from "../entity/Post";
import { PaginatorOptions, ResponseDataWithPaginator } from "../lib/Paginator";
import { postsRepository } from "../respositories/postsRepository";
import { bloggersService } from "./bloggersService";

export const postsService = {
    async findPosts(
        {
            searchNameTerm,
            bloggerId,
        }: { searchNameTerm?: string; bloggerId?: number },
        paginatorOptions?: PaginatorOptions
    ): Promise<ResponseDataWithPaginator<IPost>> {
        return postsRepository.getPosts(
            { searchNameTerm, bloggerId, withArchived: false },
            paginatorOptions
        );
    },
    async findPostById(id: number): Promise<IPost | null> {
        return postsRepository.getPostById(id);
    },
    async createPost(post: PostInput): Promise<IPost | null> {
        const blogger = await bloggersService.findBloggerById(post.bloggerId);

        if (!blogger) {
            throw new Error("Blogger doesn't exist");
        }

        const newPostInput: IPost = {
            ...post,
            bloggerName: blogger.name,
            id: +new Date(),
        };

        return postsRepository.createPost(newPostInput);
    },
    async updatePost(post: Required<PostInput>): Promise<IPost | null> {
        const blogger = await bloggersService.findBloggerById(post.bloggerId);

        if (!blogger) {
            throw new Error("Blogger doesn't exist");
        }

        const newPost: IPost = {
            ...post,
            bloggerName: blogger.name,
        };

        return postsRepository.updatePost(newPost);
    },
    async deletePost(id: IPost["id"]): Promise<boolean> {
        return postsRepository.deletePostById(id);
    },
};
