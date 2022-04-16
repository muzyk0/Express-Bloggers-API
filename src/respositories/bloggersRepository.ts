import { IsInt, Length, Matches } from "class-validator";
import { db } from "../domain/db";
import { ValidationErrors } from "../lib/errorsHelpers";
import { EntityManager } from "../lib/orm";

// export interface Blogger {
//     id: number;
//     name: string;
//     youtubeUrl: string;
// }

const youtubeURLPattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/;

export class Blogger extends ValidationErrors {
    @IsInt()
    id: number;

    @Length(1)
    name: string;

    @Length(1)
    @Matches(youtubeURLPattern)
    youtubeUrl: string;
}

const bloggersCollection = db.collection<Blogger>("bloggers");

const m = new EntityManager(db);

export const bloggersRepository = {
    // async getBloggers(withArchived: boolean = false): Promise<Blogger[]> {
    //     return bloggersCollection
    //         .find(withArchived ? {} : { deleted: { $exists: false } })
    //         .toArray();
    // },
    async getBloggers(withArchived: boolean = false): Promise<Blogger[]> {
        return m.find<Blogger>("bloggers", { withArchived });
    },
    // async getBloggerById(
    //     id: number,
    //     withArchived: boolean = false
    // ): Promise<Blogger | null> {
    //     return await bloggersCollection.findOne({
    //         id: id,
    //         ...(withArchived ? {} : { deleted: { $exists: false } }),
    //     });
    // },
    async getBloggerById(
        id: number,
        withArchived: boolean = false
    ): Promise<Blogger | null> {
        return m.findOne<Blogger>("bloggers", { withArchived, id });
    },
    async createBlogger(blogger: Blogger): Promise<Blogger> {
        await bloggersCollection.insertOne(blogger);
        return blogger;
    },
    async updateBlogger(
        id: number,
        blogger: Pick<Blogger, "name" | "youtubeUrl">
    ): Promise<Blogger | null> {
        const result = await bloggersCollection.findOneAndUpdate(
            { id: id, deleted: { $exists: false } },
            {
                $set: {
                    ...blogger,
                },
            },
            { returnDocument: "after" }
        );
        return result.value;
    },
    async deleteBlogger(
        id: number,
        options?: { softRemove: boolean }
    ): Promise<boolean> {
        if (options?.softRemove) {
            const result = await bloggersCollection.updateOne(
                { id, deleted: { $exists: false } },
                {
                    $currentDate: { deleted: true },
                }
            );

            return !!result.matchedCount;
        }

        const result = await bloggersCollection.deleteOne({ id });

        if (result.deletedCount) {
            return true;
        }
        return false;
    },
};
