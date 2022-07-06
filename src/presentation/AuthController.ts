import { Request, Response } from 'express';
import { User, ValidationEmailConfirmationCode } from '../entity/User/User';
import { AuthService } from '../domain/authService';
import { setErrors } from '../lib/ValidationErrors';

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
                    field: 'loginOrPassword',
                    message: 'login or passoword is incorrect',
                },
            ]);

            res.status(401).send(generatedError);
            return;
        }

        res.status(200).send({
            token: token,
        });
    }

    async confirmAccount(
        req: Request<{}, {}, { code: string }>,
        res: Response
    ) {
        const { code } = req.body;

        const validate = new ValidationEmailConfirmationCode();

        validate.code = code;

        const errors = await ValidationEmailConfirmationCode.validate(validate);

        if (errors) {
            res.status(400).send(errors);
        }

        const isConfirmed = await this.authService.confirmAccount(code);

        if (!isConfirmed) {
            res.status(400).send(
                setErrors([{ field: 'code', message: 'Something error' }])
            );
            return;
        }

        res.sendStatus(204);
    }

    async resendConfirmationCode(
        req: Request<{}, {}, { email: string }>,
        res: Response
    ) {
        const { email } = req.body;

        const validate = new User();

        validate.email = email;

        const errors = await User.validate(validate);

        if (errors) {
            res.status(400).send(errors);
        }

        const isConfirmed = await this.authService.resendConfirmationCode(
            email
        );

        if (!isConfirmed) {
            res.status(400).send(
                setErrors([{ field: 'email', message: 'Something error' }])
            );
            return;
        }

        res.sendStatus(204);
    }
}
