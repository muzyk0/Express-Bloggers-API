import { NextFunction, Request, Response } from 'express';
import { ioc } from '../ioCController';

export const isAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }

    if (req.headers.authorization.split(' ')[0] !== 'Bearer') {
        res.sendStatus(401);
        return;
    }

    const token = req.headers.authorization.split(' ')[1];

    const user = await ioc.authService.checkCredentialWithBearerToken(token);

    if (!user) {
        res.sendStatus(401);
        return;
    }

    req.ctx = {
        login: user.login,
        userId: user.id,
    };

    next();
};
