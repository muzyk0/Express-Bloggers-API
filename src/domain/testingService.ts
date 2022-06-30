import { TestingRepository } from '../respositories/testingRepository';

interface ITestingService {
    clearDatabase(): Promise<boolean>;
}

export class TestingService implements ITestingService {
    constructor(private testingRepository: TestingRepository) {}

    async clearDatabase(): Promise<boolean> {
        return this.testingRepository.clearDatabase();
    }
}
