import { db } from "../domain/db";
import { IBlogger } from "../entity/Blogger";
import { EntityManager } from "../lib/orm";

// export interface Blogger {
//     id: number;
//     name: string;
//     youtubeUrl: string;
// }

const bloggersCollection = db.collection<IBlogger>("bloggers");

const m = new EntityManager(db);

export const bloggersRepository = {
    // async getBloggers(withArchived: boolean = false): Promise<Blogger[]> {
    //     return bloggersCollection
    //         .find(withArchived ? {} : { deleted: { $exists: false } })
    //         .toArray();
    // },
    async getBloggers(withArchived: boolean = false): Promise<IBlogger[]> {
        return m.find<IBlogger>("bloggers", { withArchived });
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
    ): Promise<IBlogger | null> {
        return m.findOne<IBlogger>("bloggers", { withArchived, id });
    },
    async createBlogger(blogger: IBlogger): Promise<IBlogger> {
        await bloggersCollection.insertOne(blogger);
        return blogger;
    },
    async updateBlogger(
        id: number,
        blogger: Pick<IBlogger, "name" | "youtubeUrl">
    ): Promise<IBlogger | null> {
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
