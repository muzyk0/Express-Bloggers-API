import { db } from "../domain/db";
import { IBlogger } from "../entity/Blogger";
import { EntityManager } from "../lib/orm";
import { IPost, PostInput } from "../entity/Post";

const postsCollection = db.collection<IPost>("posts");

const m = new EntityManager(db);

export const postsRepository = {
    async getPosts(withArchived: boolean = false): Promise<IPost[]> {
        return m.find("posts", { withArchived });
    },
    async getPostById(
        id: number,
        withArchived: boolean = false
    ): Promise<IPost | null> {
        return m.findOne("posts", { withArchived, id });
    },
    async createPost(post: Required<PostInput>): Promise<IPost | null> {
        const blogger = await m.findOne<IBlogger>("bloggers", {
            id: post.bloggerId,
        });

        if (!blogger) {
            return null;
        }

        const newPost: IPost = {
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
    }: Required<PostInput>): Promise<IPost | null> {
        const blogger = await m.findOne<IBlogger>("bloggers", {
            id: bloggerId,
        });

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
    async deletePostById(id: IPost["id"]): Promise<boolean> {
        const result = await m.deleteOne("posts", { id });

        return result;
    },
};
