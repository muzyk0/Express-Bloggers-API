import { OptionalId } from "mongodb";
import { db } from "../domain/db";
import { IPost } from "../entity/Post";
import { EntityManager } from "../lib/orm";

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
    async createPost(post: OptionalId<IPost>): Promise<IPost | null> {
        await postsCollection.insertOne(post);

        return post;
    },
    async updatePost(post: IPost): Promise<IPost | null> {
        const modifyPost = await postsCollection.findOneAndUpdate(
            { id: post.id },
            {
                $set: post,
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
