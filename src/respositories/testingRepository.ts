import { collections, mongooseConnection } from './db';

interface ITestingRepository {
    clearDatabase(): Promise<boolean>;
}

export class TestingRepository implements ITestingRepository {
    constructor() {}
    async clearDatabase(): Promise<boolean> {
        try {
            await Promise.all(
                collections.map(
                    async (collection) =>
                        await mongooseConnection.db
                            .collection(collection)
                            .deleteMany({})
                )
            );

            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}
