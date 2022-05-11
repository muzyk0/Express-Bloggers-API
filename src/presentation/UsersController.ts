import { Request, Response } from "express";
import { Paginator } from "../lib/Paginator";
import { UsersService } from "../domain/usersService";
import { UserDTO, User } from "../entity/User";
import { PostsService } from "../domain/postsService";

export class UsersController {
    constructor(public usersService: UsersService) {}

    // .get("/")
    async getAllUsers(req: Request, res: Response) {
        const paginatorValues = new Paginator(req.query);

        const paginatorValidateErrors = await Paginator.validate(
            paginatorValues
        );

        if (paginatorValidateErrors) {
            res.status(400).send(paginatorValidateErrors);
            return;
        }

        const users = await this.usersService.findUsers(
            { searchNameTerm: paginatorValues.SearchNameTerm },
            {
                page: paginatorValues.PageNumber,
                pageSize: paginatorValues.PageSize,
            }
        );
        res.status(200).send(users);
    }

    // .post("/")
    async createNewUser(
        req: Request<{}, {}, { login: string; password: string }>,
        res: Response
    ) {
        const userValidation = new User();

        const { login, password } = req.body;

        userValidation.login = login;
        userValidation.password = password;

        const errors = await User.validate(userValidation);

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        const user = await this.usersService.createUser({ login, password });

        res.status(201).send(user);
    }

    async deleteUser(req: Request, res: Response) {
        const userId = req.params.id;

        const userValidation = new User();

        userValidation.id = userId;

        const errors = await User.validate(userValidation);

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        const isDeleted = await this.usersService.deleteUser(userId);

        if (!isDeleted) {
            res.status(404).send(
                User.setErrors([
                    {
                        field: "",
                        message: `User doesn't deleted`,
                    },
                ])
            );
            return;
        }

        res.sendStatus(204);
    }
}
