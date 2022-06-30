import { LimitInput } from '../entity/Limit/LimitModel';
import { LimitsRepository } from '../respositories/limitsRepository';
import { addMilliseconds } from 'date-fns';

export interface ILimitsControl {
    // checkLimitsMiddleware(
    //     req: Request,
    //     res: Response,
    //     next: NextFunction
    // ): Promise<void>;
    checkLimits(
        requestAttempt: LimitInput,
        limitMs: number,
        maxRequest: number
    ): Promise<boolean>;
}

export class LimitsControl implements ILimitsControl {
    constructor(private limitsRepository: LimitsRepository) {}

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
