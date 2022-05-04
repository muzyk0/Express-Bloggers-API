import express, { Request, Response } from "express";
import { Paginator } from "../lib/Paginator";
import { usersService } from "../lib/usersService";

export const usersRoute = express.Router();

usersRoute.get("/", async (req: Request, res: Response) => {
    const paginatorValues = new Paginator(req.query);

    const paginatorValidateErrors = await Paginator.validate(paginatorValues);

    if (paginatorValidateErrors) {
        return res.status(400).send(paginatorValidateErrors);
    }

    const users = usersService.findUsers(
        {},
        {
            page: paginatorValues.PageNumber,
            pageSize: paginatorValues.PageSize,
        }
    );
    res.status(200).send(users);
});
