import { NextFunction, Request, Response } from "express";
import { commentsService } from "../ioCController";

export const isOwnership = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    const comment = await commentsService.getComment(id);

    if (!comment) {
        res.sendStatus(404);
    } else if (comment.userLogin != req.ctx!.login) {
        res.sendStatus(403);
    } else {
        next();
    }
};
