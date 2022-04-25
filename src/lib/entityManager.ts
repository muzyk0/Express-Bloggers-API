import { Db, Filter, WithId } from "mongodb";
import { PaginatorOptions, ResponseDataWithPaginator } from "./Paginator";

export type TFilter<T = any> = {
    withArchived?: boolean;
    softRemove?: boolean;
} & Filter<T>;

type TCollection = "bloggers" | "posts";

export class EntityManager {
    constructor(protected bd: Db) {}

    async find<C = any>(
        collection: TCollection,
        { withArchived = false, ...options }: TFilter,
        { pageNumber, pageSize }: PaginatorOptions = {
            pageNumber: 1,
            pageSize: 10,
        }
    ): Promise<ResponseDataWithPaginator<C>> {
        const filter = {
            ...(options as Filter<C>),

            ...(withArchived ? {} : { deleted: { $exists: false } }),
        };

        const totalCount = await this.bd
            .collection<C>(collection)
            .countDocuments(filter);

        const totalPagesCount = Math.ceil(totalCount / pageSize);

        const result = await this.bd
            .collection<C>(collection)
            .find(filter, { projection: { _id: false } })
            .skip(
                pageNumber > 0
                    ? (totalPagesCount > pageNumber
                          ? pageNumber
                          : totalPagesCount - 1) * pageSize
                    : 0
            )
            .limit(pageSize)
            .toArray();

        return {
            pagesCount: totalPagesCount,
            pageNumber:
                totalPagesCount > pageNumber ? pageNumber + 1 : totalPagesCount,
            pageSize: pageSize,
            totalCount: totalCount,
            items: result as C[],
        };
    }
    async findOne<C = any>(
        collection: TCollection,
        { withArchived = false, ...options }: TFilter
    ): Promise<WithId<C> | null> {
        return await this.bd.collection<C>(collection).findOne(
            {
                ...(options as Filter<C>),

                ...(options?.withArchived
                    ? {}
                    : { deleted: { $exists: false } }),
            },
            // Удаляем _id
            { projection: { _id: false } }
        );
    }
    async deleteOne<C = any>(
        collection: TCollection,
        { withArchived = false, softRemove = true, ...options }: TFilter
    ): Promise<boolean> {
        if (softRemove) {
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
