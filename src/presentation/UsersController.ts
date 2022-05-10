import { Request, Response } from "express";
import { Paginator } from "../lib/Paginator";
import { UsersService } from "../domain/usersService";

export class UsersController {
    constructor(public usersService: UsersService) {}

    async getAllUsers(req: Request, res: Response) {
        const paginatorValues = new Paginator(req.query);

        const paginatorValidateErrors = await Paginator.validate(
            paginatorValues
        );

        if (paginatorValidateErrors) {
            return res.status(400).send(paginatorValidateErrors);
        }

        const users = this.usersService.findUsers(
            {},
            {
                page: paginatorValues.PageNumber,
                pageSize: paginatorValues.PageSize,
            }
        );
        res.status(200).send(users);
    }
}
