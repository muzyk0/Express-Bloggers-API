import { LimitInput } from '../entity/Limit/LimitModel';
import { LimitsRepository } from '../respositories/limitsRepository';
import { addMilliseconds } from 'date-fns';
import { NextFunction, Request, Response } from 'express';

export interface ILimitsControl {
    checkLimitsMiddleware(req: Request, res: Response): Promise<void>;
    checkLimits(requestAttempt: LimitInput): Promise<boolean>;
}

export class LimitsControl {
    constructor(private limitsRepository: LimitsRepository) {}

    async checkLimitsMiddleware(
        { ip, url }: Request,
        res: Response,
        next: NextFunction
    ) {
        const maxLimitInterval = 10 * 1000;
        let maxRequest = 5;

        const isContinue = await this.checkLimits(
            { ip, url },
            maxLimitInterval,
            maxRequest
        );

        if (!isContinue) {
            res.sendStatus(429);
            return;
        }

        next();
    }

    async checkLimits(
        { ip, url }: LimitInput,
        limitMs: number,
        maxRequest: number
    ) {
        const currentDate = new Date();
        const dateFrom = addMilliseconds(currentDate, -limitMs);
        const countRequestAttempts = await this.limitsRepository.getAttempts(
            ip,
            url,
            dateFrom
        );
        await this.limitsRepository.addAttempt({ ip, url });

        if (countRequestAttempts < maxRequest) {
            return true;
        }
        return false;
    }
}
