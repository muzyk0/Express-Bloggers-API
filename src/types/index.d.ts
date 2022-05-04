import { UserAccessTokenPayload } from "../domain/authService";

declare global {
    declare namespace Express {
        export interface Request {
            ctx: UserAccessTokenPayload | null;
        }
    }
}
