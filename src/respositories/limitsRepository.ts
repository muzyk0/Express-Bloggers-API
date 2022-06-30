import { LimitInput, LimitsModel } from '../entity/Limit/LimitModel';

export interface ILimitsRepository {
    addAttempt(requestAttempt: LimitInput): Promise<boolean>;
    getAttempts(ip: string, url: string, fromDate: Date): Promise<number>;
    removeLatestAttempts(toDate: Date): Promise<boolean>;
}

export class LimitsRepository implements ILimitsRepository {
    async addAttempt({ url, ip }: LimitInput) {
        await LimitsModel.create({
            url,
            ip,
        });

        return true;
    }

    async getAttempts(
        ip: string,
        url: string,
        fromDate: Date
    ): Promise<number> {
        return LimitsModel.countDocuments({
            ip,
            url,
            createdAt: { $gt: fromDate },
        });
    }

    removeLatestAttempts(toDate: Date): Promise<boolean> {
        LimitsModel.findOneAndDelete({ createdAt: { $lt: toDate } });
        return Promise.resolve(false);
    }
}
