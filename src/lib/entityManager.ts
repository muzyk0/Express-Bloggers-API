import { Db, Filter, WithId } from 'mongodb';
import { PaginatorOptions, ResponseDataWithPaginator } from './Paginator';

export type TFilter<T = any> = {
    withArchived?: boolean;
    softRemove?: boolean;
} & Filter<T>;

type TCollection = 'bloggers' | 'posts' | 'users' | 'comments';

export class EntityManager {
    constructor(protected bd: Db) {}

    async find<C = any>(
        collection: TCollection,
        { withArchived = false, ...options }: TFilter,
        { page: pageNumber, pageSize }: PaginatorOptions = {
            page: 1,
            pageSize: 10,
        },
        projection?: { [key: string]: boolean }
    ): Promise<ResponseDataWithPaginator<C>> {
        const filter: Filter<C> = {
            ...(options as Filter<C>),

            ...(withArchived ? {} : { deleted: { $exists: false } }),
        };

        const totalCount = await this.bd
            .collection<C>(collection)
            .countDocuments(filter);

        const totalPagesCount = Math.ceil(totalCount / pageSize);

        const result = await this.bd
            .collection<C>(collection)
            .find(filter, {
                projection: { _id: false, password: false, ...projection },
            })
            .skip(pageNumber > 0 ? (pageNumber - 1) * pageSize : 0)
            .limit(pageSize)
            .toArray();

        return {
            pagesCount: totalPagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
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
