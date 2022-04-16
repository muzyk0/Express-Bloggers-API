import { db } from "../domain/db";
import { EntityManager } from "../lib/orm";
import { Blogger } from "./bloggersRepository";

export interface Post {
    id: number;
    title: string;
    shortDescription: string;
    content: string;
    bloggerId: Blogger["id"];
    bloggerName: Blogger["name"];
}

export type PostInput = Partial<Pick<Post, "id">> &
    Pick<Post, "title" | "content" | "shortDescription" | "bloggerId">;

const postsCollection = db.collection<Post>("posts");

const m = new EntityManager(db);

export const postsRepository = {
    async getPosts(withArchived: boolean = false): Promise<Post[]> {
        return m.find("posts", { withArchived });
    },
    async getPostById(
        id: number,
        withArchived: boolean = false
    ): Promise<Post | null> {
        return m.findOne("posts", { withArchived, id });
    },
    async createPost(post: Required<PostInput>): Promise<Post | null> {
        const blogger = await m.findOne<Blogger>("bloggers", {
            id: post.bloggerId,
        });

        if (!blogger) {
            return null;
        }

        const newPost: Post = {
            ...post,
            bloggerName: blogger?.name,
        };

        await postsCollection.insertOne(newPost);

        return newPost;
    },
    async updatePost({
        id,
        title,
        bloggerId,
        content,
        shortDescription,
    }: Required<PostInput>): Promise<Post | null> {
        const blogger = await m.findOne<Blogger>("bloggers", { id: bloggerId });

        if (!blogger) {
            return null;
        }

        const modifyPost = await postsCollection.findOneAndUpdate(
            { id },
            {
                $set: {
                    title,
                    bloggerId,
                    content,
                    shortDescription,
                    bloggerName: blogger.name,
                },
            },
            { returnDocument: "after" }
        );

        return modifyPost.value;
    },
    async deletePostById(id: Post["id"]): Promise<boolean> {
        const result = await m.deleteOne("posts", { id });

        return result;
    },
};
