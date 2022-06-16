import { NextFunction, Request, Response } from 'express';

export function CheckBodyIsEmpty(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.body) {
        res.sendStatus(400);
    }
    next();
}
