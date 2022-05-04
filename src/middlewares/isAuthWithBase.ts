import { NextFunction, Request, Response } from "express";
import { BaseAuthPayload } from "../constants";
import { authService } from "../domain/authService";

export function isAuthWithBase(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.headers.authorization) {
        res.send(401);
        return;
    }

    if (req.headers.authorization.split(" ")[0] === "Bearer") {
        res.send(401);
        return;
    }

    const token = req.headers.authorization.split(" ")[1];

    const decodedBaseData = authService.decodeBaseAuth(token);

    if (
        (decodedBaseData.login !== BaseAuthPayload.login,
        decodedBaseData.password !== BaseAuthPayload.password)
    ) {
        res.send(401);
        return;
    }

    next();
}
