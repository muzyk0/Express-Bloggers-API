import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { ACCESS_TOKEN_SECRET } from "../constants";
import bcrypt from "bcrypt";
import { UsersService } from "./usersService";

export interface UserAccessTokenPayload {
    userId: string;
}

export interface AuthData {
    login: string;
    password: string;
}

export class AuthService {
    constructor(private usersService: UsersService) {}
    createJWT(payload: UserAccessTokenPayload) {
        const token = jwt.sign(
            { userId: payload.userId },
            ACCESS_TOKEN_SECRET,
            {
                expiresIn: "1h",
            }
        );
        return token;
    }
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, ACCESS_TOKEN_SECRET);
            return new ObjectId(result.userId);
        } catch (error) {
            return null;
        }
    }
    decodeBaseAuth(token: string): AuthData {
        const buff = Buffer.from(token, "base64");

        const decodedString = buff.toString("ascii");

        const loginAndPassword = decodedString.split(":");

        return {
            login: loginAndPassword[0],
            password: loginAndPassword[1],
        };
    }
    async loginAndCheckCredential({
        login,
        password,
    }: AuthData): Promise<string | null> {
        const user = await this.usersService.findUserByLogin(login);

        if (!user) {
            return null;
        }

        const isEqual = await this.comparePassword(password, user.password);

        if (!isEqual) {
            return null;
        }

        const token = this.createJWT({ userId: user.id });

        return token;
    }
    async comparePassword(password: string, userPassword: string) {
        try {
            return bcrypt.compare(password, userPassword);
        } catch {
            return false;
        }
    }
}
