import { Request, Response } from 'express';
import { TestingService } from '../domain/testingService';

interface ITestingController {
    clearDatabase(req: Request, res: Response): Promise<void>;
}

export class TestingController implements ITestingController {
    constructor(private testingService: TestingService) {}

    /**
     * Clear database
     */
    async clearDatabase(_req: Request, res: Response) {
        const isClear = await this.testingService.clearDatabase();

        if (!isClear) {
            res.sendStatus(406);
            return;
        }

        res.sendStatus(204);
    }
}
