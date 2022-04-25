import { OptionalId } from "mongodb";
import { db } from "./db";
import { IPost } from "../entity/Post";
import { EntityManager, TFilter } from "../lib/entityManager";
import { PaginatorOptions, ResponseDataWithPaginator } from "../lib/Paginator";
import { Nullable } from "../types/genericTypes";

const postsCollection = db.collection<IPost>("posts");

const m = new EntityManager(db);

export const postsRepository = {
    async getPosts(
        {
            searchNameTerm,
            bloggerId,
        }: { searchNameTerm?: string; bloggerId?: number },
        paginatorOptions?: PaginatorOptions
    ): Promise<ResponseDataWithPaginator<IPost>> {
        return m.find(
            "posts",
            {
                ...(searchNameTerm
                    ? { title: { $regex: searchNameTerm } }
                    : {}),
                ...(bloggerId ? { bloggerId } : {}),
            },
            paginatorOptions
        );
    },
    async getPostById(
        id: number,
        withArchived: boolean = false
    ): Promise<IPost | null> {
        return m.findOne("posts", { withArchived, id });
    },
    async createPost(post: OptionalId<IPost>): Promise<IPost | null> {
        await postsCollection.insertOne(post, { forceServerObjectId: true });

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
