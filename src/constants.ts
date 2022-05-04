export const PORT = process.env.PORT ?? 5000;

/**
 * This is base URL for API.
 * @use "/api"
 */
export const BASE_URL = process.env.BASE_URL ?? "";

export const MONGO_URI: string =
    process.env.MONGO_URI ||
    "mongodb://localhost:27017/?maxPoolSize=20&w=majority";

export const ACCESS_TOKEN_SECRET =
    process.env.ACCESS_TOKEN_SECRET ?? "this is secret code for token";

export enum BaseAuthPayload {
    login = "admin",
    password = "qwerty",
}
