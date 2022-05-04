import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { ACCESS_TOKEN_SECRET } from "../constants";

export interface UserAccessTokenPayload {
    userId: number;
}

export interface BaseAuthData {
    login: string;
    password: string;
}

export const authService = {
    createJWT(payload: UserAccessTokenPayload) {
        const token = jwt.sign(
            { userId: payload.userId },
            ACCESS_TOKEN_SECRET,
            {
                expiresIn: "1h",
            }
        );
        return token;
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, ACCESS_TOKEN_SECRET);
            return new ObjectId(result.userId);
        } catch (error) {
            return null;
        }
    },
    decodeBaseAuth(token: string): BaseAuthData {
        const buff = Buffer.from(token, "base64");

        const decodedString = buff.toString("ascii");

        const loginAndPassword = decodedString.split(":");

        return {
            login: loginAndPassword[0],
            password: loginAndPassword[1],
        };
    },
};
