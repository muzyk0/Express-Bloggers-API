import { postsRepository } from "../respositories/postsRepository";
import { IPost, PostInput } from "../entity/Post";

export const postsService = {
    async findPosts(): Promise<IPost[]> {
        return postsRepository.getPosts();
    },
    async findPostById(id: number): Promise<IPost | null> {
        return postsRepository.getPostById(id);
    },
    async createPost(post: PostInput): Promise<IPost | null> {
        const newPostInput: Required<PostInput> = {
            ...post,
            id: +new Date(),
        };

        return postsRepository.createPost(newPostInput);
    },
    async updatePost(post: Required<PostInput>): Promise<IPost | null> {
        return postsRepository.updatePost(post);
    },
    async deletePost(id: IPost["id"]): Promise<boolean> {
        return postsRepository.deletePostById(id);
    },
};
