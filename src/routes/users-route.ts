import express, { Request, Response } from "express";
import { usersService } from "../domain/usersService";
import { Paginator } from "../lib/Paginator";

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
            pageNumber: paginatorValues.pageNumber,
            pageSize: paginatorValues.pageSize,
        }
    );
    res.status(200).send(users);
});
