import { NextFunction, Request, Response } from "express";
import { BaseAuthPayload } from "../constants";
import { ioc } from "../ioCController";

export function isBaseAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }

    if (req.headers.authorization.split(" ")[0] !== "Basic") {
        res.sendStatus(401);
        return;
    }

    const token = req.headers.authorization.split(" ")[1];

    const decodedBaseData = ioc.authService.decodeBaseAuth(token);

    if (
        (decodedBaseData.login !== BaseAuthPayload.login,
        decodedBaseData.password !== BaseAuthPayload.password)
    ) {
        res.sendStatus(401);
        return;
    }

    next();
}
