import mongoose from 'mongoose';
import { mongooseConnection } from '../../respositories/db';
import { v4 } from 'uuid';

export interface ILimit {
    id?: string;
    ip: string;
    url: string;
    createdAt?: Date;
}

export type LimitInput = Pick<ILimit, 'ip' | 'url'>;

export const LimitSchema = new mongoose.Schema<ILimit>({
    id: { type: String, default: v4() },
    ip: { type: String, required: true },
    url: { type: String, required: true },
    createdAt: { type: Date, required: true },
});

export const LimitsModel = mongooseConnection.model<ILimit>(
    'limits',
    LimitSchema,
    'limits'
);
