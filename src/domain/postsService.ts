import {
    Post,
    PostInput,
    postsRepository,
} from "../respositories/postsRepository";

export const postsService = {
    async findPosts(): Promise<Post[]> {
        return postsRepository.getPosts();
    },
    async findPostById(id: number): Promise<Post | null> {
        return postsRepository.getPostById(id);
    },
    async createPost(post: PostInput): Promise<Post | null> {
        const newPostInput: Required<PostInput> = {
            ...post,
            id: +new Date(),
        };

        return postsRepository.createPost(newPostInput);
    },
    async updatePost(post: Required<PostInput>): Promise<Post | null> {
        return postsRepository.updatePost(post);
    },
    async deletePost(id: Post["id"]): Promise<boolean> {
        return postsRepository.deletePostById(id);
    },
};
