import { IPost, PostInput } from "../entity/Post";
import { PaginatorOptions, ResponseDataWithPaginator } from "../lib/Paginator";
import { PostsRepository } from "../respositories/postsRepository";
import { BloggersService } from "./bloggersService";

export class PostsService {
    constructor(
        public postsRepository: PostsRepository,
        public bloggersService: BloggersService
    ) {}

    async findPosts(
        {
            searchNameTerm,
            bloggerId,
        }: { searchNameTerm?: string; bloggerId?: number },
        paginatorOptions?: PaginatorOptions
    ): Promise<ResponseDataWithPaginator<IPost>> {
        return this.postsRepository.getPosts(
            { searchNameTerm, bloggerId, withArchived: false },
            paginatorOptions
        );
    }
    async findPostById(id: number): Promise<IPost | null> {
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
            id: +new Date(),
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
