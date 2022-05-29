import { IBlogger } from "../entity/Blogger/Blogger";
import { IPost, PostInput } from "../entity/Post";
import { PaginatorOptions, ResponseDataWithPaginator } from "../lib/Paginator";
import { PostsRepository } from "../respositories/postsRepository";
import { BloggersService } from "./bloggersService";
import { v4 } from "uuid";

export class PostsService {
    constructor(
        public postsRepository: PostsRepository,
        public bloggersService: BloggersService
    ) {}

    async findPosts(
        {
            searchNameTerm,
            bloggerId,
        }: { searchNameTerm?: string; bloggerId?: IBlogger["id"] },
        paginatorOptions?: PaginatorOptions
    ): Promise<ResponseDataWithPaginator<IPost>> {
        return this.postsRepository.getPosts(
            { searchNameTerm, bloggerId, withArchived: false },
            paginatorOptions
        );
    }
    async findPostById(id: IPost["id"]): Promise<IPost | null> {
        return this.postsRepository.getPostById(id);
    }
    async createPost(post: PostInput): Promise<IPost | null> {
        const blogger = await this.bloggersService.findBloggerById(
            post.bloggerId
        );

        if (!blogger) {
            return null;
        }

        const newPostInput: IPost = {
            ...post,
            bloggerName: blogger.name,
            id: v4(),
        };

        return this.postsRepository.createPost(newPostInput);
    }
    async updatePost(post: Required<PostInput>): Promise<IPost | null> {
        const blogger = await this.bloggersService.findBloggerById(
            post.bloggerId
        );

        if (!blogger) {
            return null;
        }

        const newPost: IPost = {
            ...post,
            bloggerName: blogger.name,
        };

        return this.postsRepository.updatePost(newPost);
    }
    async deletePost(id: IPost["id"]): Promise<boolean> {
        return this.postsRepository.deletePostById(id, { softRemove: false });
    }
}
