import { Db, Filter, UpdateFilter, WithId } from "mongodb";
import { IPost } from "../entity/Post";

type TFilter<T = any> = {
    withArchived?: boolean;
} & Filter<T>;

type TCollection = "bloggers" | "posts";

export class EntityManager {
    constructor(protected bd: Db) {}

    async find<C = any>(
        collection: TCollection,
        { withArchived = false, ...options }: TFilter<any>
    ): Promise<WithId<C>[]> {
        return await this.bd
            .collection<C>(collection)
            .find({
                ...(options as Filter<C>),

                ...(options?.withArchived
                    ? {}
                    : { deleted: { $exists: false } }),
            })
            .toArray();
    }
    async findOne<C = any>(
        collection: TCollection,
        { withArchived = false, ...options }: TFilter<any>
    ): Promise<WithId<C> | null> {
        return await this.bd.collection<C>(collection).findOne({
            ...(options as Filter<C>),

            ...(options?.withArchived ? {} : { deleted: { $exists: false } }),
        });
    }
    async deleteOne<C = any>(
        collection: TCollection,
        { withArchived = false, ...options }: TFilter<any>
    ): Promise<boolean> {
        if (options?.softRemove) {
            const result = await this.bd
                .collection<C>(collection)
                .updateOne(
                    options as Filter<C>,
                    { $currentDate: { deleted: true } } as any
                );

            return !!result.matchedCount;
        }

        const result = await this.bd
            .collection<C>(collection)
            .deleteOne(options as Filter<C>);

        if (result.deletedCount) {
            return true;
        }
        return false;
    }
}
