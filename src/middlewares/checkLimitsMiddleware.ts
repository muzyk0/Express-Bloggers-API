import { NextFunction, Request, Response } from 'express';
import { LimitsControl } from './limitsControl';
import { limitsRepository } from '../ioCController';

export const checkLimitsMiddleware = async (
    { ip, url }: Request,
    res: Response,
    next: NextFunction
) => {
    const maxLimitInterval = 10 * 1000;
    let maxRequest = 5;

    const limitsControl = new LimitsControl(limitsRepository);

    const isContinue = await limitsControl.checkLimits(
        { ip, url },
        maxLimitInterval,
        maxRequest
    );

    if (!isContinue) {
        res.sendStatus(429);
        return;
    }

    next();
};
