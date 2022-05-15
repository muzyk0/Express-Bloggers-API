import { Request, Response } from "express";
import { User } from "../entity/User";
import { AuthService } from "../domain/authService";

export class AuthController {
    constructor(private authService: AuthService) {}
    async login(
        req: Request<{}, {}, { login: string; password: string }>,
        res: Response
    ) {
        const { login, password } = req.body;

        const validationUserData = new User();

        validationUserData.login = login;
        validationUserData.password = password;

        const errors = await User.validate(validationUserData);

        if (errors) {
            res.status(401).send(errors);
            return;
        }

        const token = await this.authService.login({
            login,
            password,
        });

        if (!token) {
            const generatedError = User.setErrors([
                {
                    field: "loginOrPassword",
                    message: "login or passoword is incorrect",
                },
            ]);

            res.status(401).send(generatedError);
            return;
        }

        res.status(200).send({
            token: token,
        });
    }
}
