import { OptionalId } from "mongodb";
import { IPost } from "../entity/Post";
import { EntityManager } from "../lib/entityManager";
import { PaginatorOptions, ResponseDataWithPaginator } from "../lib/Paginator";
import { db } from "./db";

const postsCollection = db.collection<IPost>("posts");

const m = new EntityManager(db);

export class PostsRepository {
    async getPosts(
        {
            searchNameTerm,
            bloggerId,
            withArchived,
        }: {
            searchNameTerm?: string;
            bloggerId?: IPost["id"];
            withArchived?: boolean;
        },
        paginatorOptions?: PaginatorOptions
    ): Promise<ResponseDataWithPaginator<IPost>> {
        return m.find(
            "posts",
            {
                ...(searchNameTerm
                    ? { title: { $regex: searchNameTerm } }
                    : {}),
                ...(bloggerId ? { bloggerId } : {}),
                withArchived,
            },
            paginatorOptions
        );
    }
    async getPostById(
        id: IPost["id"],
        withArchived: boolean = false
    ): Promise<IPost | null> {
        return m.findOne("posts", { withArchived, id });
    }
    async createPost(post: OptionalId<IPost>): Promise<IPost | null> {
        await postsCollection.insertOne(post, { forceServerObjectId: true });

        return post;
    }
    async updatePost(post: IPost): Promise<IPost | null> {
        const modifyPost = await postsCollection.findOneAndUpdate(
            { id: post.id },
            {
                $set: post,
            },
            { returnDocument: "after" }
        );

        return modifyPost.value;
    }
    async deletePostById(
        id: IPost["id"],
        options?: { softRemove: boolean }
    ): Promise<boolean> {
        const result = await m.deleteOne("posts", {
            id,
            softRemove: options?.softRemove,
        });

        return result;
    }
}
